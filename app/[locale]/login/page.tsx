import { notFound } from "next/navigation"
import { hasLocale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import type { Metadata } from "next"

import Header from "@/components/header"
import Footer from "@/components/footer"
import LoginForm from "@/components/login-form"
import { Link, redirect } from "@/i18n/navigation"
import { isLoggedIn } from "@/lib/auth/user"
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
  const t = await getTranslations({ locale, namespace: "Auth" })

  return {
    title: t("loginTitle"),
    robots: { index: false, follow: false },
  }
}

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  setRequestLocale(locale)

  // Already logged in → no reason to show login.
  if (await isLoggedIn()) {
    redirect({ href: "/account", locale })
  }

  const t = await getTranslations("Auth")

  return (
    <>
      <Header />
      <main className="px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <h1 className="font-heading text-3xl font-bold text-brand-purple">
              {t("loginTitle")}
            </h1>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {t("loginDescription")}
            </p>
          </div>

          <LoginForm />

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {t("noAccountPrompt")}{" "}
            <Link
              href="/#pricing"
              className="font-semibold text-brand-deep-red hover:underline"
            >
              {t("viewPlans")}
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
