const KIT_API_BASE = 'https://api.kit.com/v4'

function kitHeaders(): Record<string, string> {
  const apiKey = process.env.KIT_API_KEY
  if (!apiKey) throw new Error('kit: KIT_API_KEY not configured')
  return { 'Content-Type': 'application/json', 'X-Kit-Api-Key': apiKey }
}

async function kitFetch(path: string, init: RequestInit): Promise<any> {
  const res = await fetch(`${KIT_API_BASE}${path}`, {
    ...init,
    headers: { ...kitHeaders(), ...(init.headers as Record<string, string> | undefined) },
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`kit: ${init.method || 'GET'} ${path} failed (${res.status}): ${body}`)
  }
  return res.json()
}

async function upsertSubscriber({
  email,
  firstName,
}: {
  email: string
  firstName?: string
}): Promise<number> {
  const data = await kitFetch('/subscribers', {
    method: 'POST',
    body: JSON.stringify({
      email_address: email,
      ...(firstName ? { first_name: firstName } : {}),
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
}: {
  email: string
  firstName?: string
  tags: string[]
}): Promise<void> {
  const subscriberId = await upsertSubscriber({ email, firstName })
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
}: {
  email: string
  firstName?: string
}): Promise<void> {
  await upsertContact({ email, firstName, tags: ['checklist'] })
}

/**
 * Adds/updates a contact in Kit tagged "try", for the free sermon
 * evaluator — shared by /try and /checklist/thank-you.
 */
export async function addTryLeadContact({
  email,
  firstName,
}: {
  email: string
  firstName?: string
}): Promise<void> {
  await upsertContact({ email, firstName, tags: ['try'] })
}
