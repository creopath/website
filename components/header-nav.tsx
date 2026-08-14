"use client"

import { useState } from "react"
import Image from "next/image"
import { Menu } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import LanguageSwitcher from "@/components/language-switcher"
import MobileMenu from "@/components/mobile-menu"
import { logout } from "@/lib/auth/actions"
import { navLinks } from "@/lib/constants/nav"
import { Link } from "@/i18n/navigation"

// Interactive part of the header (mobile-menu state). `loggedIn` is resolved
// server-side by the Header wrapper and passed in.
export default function HeaderNav({ loggedIn }: { loggedIn: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const t = useTranslations("Header")
  const tNav = useTranslations("Nav")

  return (
    <>
      <header className="sticky top-0 z-50 h-(--navbar-height) bg-brand-cloud/80 backdrop-blur-md">
        <nav
          className="mx-auto flex h-full max-w-7xl items-center justify-between px-6"
          aria-label={t("mainNavLabel")}
        >
          <Link href="/">
            <Image
              src="/images/Color-Horizontal.svg"
              alt={t("logoAlt")}
              width={140}
              height={38}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-semibold transition-colors hover:text-brand-deep-red"
                >
                  {tNav(link.id)}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-2 md:flex">
            <LanguageSwitcher />
            {loggedIn ? (
              <>
                <Button asChild variant="outline">
                  <Link href="/account">{t("account")}</Link>
                </Button>
                <form action={logout}>
                  <Button type="submit" variant="ghost">
                    {t("logout")}
                  </Button>
                </form>
              </>
            ) : (
              <Button asChild variant="outline">
                <Link href="/login">{t("login")}</Link>
              </Button>
            )}
          </div>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={t("openMenuLabel")}
          >
            <Menu />
          </Button>
        </nav>
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        loggedIn={loggedIn}
      />
    </>
  )
}
