import type { CardTheme } from "@/lib/constants/about"

export type PackageId = "threeMonth" | "sixMonth" | "twelveMonth"

export type Package = {
  id: PackageId
  theme: CardTheme
  // Marks the visually emphasised card (e.g. "Most popular").
  featured?: boolean
  // Number of feature bullets in the message catalog under `items.<id>.features`.
  featureCount: number
  // Access duration in months — used to compute the account expiry date after
  // a successful payment (purchase date + this many months).
  durationMonths: number
  // Display price in minor units (pence), formatted per-locale in the UI.
  // This is the LABEL shown on the site. The amount actually charged is
  // determined by the Stripe Price referenced by `priceIdEnv` — keep them in
  // sync. Stripe remains the source of truth for money.
  amount: number
  currency: "GBP"
  // Name of the env var holding the Stripe Price ID for this package.
  // Resolved server-side only (never exposed to the client).
  priceIdEnv:
    | "STRIPE_PRICE_THREE_MONTH"
    | "STRIPE_PRICE_SIX_MONTH"
    | "STRIPE_PRICE_TWELVE_MONTH"
}

export const packages: Package[] = [
  {
    id: "threeMonth",
    theme: "blue",
    featureCount: 4,
    durationMonths: 3,
    amount: 45000, // £450 — must match the Stripe Price at STRIPE_PRICE_THREE_MONTH
    currency: "GBP",
    priceIdEnv: "STRIPE_PRICE_THREE_MONTH",
  },
  {
    id: "sixMonth",
    theme: "deep-red",
    featured: true,
    featureCount: 4,
    durationMonths: 6,
    amount: 80000, // £800 — must match the Stripe Price at STRIPE_PRICE_SIX_MONTH
    currency: "GBP",
    priceIdEnv: "STRIPE_PRICE_SIX_MONTH",
  },
  {
    id: "twelveMonth",
    theme: "purple",
    featureCount: 4,
    durationMonths: 12,
    amount: 145000, // £1,450 — must match the Stripe Price at STRIPE_PRICE_TWELVE_MONTH
    currency: "GBP",
    priceIdEnv: "STRIPE_PRICE_TWELVE_MONTH",
  },
]

export const packageIds = packages.map((p) => p.id) as [
  PackageId,
  ...PackageId[],
]

export function getPackage(id: string): Package | undefined {
  return packages.find((p) => p.id === id)
}

// Format a minor-unit amount (pence) for display in the given locale.
export function formatPackagePrice(
  amount: number,
  currency: Package["currency"],
  locale: string
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: amount % 100 === 0 ? 0 : 2,
  }).format(amount / 100)
}
