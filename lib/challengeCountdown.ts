// Daily job: keeps two Kit custom fields current for each challenge subscriber, both worked out
// from that subscriber's own `challenge_start_date`, so every cohort runs the same way:
//   days_until_challenge_start  7, 6 ... 0, then negative: countdown emails
//   challenge_day               0 before day 1, 1..7 during, "done" after: daily-lesson emails
// A Kit visual automation sends on "custom field changes to ...". Run by Vercel Cron (app/api/cron/challenge-countdown) and by hand
// (scripts/sync-challenge-countdown.ts).
//
// Writes go one subscriber at a time (PUT /v4/subscribers/:id with the field key), not through
// Kit's bulk custom-field endpoint: that endpoint only accepts OAuth, and this project
// authenticates with an API key. Rate limits (429) are retried with backoff inside lib/kit.ts.

import {
  kitFindCustomFieldId,
  kitGetSubscriber,
  kitListTagSubscribers,
  kitUpdateSubscriberFields,
  type KitSubscriberRow,
} from '@/lib/kit'
import {
  MIN_COUNTDOWN_DAY,
  challengeDayFor,
  countdownDate,
  computeChallengeDay,
  computeDaysUntilChallengeStart,
} from '@/lib/startCountdown'

/** Kit tag `7-day-challenge`. */
export const CHALLENGE_TAG_ID = 25327631
const START_FIELD = 'challenge_start_date'
const COUNTDOWN_FIELD = 'days_until_challenge_start'
const DAY_FIELD = 'challenge_day'
const CONCURRENCY = 4

export type CountdownSummary = {
  checked: number
  updated: number
  unchanged: number
  skipped: number
  failed: number
  dryRun: boolean
  today: string
}

export type KitCountdownApi = {
  listTagSubscribers: typeof kitListTagSubscribers
  getSubscriber: (id: number) => Promise<KitSubscriberRow>
  findCustomFieldId: (key: string) => Promise<number | null>
  updateFields: (id: number, fields: Record<string, string>) => Promise<void>
}

const realApi: KitCountdownApi = {
  listTagSubscribers: kitListTagSubscribers,
  getSubscriber: kitGetSubscriber,
  findCustomFieldId: kitFindCustomFieldId,
  updateFields: kitUpdateSubscriberFields,
}

const text = (v: unknown): string => (typeof v === 'string' ? v.trim() : v == null ? '' : String(v))

export async function syncChallengeCountdown(
  opts: { dryRun?: boolean; today?: string; dayToday?: string; only?: 'countdown' | 'day'; now?: Date; api?: KitCountdownApi; log?: (msg: string) => void } = {},
): Promise<CountdownSummary> {
  const api = opts.api ?? realApi
  const log = opts.log ?? ((m: string) => console.log(m))
  const dryRun = opts.dryRun ?? process.env.DRY_RUN === 'true'
  const today = opts.today ?? countdownDate()
  // challenge_day follows the send times (9 AM daily, Day 1 at 2:15 PM; see challengeDayFor). Tests
  // can pin a plain date with dayToday/today instead.
  const dayDate = opts.dayToday ?? opts.today
  const nowDate = opts.now ?? new Date()
  const wantCountdown = opts.only !== 'day'
  const wantDay = opts.only !== 'countdown'
  const summary: CountdownSummary = { checked: 0, updated: 0, unchanged: 0, skipped: 0, failed: 0, dryRun, today }

  // Fail fast, with a clear message, if the Kit field hasn't been created.
  for (const key of [wantCountdown && COUNTDOWN_FIELD, wantDay && DAY_FIELD].filter((k): k is string => !!k)) {
    if ((await api.findCustomFieldId(key)) === null) {
      throw new Error(`challenge countdown: Kit custom field "${key}" does not exist`)
    }
  }

  async function handle(row: KitSubscriberRow): Promise<void> {
    summary.checked++
    try {
      let fields = row.fields
      // The tag listing may not carry custom field values; confirm on the subscriber itself
      // before skipping, and so "unchanged" is judged against what Kit really holds.
      if (!fields || !(START_FIELD in fields) || !(COUNTDOWN_FIELD in fields) || !(DAY_FIELD in fields)) {
        fields = (await api.getSubscriber(row.id)).fields
      }
      const days = computeDaysUntilChallengeStart(text(fields?.[START_FIELD]), today)
      if (days === null) {
        console.warn(`challenge countdown: subscriber ${row.id} has an empty or invalid ${START_FIELD}; skipped`)
        summary.skipped++
        return
      }
      if (days < MIN_COUNTDOWN_DAY) {
        summary.unchanged++ // long past the challenge: leave the field alone
        return
      }
      // One write per subscriber covers both fields, and only what actually changed.
      const wanted: Record<string, string> = {}
      if (wantCountdown) wanted[COUNTDOWN_FIELD] = String(days)
      if (wantDay) wanted[DAY_FIELD] = (dayDate ? computeChallengeDay(text(fields?.[START_FIELD]), dayDate) : challengeDayFor(text(fields?.[START_FIELD]), nowDate)) ?? '0'
      const changes: Record<string, string> = {}
      for (const [key, value] of Object.entries(wanted)) if (text(fields?.[key]) !== value) changes[key] = value
      if (Object.keys(changes).length === 0) {
        summary.unchanged++
        return
      }
      if (dryRun) {
        const was = Object.keys(changes).map((k) => `${k} ${text(fields?.[k]) || '(empty)'} -> ${changes[k]}`)
        log(`[dry run] subscriber ${row.id}: ${was.join(', ')}`)
      } else await api.updateFields(row.id, changes)
      summary.updated++
    } catch (err) {
      summary.failed++
      console.error(`challenge countdown: subscriber ${row.id} failed:`, err instanceof Error ? err.message : err)
    }
  }

  let after: string | undefined
  for (;;) {
    const page = await api.listTagSubscribers(CHALLENGE_TAG_ID, after)
    for (let i = 0; i < page.subscribers.length; i += CONCURRENCY) {
      await Promise.all(page.subscribers.slice(i, i + CONCURRENCY).map(handle))
    }
    if (!page.hasNextPage || !page.endCursor) break
    after = page.endCursor
  }

  log(
    `challenge countdown ${dryRun ? '(DRY RUN) ' : ''}for ${today}: checked ${summary.checked}, ` +
      `${dryRun ? 'would update' : 'updated'} ${summary.updated}, unchanged ${summary.unchanged}, ` +
      `skipped ${summary.skipped}, failed ${summary.failed}`,
  )
  return summary
}
