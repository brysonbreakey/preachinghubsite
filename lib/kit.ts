import { CHALLENGE_PASS_END_LABEL, CHALLENGE_START_DATE_LABEL, CHALLENGE_START_TIME_LABEL } from '@/lib/challenge'
import { MIN_COUNTDOWN_DAY, chicagoToday, challengeDayFor, computeDaysUntilChallengeStart } from '@/lib/startCountdown'
const KIT_API_BASE = 'https://api.kit.com/v4'

function kitHeaders(): Record<string, string> {
  const apiKey = process.env.KIT_API_KEY
  if (!apiKey) throw new Error('kit: KIT_API_KEY not configured')
  return { 'Content-Type': 'application/json', 'X-Kit-Api-Key': apiKey }
}

export class KitHttpError extends Error {
  status: number
  constructor(method: string, path: string, status: number, body: string) {
    super(`kit: ${method} ${path} failed (${status}): ${body}`)
    this.status = status
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

/**
 * `retries429` > 0 retries rate-limited (429) calls with backoff, honouring Retry-After. The
 * signup path leaves it at 0 so a visitor never waits on it; the daily job sets it.
 */
async function kitFetch(path: string, init: RequestInit, retries429 = 0): Promise<any> {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`${KIT_API_BASE}${path}`, {
      ...init,
      headers: { ...kitHeaders(), ...(init.headers as Record<string, string> | undefined) },
    })
    if (res.ok) return res.json()
    if (res.status === 429 && attempt < retries429) {
      const retryAfter = Number(res.headers.get('retry-after'))
      await sleep(Math.min(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 2000 * 2 ** attempt, 60_000))
      continue
    }
    const body = await res.text().catch(() => '')
    throw new KitHttpError(init.method || 'GET', path, res.status, body)
  }
}

async function upsertSubscriber({
  email,
  firstName,
  fields,
}: {
  email: string
  firstName?: string
  fields?: Record<string, string>
}): Promise<number> {
  const data = await kitFetch('/subscribers', {
    method: 'POST',
    body: JSON.stringify({
      email_address: email,
      ...(firstName ? { first_name: firstName } : {}),
      ...(fields && Object.keys(fields).length ? { fields } : {}),
    }),
  })
  return data.subscriber.id as number
}

/**
 * Kit's tag-create endpoint is idempotent and case-insensitive — it
 * returns the existing tag if one with that name already exists, so
 * this is safe to call on every request rather than caching tag ids.
 */
