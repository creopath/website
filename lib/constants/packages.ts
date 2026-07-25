import type { CardTheme } from "@/lib/constants/about"

export type PackageId = "sixMonth" | "oneYear"

export type Package = {
  id: PackageId
  theme: CardTheme
  // Marks the visually emphasised card (e.g. "Most popular").
  featured?: boolean
  // Number of feature bullets in the message catalog under `items.<id>.features`.
  featureCount: number
  // Display price in minor units (pence), formatted per-locale in the UI.
  // This is the LABEL shown on the site. The amount actually charged is
  // determined by the Stripe Price referenced by `priceIdEnv` — keep them in
  // sync. Stripe remains the source of truth for money.
  amount: number
  currency: "GBP"
  // Name of the env var holding the Stripe Price ID for this package.
  // Resolved server-side only (never exposed to the client).
  priceIdEnv: "STRIPE_PRICE_SIX_MONTH" | "STRIPE_PRICE_ONE_YEAR"
}

export const packages: Package[] = [
  {
    id: "sixMonth",
    theme: "blue",
    featureCount: 4,
    amount: 0,
    currency: "GBP",
    priceIdEnv: "STRIPE_PRICE_SIX_MONTH",
  },
  {
    id: "oneYear",
    theme: "purple",
    featured: true,
    featureCount: 4,
    amount: 0,
    currency: "GBP",
    priceIdEnv: "STRIPE_PRICE_ONE_YEAR",
  },
]

export const packageIds = packages.map((p) => p.id)

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
