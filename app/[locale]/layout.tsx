import { Sora, DM_Sans } from "next/font/google"
import { notFound } from "next/navigation"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"

import "../globals.css"
import { cn } from "@/lib/utils"
import { routing } from "@/i18n/routing"

const sora = Sora({
  subsets: ["latin", "latin-ext"],
  variable: "--font-heading",
  display: "swap",
})

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: requested } = await params
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale
  const t = await getTranslations({ locale, namespace: "Metadata" })

  const baseUrl = "https://creopath.com"
  const canonical =
    locale === routing.defaultLocale ? baseUrl : `${baseUrl}/${locale}`

  return {
    metadataBase: new URL(baseUrl),
    title: {
      template: `%s | ${t("siteName")}`,
      default: t("title"),
    },
    description: t("description"),
    keywords: t("keywords").split(","),
    authors: [{ name: t("siteName") }],
    creator: t("siteName"),
    openGraph: {
      type: "website",
      locale: t("ogLocale"),
      siteName: t("siteName"),
      title: t("title"),
      description: t("ogDescription"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("ogDescription"),
    },
    alternates: {
      canonical,
      languages: {
        en: baseUrl,
        tr: `${baseUrl}/tr`,
        "x-default": baseUrl,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)

  return (
    <html
      lang={locale}
      className={cn("antialiased", sora.variable, dmSans.variable)}
    >
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
