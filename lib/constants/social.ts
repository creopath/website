import { Instagram, type LucideIcon } from "lucide-react"

export type SocialLink = {
  label: string
  href: string
  icon: LucideIcon
}

export const socialLinks: SocialLink[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/creopath",
    icon: Instagram,
  },
]
