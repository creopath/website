import { notFound } from "next/navigation"
import { CheckCircle2 } from "lucide-react"
import { hasLocale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import type { Metadata } from "next"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
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
  const t = await getTranslations({ locale, namespace: "CheckoutSuccess" })

  return {
    title: t("title"),
    robots: { index: false, follow: false },
  }
}

export default async function CheckoutSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ session_id?: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  setRequestLocale(locale)

  const { session_id: sessionId } = await searchParams
  const t = await getTranslations("CheckoutSuccess")

  // Phase 2 will retrieve the Stripe session with `sessionId` to confirm the
  // payment status and surface the customer's email. For now we treat the
  // presence of a session_id as the signal that they arrived via checkout.
  const hasSession = Boolean(sessionId)

  return (
    <>
      <Header />
      <main className="px-6 py-24">
        <div className="mx-auto max-w-xl text-center">
          <CheckCircle2
            className="mx-auto size-16 text-brand-purple"
            aria-hidden="true"
          />
          <h1 className="mt-6 font-heading text-3xl font-bold text-brand-purple sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg leading-relaxed">
            {hasSession ? t("description") : t("missingSession")}
          </p>
          <Button asChild size="lg" className="mt-10">
            <Link href="/">{t("backHome")}</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </>
  )
}
