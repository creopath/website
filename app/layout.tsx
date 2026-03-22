import { Sora, DM_Sans } from "next/font/google"

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
