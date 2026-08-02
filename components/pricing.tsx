"use client"

import { motion } from "motion/react"
import { Check } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import { cardThemes } from "@/lib/constants/about"
import { packages, formatPackagePrice } from "@/lib/constants/packages"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function Pricing() {
  const t = useTranslations("Pricing")
  const locale = useLocale()

  return (
    <section id="pricing" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-lg font-bold tracking-wide">{t("eyebrow")}</p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-brand-purple sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed">
            {t("description")}
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 grid gap-8 md:grid-cols-3"
        >
          {packages.map((pkg) => {
            const features = t(`items.${pkg.id}.features`).split(",")

            // The featured card carries the bold brand color to draw the eye;
            // the others are muted light cards so they visually recede.
            const styles = pkg.featured
              ? {
                  card: `${cardThemes[pkg.theme].bg} text-white`,
                  tagline: "text-white/80",
                  perPackage: "text-white/70",
                  // Solid, high-contrast CTA — the visual focus of the section.
                  buttonVariant: "default" as const,
                  buttonClass:
                    "bg-white text-brand-purple hover:bg-brand-cloud",
                  check: "text-white",
                }
              : {
                  card: "bg-muted text-foreground",
                  tagline: "text-muted-foreground",
                  perPackage: "text-muted-foreground",
                  // White button reads clearly on the grey card yet stays
                  // calmer than the featured card's solid purple CTA.
                  buttonVariant: "default" as const,
                  buttonClass:
                    "bg-white text-brand-purple hover:bg-white/80",
                  check: "text-brand-purple",
                }

            return (
              <motion.article
                key={pkg.id}
                variants={item}
                className={`relative flex flex-col rounded-2xl p-8 ${styles.card}`}
              >
                {pkg.featured ? (
                  <span className="absolute right-6 top-6 rounded-md bg-white/15 px-2.5 py-1 text-xs font-semibold">
                    {t("featuredBadge")}
                  </span>
                ) : null}

                <h3 className="font-heading text-2xl font-semibold">
                  {t(`items.${pkg.id}.name`)}
                </h3>
                <p className={`mt-2 leading-relaxed ${styles.tagline}`}>
                  {t(`items.${pkg.id}.tagline`)}
                </p>

                <p className="mt-6 flex items-baseline gap-2">
                  <span className="font-heading text-4xl font-bold">
                    {formatPackagePrice(pkg.amount, pkg.currency, locale)}
                  </span>
                  <span className={`text-sm ${styles.perPackage}`}>
                    {t("perPackage")}
                  </span>
                </p>

                <ul className="mt-8 space-y-3">
                  {features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check
                        className={`mt-0.5 size-5 shrink-0 ${styles.check}`}
                        aria-hidden="true"
                      />
                      <span className="leading-relaxed">{feature.trim()}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  size="lg"
                  variant={styles.buttonVariant}
                  className={`mt-8 w-full ${styles.buttonClass}`}
                >
                  <Link href={{ pathname: "/checkout", query: { package: pkg.id } }}>
                    {t("cta")}
                  </Link>
                </Button>
              </motion.article>
            )
          })}
        </motion.div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          {t("guarantee")}
        </p>
      </div>
    </section>
  )
}
