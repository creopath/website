import { notFound } from "next/navigation"
import { hasLocale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import type { Metadata } from "next"

import Header from "@/components/header"
import Footer from "@/components/footer"
import CheckoutForm from "@/components/checkout-form"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { getPackage, formatPackagePrice } from "@/lib/constants/packages"
import { routing } from "@/i18n/routing"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: requested } = await params
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale
  const t = await getTranslations({ locale, namespace: "Checkout" })

  // Checkout is a transactional page — keep it out of search results.
  return {
    title: t("title"),
    robots: { index: false, follow: false },
  }
}

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ package?: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  setRequestLocale(locale)

  const { package: packageParam } = await searchParams
  const t = await getTranslations("Checkout")
  const tPricing = await getTranslations("Pricing")

  const pkg = packageParam ? getPackage(packageParam) : undefined

  return (
    <>
      <Header />
      <main className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl">
          {pkg ? (
            <>
              <div className="mb-8">
                <h1 className="font-heading text-3xl font-bold text-brand-purple sm:text-4xl">
                  {t("title")}
                </h1>
                <p className="mt-3 text-lg leading-relaxed">
                  {t("description")}
                </p>
              </div>

              <div className="mb-8 flex items-center justify-between gap-4 rounded-2xl bg-muted p-6">
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {t("summaryHeading")}
                  </p>
                  <p className="mt-1 font-heading text-xl font-semibold">
                    {tPricing(`items.${pkg.id}.name`)}
                  </p>
                </div>
                <p className="text-right">
                  <span className="font-heading text-2xl font-bold text-brand-purple">
                    {formatPackagePrice(pkg.amount, pkg.currency, locale)}
                  </span>
                  <span className="block text-sm text-muted-foreground">
                    {t("perPackage")}
                  </span>
                </p>
              </div>

              <CheckoutForm packageId={pkg.id} />

              <p className="mt-6 text-center text-sm text-muted-foreground">
                {t("securityNote")}
              </p>
            </>
          ) : (
            <div className="py-16 text-center">
              <h1 className="font-heading text-2xl font-bold text-brand-purple">
                {t("invalidPackage")}
              </h1>
              <Button asChild size="lg" className="mt-8">
                <Link href="/#pricing">{t("backToPricing")}</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
