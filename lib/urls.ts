export const APP_URL = "https://app.preachinghub.com";
export const SIGNUP_URL = `${APP_URL}/auth/login?mode=signup`;

export function buildSignupUrl(source: string, email?: string) {
  const params = new URLSearchParams({ mode: "signup", source, ...(email ? { email } : {}) });
  return `${APP_URL}/auth/login?${params.toString()}`;
}

export function buildTierSignupUrl(tier: "core" | "pro" | "max") {
  return `${APP_URL}/auth/login?mode=signup&tier=${tier}`;
}
