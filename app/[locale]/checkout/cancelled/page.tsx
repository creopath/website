import { notFound } from "next/navigation"
import { XCircle } from "lucide-react"
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
  const t = await getTranslations({ locale, namespace: "CheckoutCancelled" })

  return {
    title: t("title"),
    robots: { index: false, follow: false },
  }
}

export default async function CheckoutCancelledPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  setRequestLocale(locale)

  const t = await getTranslations("CheckoutCancelled")

  return (
    <>
      <Header />
      <main className="px-6 py-24">
        <div className="mx-auto max-w-xl text-center">
          <XCircle
            className="mx-auto size-16 text-muted-foreground"
            aria-hidden="true"
          />
          <h1 className="mt-6 font-heading text-3xl font-bold sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-lg leading-relaxed">{t("description")}</p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/#pricing">{t("retry")}</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/">{t("backHome")}</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
