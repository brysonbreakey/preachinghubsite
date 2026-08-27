"use client";

import posthog from "posthog-js";
import { useEffect } from "react";

export default function PostHogInit() {
  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) return;
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN, {
      api_host: "/ingest",
      ui_host: "https://us.posthog.com",
      defaults: "2026-01-30",
      capture_exceptions: true,
      debug: process.env.NODE_ENV === "development",
    });
  }, []);

  return null;
}
