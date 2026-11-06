// Daily job: keeps each challenge subscriber's Kit custom field `days_until_challenge_start`
// current, so a Kit visual automation can send countdown emails on "custom field changes to 7 / 5 /
// 3 / 0 ...". Run by Vercel Cron (app/api/cron/challenge-countdown) and by hand
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
import { MIN_COUNTDOWN_DAY, chicagoToday, computeDaysUntilChallengeStart } from '@/lib/startCountdown'

/** Kit tag `7-day-challenge`. */
export const CHALLENGE_TAG_ID = 25327631
const START_FIELD = 'challenge_start_date'
const COUNTDOWN_FIELD = 'days_until_challenge_start'
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
  opts: { dryRun?: boolean; today?: string; api?: KitCountdownApi; log?: (msg: string) => void } = {},
): Promise<CountdownSummary> {
  const api = opts.api ?? realApi
  const log = opts.log ?? ((m: string) => console.log(m))
  const dryRun = opts.dryRun ?? process.env.DRY_RUN === 'true'
  const today = opts.today ?? chicagoToday()
  const summary: CountdownSummary = { checked: 0, updated: 0, unchanged: 0, skipped: 0, failed: 0, dryRun, today }

  // Fail fast, with a clear message, if the Kit field hasn't been created.
  if ((await api.findCustomFieldId(COUNTDOWN_FIELD)) === null) {
    throw new Error(`challenge countdown: Kit custom field "${COUNTDOWN_FIELD}" does not exist`)
  }

  async function handle(row: KitSubscriberRow): Promise<void> {
    summary.checked++
    try {
      let fields = row.fields
      // The tag listing may not carry custom field values; confirm on the subscriber itself
      // before skipping, and so "unchanged" is judged against what Kit really holds.
      if (!fields || !(START_FIELD in fields) || !(COUNTDOWN_FIELD in fields)) {
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
      const next = String(days)
      if (text(fields?.[COUNTDOWN_FIELD]) === next) {
        summary.unchanged++
        return
      }
      if (dryRun) log(`[dry run] subscriber ${row.id}: ${COUNTDOWN_FIELD} ${text(fields?.[COUNTDOWN_FIELD]) || '(empty)'} -> ${next}`)
      else await api.updateFields(row.id, { [COUNTDOWN_FIELD]: next })
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
