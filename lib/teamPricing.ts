// Team seats are billed at the same single-plan price as an individual Pro
// subscription — teams just add seats and get a volume discount.
export const SEAT_PRICES = {
  annual: 39,
  monthly: 49,
} as const

export type BillingPeriod = keyof typeof SEAT_PRICES

const DISCOUNT_TIERS = [
  { min: 8, pct: 25 },
  { min: 4, pct: 20 },
  { min: 2, pct: 15 },
]

export function discountPercent(seats: number): number {
  for (const tier of DISCOUNT_TIERS) {
    if (seats >= tier.min) return tier.pct
  }
  return 0
}

export function discountLabel(seats: number): string {
  const pct = discountPercent(seats)
  return pct === 0 ? '' : `${pct}% team discount`
}

export function seatSubtotal(seats: number, billing: BillingPeriod): number {
  return SEAT_PRICES[billing] * seats
}

export function seatMonthlyTotal(seats: number, billing: BillingPeriod): number {
  const subtotal = seatSubtotal(seats, billing)
  return subtotal * (1 - discountPercent(seats) / 100)
}
