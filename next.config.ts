import type { NextConfig } from "next";

const APP_URL = "https://app.preachinghub.com";

// Routes that only exist in the app (not the marketing site) — send visitors
// straight there instead of showing a 404.
const APP_ONLY_PATHS = [
  "account",
  "admin",
  "auth",
  "calendar",
  "coach",
  "evaluate",
  "fingerprint",
  "invite",
  "join-team",
  "migrate",
  "onboarding",
  "prep",
  "research-tools",
  "settings",
  "team",
  "templates",
];

const nextConfig: NextConfig = {
  async redirects() {
    return APP_ONLY_PATHS.map((path) => ({
      source: `/${path}/:rest*`,
      destination: `${APP_URL}/${path}/:rest*`,
      permanent: false,
    }));
  },
};

export default nextConfig;
