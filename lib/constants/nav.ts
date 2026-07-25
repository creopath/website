export type NavId =
  | "services"
  | "howItWorks"
  | "about"
  | "pricing"
  | "faq"
  | "contact"

export type NavLink = {
  id: NavId
  href: string
}

export const navLinks: NavLink[] = [
  { id: "services", href: "#services" },
  { id: "howItWorks", href: "#how-it-works" },
  { id: "about", href: "#about" },
  { id: "pricing", href: "#pricing" },
  { id: "faq", href: "#faq" },
  { id: "contact", href: "#contact" },
]
