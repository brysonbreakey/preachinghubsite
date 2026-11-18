// The Meta "Lead" conversion event for /checklist/thank-you, fired ONLY for people who said on the
// /checklist form that they preach most weeks. (A PageView alone only measures visits; Meta
// optimizes ad delivery toward a conversion event such as Lead, so this is what trains it to find
// more people who preach often.) The form sets a one-time flag in sessionStorage when the server
// says the signup is "qualified"; the thank-you page consumes it and fires the event once. So the
// event fires right after a qualifying signup, and never for someone who opens the thank-you page
// from an email link, a bookmark, or a refresh.

export const LEAD_FLAG_KEY = "ph_meta_lead_qualified";

type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;
type Fbq = (command: string, event: string, params?: Record<string, unknown>) => void;

/** Called by the form after the server says this signup is qualified. Best effort. */
export function markQualifiedLead(storage: StorageLike | undefined): void {
  try {
    storage?.setItem(LEAD_FLAG_KEY, "1");
  } catch {
    // storage blocked: the event just won't fire
  }
}

/** True once if the flag was set, and clears it, so a refresh or a second visit doesn't fire again. */
export function consumeQualifiedLead(storage: StorageLike | undefined): boolean {
  try {
    if (storage?.getItem(LEAD_FLAG_KEY) !== "1") return false;
    storage.removeItem(LEAD_FLAG_KEY);
    return true;
  } catch {
    return false;
  }
}

/** Fires the Lead event if the flag was set and Meta's pixel (fbq) is present. Returns whether it fired. */
export function fireQualifiedLead(storage: StorageLike | undefined, fbq: Fbq | undefined): boolean {
  if (!consumeQualifiedLead(storage)) return false;
  if (typeof fbq !== "function") return false;
  // No personal information in the parameters.
  fbq("track", "Lead", { content_name: "Pre-Preaching Checklist", content_category: "preaches_most_weeks" });
  return true;
}
