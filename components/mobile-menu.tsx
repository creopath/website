"use client"

import { useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { AnimatePresence, motion } from "motion/react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { navLinks } from "@/lib/constants/nav"

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

export default function MobileMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  // Body scroll lock while menu is open
  useEffect(() => {
    if (!isOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  // Auto-close when resizing to desktop
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)")
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) onClose()
    }
    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [onClose])

  // Close menu and synchronously unlock body scroll so the link's
  // smooth scroll navigation isn't blocked by `overflow: hidden`
  const handleLinkClick = () => {
    document.body.style.overflow = ""
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
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
            <Link href="/" onClick={handleLinkClick}>
              <Image
                src="/images/Color-Horizontal.svg"
                alt="Creopath"
                width={140}
                height={38}
              />
            </Link>
            <Button
              size="icon"
              onClick={onClose}
              aria-label="Close menu"
              className="cursor-pointer text-foreground bg-brand-cloud hover:bg-brand-cloud/80"
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
                  onClick={handleLinkClick}
                  className="font-heading text-3xl font-bold transition-colors hover:text-brand-deep-red"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            <motion.div variants={itemVariants} className="mt-auto pt-8">
              <Button asChild size="lg" className="w-full bg-brand-blue">
                <Link href="#contact" onClick={handleLinkClick}>
                  Get Started
                </Link>
              </Button>
            </motion.div>
          </motion.nav>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
