import { notFound } from "next/navigation"
import { hasLocale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"

import Header from "@/components/header"
import Hero from "@/components/hero"
import Stats from "@/components/stats"
import Services from "@/components/services"
import HowItWorks from "@/components/how-it-works"
import About from "@/components/about"
import Pricing from "@/components/pricing"
import FAQ from "@/components/faq"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import { faqIds } from "@/lib/constants/faqs"
import { services } from "@/lib/constants/services"
import { socialLinks } from "@/lib/constants/social"
import { routing } from "@/i18n/routing"

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  setRequestLocale(locale)

  const tStructured = await getTranslations({
    locale,
    namespace: "StructuredData",
  })
  const tServices = await getTranslations({ locale, namespace: "Services" })
  const tFaq = await getTranslations({ locale, namespace: "FAQ" })
  const tMetadata = await getTranslations({ locale, namespace: "Metadata" })

  const baseUrl = "https://www.creopath.com"
  const localizedUrl =
    locale === routing.defaultLocale ? baseUrl : `${baseUrl}/${locale}`

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: tMetadata("siteName"),
    url: baseUrl,
    logo: `${baseUrl}/images/Color-Horizontal.svg`,
    description: tStructured("businessDescription"),
    address: {
      "@type": "PostalAddress",
      addressLocality: "London",
      addressCountry: "GB",
    },
    areaServed: [
      { "@type": "Country", name: "United Kingdom" },
      "Worldwide",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      email: "info@creopath.com",
      contactType: "customer service",
    },
    sameAs: socialLinks.map((link) => link.href),
  }

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: tMetadata("siteName"),
    url: localizedUrl,
    inLanguage: locale,
  }

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    provider: {
      "@type": "Organization",
      name: tMetadata("siteName"),
    },
    areaServed: "Worldwide",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: tStructured("serviceCatalogName"),
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: tServices(`items.${service.id}.title`),
          description: tServices(`items.${service.id}.description`),
        },
      })),
    },
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqIds.map((id) => ({
      "@type": "Question",
      name: tFaq(`questions.${id}.question`),
      acceptedAnswer: {
        "@type": "Answer",
        text: tFaq(`questions.${id}.answer`),
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            organizationJsonLd,
            websiteJsonLd,
            serviceJsonLd,
            faqJsonLd,
          ]).replace(/</g, "\\u003c"),
        }}
      />
      <Header />
      <main>
        <Hero />
        <Stats />
        <Services />
        <HowItWorks />
        <About />
        <Pricing />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
