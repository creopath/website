"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { AnimatePresence, motion } from "motion/react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "About", href: "#about" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
]

const menuVariants = {
  hidden: {
    opacity: 0,
    transition: { duration: 0.2, ease: "easeIn" as const },
  },
  show: {
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
}

const listVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20,
    transition: { duration: 0.2 },
  },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Body scroll lock while menu is open
  useEffect(() => {
    if (!mobileMenuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [mobileMenuOpen])

  // Close on Escape key
  useEffect(() => {
    if (!mobileMenuOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false)
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [mobileMenuOpen])

  // Auto-close when resizing to desktop
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)")
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMobileMenuOpen(false)
    }
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  // Close menu and synchronously unlock body scroll so the link's
  // smooth scroll navigation isn't blocked by `overflow: hidden`
  const closeMenu = () => {
    document.body.style.overflow = ""
    setMobileMenuOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 h-(--navbar-height) bg-brand-cloud/80 backdrop-blur-md">
        <nav
          className="mx-auto flex h-full max-w-7xl items-center justify-between px-6"
          aria-label="Main navigation"
        >
          <Link href="/">
            <Image
              src="/images/Color-Horizontal.svg"
              alt="Creopath"
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
                  className="font-semibold text-foreground transition-colors hover:text-brand-red"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <Button asChild>
              <Link href="#contact">Get Started</Link>
            </Button>
          </div>

          {/* Mobile menu toggle — only opens */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Open menu"
          >
            <Menu />
          </Button>
        </nav>
      </header>

      {/* Full-screen mobile menu — covers header when open */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            variants={menuVariants}
            initial="hidden"
            animate="show"
            exit="hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            className="fixed inset-0 z-50 flex flex-col bg-linear-to-br from-brand-cloud from-25% via-brand-deep-red/40 via-65% to-brand-blue/80 backdrop-blur-lg md:hidden"
          >
            {/* Top bar with logo and close button */}
            <div className="flex h-(--navbar-height) shrink-0 items-center justify-between px-6">
              <Link href="/" onClick={closeMenu}>
                <Image
                  src="/images/Color-Horizontal.svg"
                  alt="Creopath"
                  width={140}
                  height={38}
                />
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeMenu}
                aria-label="Close menu"
                className="bg-brand-cloud hover:bg-brand-cloud/80! cursor-pointer"
              >
                <X />
              </Button>
            </div>

            {/* Nav links */}
            <motion.nav
              variants={listVariants}
              aria-label="Mobile navigation"
              className="flex flex-1 flex-col px-6 pt-8 pb-12"
            >
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  variants={itemVariants}
                  className={index > 0 ? "mt-6" : ""}
                >
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className="font-heading text-3xl font-bold text-foreground transition-colors hover:text-brand-red"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div variants={itemVariants} className="mt-auto pt-8">
                <Button asChild size="lg" className="w-full bg-brand-blue">
                  <Link href="#contact" onClick={closeMenu}>
                    Get Started
                  </Link>
                </Button>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
