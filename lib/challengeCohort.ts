import { supabaseAdmin } from "@/lib/supabase";
import { DEFAULT_COHORT, cohortFromRow, type PublicCohort } from "@/lib/challengeCohortCore";

// Server only (reads the database). The words and math live in challengeCohortCore.ts, which a
// browser component can import too.

// ---- Reading the active cohort ---------------------------------------------------------------

let cache: { at: number; cohort: PublicCohort } | null = null;
const TTL_MS = 60_000;

/** The cohort the site is showing: the newest run with saved settings, else the default. Cached
 *  for a minute. Never throws. */
export async function getCohort(): Promise<PublicCohort> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.cohort;
  let cohort = DEFAULT_COHORT;
  try {
    const { data } = await supabaseAdmin().from("challenge_runs").select("*").not("start_date", "is", null).order("start_date", { ascending: false }).limit(10);
    for (const row of data ?? []) {
      const c = cohortFromRow(row as Record<string, unknown>);
      if (c) {
        cohort = c;
        break;
      }
    }
    // A run that exists for the default cohort can still carry its own call link before settings are saved.
    if (cohort === DEFAULT_COHORT) {
      const same = (data ?? []).find((r) => (r as Record<string, unknown>).start_date === DEFAULT_COHORT.startDate) as Record<string, unknown> | undefined;
      const link = typeof same?.meet_url === "string" ? same.meet_url.trim() : "";
      if (/^https:\/\/\S+$/.test(link)) cohort = { ...DEFAULT_COHORT, meetUrl: link };
    }
  } catch {
    // keep the default
  }
  cache = { at: Date.now(), cohort };
  return cohort;
}

/** For tests. */
export function resetCohortCache() {
  cache = null;
}
