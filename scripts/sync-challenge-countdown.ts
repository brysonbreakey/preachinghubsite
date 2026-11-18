// Run the daily challenge countdown by hand:
//   KIT_API_KEY=... DRY_RUN=true npx tsx scripts/sync-challenge-countdown.ts
// Leave DRY_RUN off to write for real. ONLY=day or ONLY=countdown limits it to one field.
import { syncChallengeCountdown } from "../lib/challengeCountdown";

syncChallengeCountdown({ only: process.env.ONLY === "day" ? "day" : process.env.ONLY === "countdown" ? "countdown" : undefined })
  .then((s) => process.exit(s.failed ? 1 : 0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
