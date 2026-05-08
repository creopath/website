"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { ArrowUpRight } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"

export default function Hero() {
  const t = useTranslations("Hero")

  return (
    <section className="relative flex min-h-[calc(100svh-var(--navbar-height))] items-center overflow-hidden px-6">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-sm uppercase font-semibold tracking-wide text-primary"
            >
              {t("eyebrow")}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            >
              {t.rich("title", {
                highlight: (chunks) => (
                  <span className="text-brand-deep-red">{chunks}</span>
                ),
                accent: (chunks) => (
                  <span className="text-primary">{chunks}</span>
                ),
              })}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg leading-relaxed"
            >
              {t("description")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <Button asChild size="lg" className="bg-brand-blue">
                <Link href="#contact">
                  {t("primaryCta")}
                  <ArrowUpRight
                    data-icon="inline-end"
                    className="transition-transform duration-300 group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5"
                  />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="#services">{t("secondaryCta")}</Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative aspect-square w-full overflow-hidden rounded-3xl"
          >
            <Image
              src="/images/hero-image.jpeg"
              alt={t("imageAlt")}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