async function findOrCreateTag(name: string): Promise<number> {
  const data = await kitFetch('/tags', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
  return data.tag.id as number
}

async function applyTag(tagId: number, subscriberId: number): Promise<void> {
  await kitFetch(`/tags/${tagId}/subscribers/${subscriberId}`, {
    method: 'POST',
    body: JSON.stringify({}),
  })
}

async function upsertContact({
  email,
  firstName,
  tags,
  fields,
}: {
  email: string
  firstName?: string
  tags: string[]
  fields?: Record<string, string>
}): Promise<void> {
  const subscriberId = await upsertSubscriber({ email, firstName, fields })
  for (const tagName of tags) {
    const tagId = await findOrCreateTag(tagName)
    await applyTag(tagId, subscriberId)
  }
}

/**
 * Adds/updates a contact in Kit tagged "checklist", for the
 * Pre-Preaching Checklist lead-magnet funnel.
 */
export async function addChecklistContact({
  email,
  firstName,
  lastName,
  offerLink,
  phone,
}: {
  email: string
  firstName?: string
  lastName?: string
  offerLink?: string
  phone?: string
}): Promise<void> {
  // offer_link is a Kit custom field, referenced in a follow-up email as
  // {{ subscriber.offer_link }} so the button always points at the exact same
  // 24-hour offer this contact was given at signup, regardless of what device
  // they open that email on. last_name is Kit's "LAST NAME" custom field —
  // first_name is a native attribute, last name is not. Only sent when there
  // is one, so a single-word name can't blank out a last name already on file.
  const fields: Record<string, string> = {}
  if (offerLink) fields.offer_link = offerLink
  if (lastName) fields.last_name = lastName
  if (phone) fields.mobile_phone = phone

  await upsertContact({
    email,
    firstName,
    tags: ['checklist'],
    fields: Object.keys(fields).length ? fields : undefined,
  })
}

/**
 * Adds/updates a contact in Kit tagged "7-day-challenge", for the Free 7-Day
 * Preaching Growth Challenge signup. challengeLink is their personal "Open
 * PreachingHub" link, saved to the `challenge_link` custom field for the welcome email.
 */
export async function addSevenDayChallengeContact({
  email,
  firstName,
  lastName,
  phone,
  challengeLink,
}: {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  challengeLink?: string | null
}): Promise<void> {
  // last_name, mobile_phone and challenge_link are Kit custom fields; each is only sent when there
  // is a value so it can't blank one already on file (same pattern as the other lead magnets).
  const base: Record<string, string> = {}
  if (lastName) base.last_name = lastName
  if (phone) base.mobile_phone = phone
  // challenge_start_date is this cohort's kickoff day, so welcome emails can say when it starts.
  const full: Record<string, string> = {
    ...base,
    challenge_start_date: CHALLENGE_START_DATE_LABEL,
    challenge_pass_end: CHALLENGE_PASS_END_LABEL,
    challenge_start_time: CHALLENGE_START_TIME_LABEL,
  }
  if (challengeLink) full.challenge_link = challengeLink
  // Late joiners land on the right countdown day right away instead of waiting for the daily job.
  const days = computeDaysUntilChallengeStart(CHALLENGE_START_DATE_LABEL, chicagoToday())
  if (days !== null && days >= MIN_COUNTDOWN_DAY) full.days_until_challenge_start = String(days)
  // Same for challenge_day, so someone from an earlier cohort who signs up again isn't left on "done".
  const day = challengeDayFor(CHALLENGE_START_DATE_LABEL)
  if (day !== null) full.challenge_day = day
  const toFields = (f: Record<string, string>) => (Object.keys(f).length ? f : undefined)
  try {
    await upsertContact({ email, firstName, tags: ['7-day-challenge'], fields: toFields(full) })
  } catch (err) {
    // If challenge_link or challenge_start_date hasn't been created in Kit yet, the signup must
    // still go through (and be tagged): retry without them and say so loudly in the logs.
    console.error('kit: challenge signup failed; retrying without its custom fields (are challenge_link, challenge_start_date, challenge_start_time, challenge_pass_end, days_until_challenge_start and challenge_day created in Kit?)', err)
    await upsertContact({ email, firstName, tags: ['7-day-challenge'], fields: toFields(base) })
  }
}

/**
 * Adds/updates a contact in Kit tagged "7-day-challenge-checkout-started": someone who filled in
 * the form and was sent to pay the $7, but hasn't paid yet. They only get the real
 * "7-day-challenge" tag (addSevenDayChallengeContact) once Stripe confirms the payment, so a Kit
 * segment of "checkout-started and not 7-day-challenge" is the follow-up list.
 */
export async function addSevenDayChallengeCheckoutStartedContact({
  email,
  firstName,
  lastName,
  phone,
}: {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
}): Promise<void> {
  const fields: Record<string, string> = {}
  if (lastName) fields.last_name = lastName
  if (phone) fields.mobile_phone = phone
  await upsertContact({
    email,
    firstName,
    tags: ['7-day-challenge-checkout-started'],
    fields: Object.keys(fields).length ? fields : undefined,
  })
}

/**
 * Adds/updates a contact in Kit tagged "7-day-challenge-waitlist", for people who sign up after
 * enrollment for the challenge has closed.
 */
export async function addSevenDayChallengeWaitlistContact({
  email,
  firstName,
  lastName,
  phone,
}: {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
}): Promise<void> {
  const fields: Record<string, string> = {}
  if (lastName) fields.last_name = lastName
  if (phone) fields.mobile_phone = phone
  await upsertContact({
    email,
    firstName,
    tags: ['7-day-challenge-waitlist'],
    fields: Object.keys(fields).length ? fields : undefined,
  })
}

/**
 * Adds/updates a contact in Kit tagged "try", for the free sermon
 * evaluator — shared by /try and /checklist/thank-you.
 */
export async function addTryLeadContact({
  email,
  firstName,
  lastName,
  phone,
}: {
  email: string
  firstName?: string
  lastName?: string
  phone?: string
}): Promise<void> {
  // "Mobile Phone" is a Kit custom field (key mobile_phone). Like last_name, it's
  // only sent when there is one, so a form without a phone field (the
  // /checklist/thank-you evaluator) can't blank a number already on file.
  const fields: Record<string, string> = {}
  if (lastName) fields.last_name = lastName
  if (phone) fields.mobile_phone = phone
  await upsertContact({
    email,
    firstName,
    tags: ['try'],
    fields: Object.keys(fields).length ? fields : undefined,
  })
}

/**
 * Adds/updates a contact in Kit tagged "checklist-interactive-save" —
 * fired when someone uses the interactive checklist's "save progress" flow.
 */
export async function addChecklistSaveContact({
  email,
  firstName,
}: {
  email: string
  firstName?: string
}): Promise<void> {
  await upsertContact({ email, firstName, tags: ['checklist-interactive-save'] })
}


// ---- Daily countdown job helpers (used by lib/challengeCountdown.ts) ----------------------------

const JOB_RETRIES = 5

export type KitSubscriberRow = {
  id: number
  fields: Record<string, string | null> | null
}

/** One page of the subscribers carrying a tag, with their custom field values when Kit returns
 *  them. Follow `endCursor` (Kit's `after`) while `hasNextPage`. */
export async function kitListTagSubscribers(
  tagId: number,
  after?: string,
): Promise<{ subscribers: KitSubscriberRow[]; hasNextPage: boolean; endCursor: string | null }> {
  const qs = new URLSearchParams({ per_page: '100', include: 'fields' })
  if (after) qs.set('after', after)
  const data = await kitFetch(`/tags/${tagId}/subscribers?${qs}`, { method: 'GET' }, JOB_RETRIES)
  return {
    subscribers: (data.subscribers ?? []).map((s: { id: number; fields?: Record<string, string | null> }) => ({ id: s.id, fields: s.fields ?? null })),
    hasNextPage: Boolean(data.pagination?.has_next_page),
    endCursor: data.pagination?.end_cursor ?? null,
  }
}

/** One subscriber with all custom field values. */
export async function kitGetSubscriber(id: number): Promise<KitSubscriberRow> {
  const data = await kitFetch(`/subscribers/${id}`, { method: 'GET' }, JOB_RETRIES)
  return { id: data.subscriber.id, fields: data.subscriber.fields ?? null }
}

/** Looks a custom field up by its key (e.g. "days_until_challenge_start"); null if it doesn't exist. */
export async function kitFindCustomFieldId(key: string): Promise<number | null> {
  let after: string | undefined
  for (;;) {
    const qs = new URLSearchParams({ per_page: '1000' })
    if (after) qs.set('after', after)
    const data = await kitFetch(`/custom_fields?${qs}`, { method: 'GET' }, JOB_RETRIES)
    const hit = (data.custom_fields ?? []).find((f: { key: string }) => f.key === key)
    if (hit) return hit.id as number
    if (!data.pagination?.has_next_page) return null
    after = data.pagination.end_cursor
  }
}

/** Writes custom field values on one subscriber, by field key. */
export async function kitUpdateSubscriberFields(id: number, fields: Record<string, string>): Promise<void> {
  await kitFetch(`/subscribers/${id}`, { method: 'PUT', body: JSON.stringify({ fields }) }, JOB_RETRIES)
}
