// Per-seat Stripe price IDs — separate from individual PRICE_IDS.
// Create these in the Stripe dashboard (same dollar amounts, billing_scheme: per_unit)
// then add the env vars to Vercel.
export const TEAM_PRICE_IDS: Record<string, string> = {
  core: process.env.STRIPE_TEAM_PRICE_CORE ?? '',
  pro:  process.env.STRIPE_TEAM_PRICE_PRO  ?? '',
  max:  process.env.STRIPE_TEAM_PRICE_MAX  ?? '',
}

export const TEAM_PRICE_TO_TIER: Record<string, string> = Object.fromEntries(
  Object.entries(TEAM_PRICE_IDS).map(([tier, id]) => [id, tier])
)

// Volume-discount coupon IDs — create once in Stripe dashboard:
//   TEAM_DISCOUNT_10  →  10% off, forever, no redemption limit
//   TEAM_DISCOUNT_15  →  15% off, forever, no redemption limit
//   TEAM_DISCOUNT_20  →  20% off, forever, no redemption limit
export const TEAM_COUPONS = {
  two_to_four: process.env.STRIPE_TEAM_COUPON_10 ?? 'TEAM_DISCOUNT_10',
  five_to_nine: process.env.STRIPE_TEAM_COUPON_15 ?? 'TEAM_DISCOUNT_15',
  ten_plus:     process.env.STRIPE_TEAM_COUPON_20 ?? 'TEAM_DISCOUNT_20',
} as const

export function teamCouponId(seats: number): string | null {
  if (seats >= 10) return TEAM_COUPONS.ten_plus
  if (seats >= 5)  return TEAM_COUPONS.five_to_nine
  if (seats >= 2)  return TEAM_COUPONS.two_to_four
  return null
}

export function discountPercent(seats: number): number {
  if (seats >= 10) return 20
  if (seats >= 5)  return 15
  if (seats >= 2)  return 10
  return 0
}

export const TIER_PRICES: Record<string, number> = {
  core: 29,
  pro:  49,
  max:  99,
}

export const TIER_LABELS: Record<string, string> = {
  core: 'Core',
  pro:  'Pro',
  max:  'Max',
}

export function monthlyTotal(tier: string, seats: number): number {
  const base = TIER_PRICES[tier] ?? 0
  const discount = discountPercent(seats) / 100
  return base * seats * (1 - discount)
}

export function discountLabel(seats: number): string {
  const pct = discountPercent(seats)
  if (pct === 0) return ''
  if (seats >= 10) return '20% team discount'
  if (seats >= 5)  return '15% team discount'
  return '10% team discount'
}

// ─── Mixed-tier helpers ───────────────────────────────────────────────────────

export type SeatAllocation = { core: number; pro: number; max: number }

export function totalSeats(allocation: SeatAllocation): number {
  return allocation.core + allocation.pro + allocation.max
}

export function mixedMonthlyTotal(allocation: SeatAllocation): number {
  const seats = totalSeats(allocation)
  const pct = discountPercent(seats) / 100
  const subtotal =
    (TIER_PRICES.core * allocation.core) +
    (TIER_PRICES.pro  * allocation.pro)  +
    (TIER_PRICES.max  * allocation.max)
  return subtotal * (1 - pct)
}

export function mixedSubtotal(allocation: SeatAllocation): number {
  return (
    (TIER_PRICES.core * allocation.core) +
    (TIER_PRICES.pro  * allocation.pro)  +
    (TIER_PRICES.max  * allocation.max)
  )
}
