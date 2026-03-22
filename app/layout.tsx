import { Sora, DM_Sans } from "next/font/google"
import type { Metadata } from "next"

import "./globals.css"
import { cn } from "@/lib/utils"

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

export const metadata: Metadata = {
  metadataBase: new URL("https://creopath.com"),
  title: {
    template: "%s | Creopath",
    default: "Creopath | AI-Powered Career Guidance & Advisory",
  },
  description:
    "Creopath helps individuals make informed career, education, and life decisions with AI-powered guidance. Expert support for study-abroad, admissions, and career planning.",
  keywords: [
    "career guidance",
    "study abroad UK",
    "education advisory",
    "career counselling",
    "AI career planning",
    "admissions guidance",
    "skill development",
    "UK education",
  ],
  authors: [{ name: "Creopath" }],
  creator: "Creopath",
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: "Creopath",
    title: "Creopath | AI-Powered Career Guidance & Advisory",
    description:
      "Expert career guidance and education advisory powered by AI. Study-abroad support, admissions guidance, and personalised career planning.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Creopath | AI-Powered Career Guidance & Advisory",
    description:
      "Expert career guidance and education advisory powered by AI. Study-abroad support, admissions guidance, and personalised career planning.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cn("antialiased", sora.variable, dmSans.variable)}>
      <body>{children}</body>
    </html>
  )
}
