import Header from "@/components/header"
import Hero from "@/components/hero"
import Stats from "@/components/stats"
import Services from "@/components/services"
import HowItWorks from "@/components/how-it-works"
import About from "@/components/about"
import FAQ from "@/components/faq"
import Contact from "@/components/contact"
import Footer from "@/components/footer"
import { faqs } from "@/lib/constants/faqs"
import { services } from "@/lib/constants/services"
import { socialLinks } from "@/lib/constants/social"

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Creopath",
  url: "https://creopath.com",
  logo: "https://creopath.com/images/Color-Horizontal.svg",
  description:
    "AI-powered career guidance and education advisory company based in London, UK.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "London",
    addressCountry: "GB",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: "hello@creopath.com",
    contactType: "customer service",
  },
  sameAs: socialLinks.map((link) => link.href),
}

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Creopath",
  url: "https://creopath.com",
}

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  provider: {
    "@type": "Organization",
    name: "Creopath",
  },
  areaServed: "Worldwide",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Career Guidance Services",
    itemListElement: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.title,
        description: service.description,
      },
    })),
  },
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([organizationJsonLd, websiteJsonLd, serviceJsonLd, faqJsonLd]).replace(/</g, "\\u003c"),
        }}
      />
      <Header />
      <main>
        <Hero />
        <Stats />
        <Services />
        <HowItWorks />
        <About />
        <FAQ />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
