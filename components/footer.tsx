import Image from "next/image"
import { useTranslations } from "next-intl"

import { navLinks } from "@/lib/constants/nav"
import { socialLinks } from "@/lib/constants/social"
import { Link } from "@/i18n/navigation"

export default function Footer() {
  const t = useTranslations("Footer")
  const tNav = useTranslations("Nav")

  return (
    <footer className="overflow-hidden px-4 pb-4">
      <div className="relative overflow-hidden rounded-2xl px-8 pb-8 pt-12 sm:px-12 sm:pb-12 lg:px-16 lg:pb-16">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      >
        <source src="/videos/London_Dark_City.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-brand-grey/80" />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl">
        <div>
          <Link href="/">
            <Image
              src="/images/White-Symbol.svg"
              alt={t("logoAlt")}
              width={48}
              height={48}
            />
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
            {t("tagline")}
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-8 md:grid-cols-2">
          <nav aria-label={t("navigationLabel")}>
            <h2 className="font-heading text-sm font-semibold text-white">
              {t("navigationHeading")}
            </h2>
            <ul className="mt-3 space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {tNav(link.id)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-heading text-sm font-semibold text-white">
              {t("contactHeading")}
            </h2>
            <address className="mt-3 space-y-2 not-italic">
              <p>
                <a
                  href="mailto:info@creopath.com"
                  className="text-sm text-white/60 transition-colors hover:text-white"
                >
                  info@creopath.com
                </a>
              </p>
              <p className="text-sm text-white/60">{t("locationValue")}</p>
            </address>
            {socialLinks.length > 0 && (
              <ul className="mt-3 -ml-2.5 flex items-center gap-1">
                {socialLinks.map(({ label, href, icon: Icon }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="inline-flex size-10 items-center justify-center rounded-md text-white/60 transition-colors hover:text-white"
                    >
                      <Icon className="size-5" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="text-center text-sm text-white/60">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
      </div>
    </footer>
  )
}
