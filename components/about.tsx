"use client"

import { motion } from "motion/react"
import { ArrowUpRight } from "lucide-react"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { aboutCards, cardThemes } from "@/lib/constants/about"
import { Link } from "@/i18n/navigation"

export default function About() {
  const t = useTranslations("About")

  return (
    <section id="about" className="px-4 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-3xl font-bold text-primary sm:text-4xl"
          >
            {t("title")}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Button asChild size="lg" className="bg-brand-blue">
              <Link href="#contact">
                {t("cta")}
                <ArrowUpRight
                  data-icon="inline-end"
                  className="transition-transform duration-300 group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5"
                />
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Bento grid */}
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {aboutCards.map((card, i) => (
            <motion.article
              key={card.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative flex flex-col overflow-hidden rounded-2xl p-8 text-white ${cardThemes[card.theme].bg} ${
                card.span ? "md:col-span-2" : ""
              }`}
            >
              {card.video && (
                <>
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className="absolute inset-0 h-full w-full object-cover"
                    aria-hidden="true"
                  >
                    <source src={card.video} type="video/mp4" />
                  </video>
                  <div
                    className={`absolute inset-0 ${cardThemes[card.theme].overlay}`}
                  />
                </>
              )}
              <div className="relative flex flex-wrap gap-2">
                {t(`cards.${card.id}.tags`)
                  .split(",")
                  .map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-white/15 px-2 py-1 text-xs font-medium text-white"
                    >
                      {tag.trim()}
                    </span>
                  ))}
              </div>
              <h3 className="relative mt-6 font-heading text-2xl font-semibold leading-tight sm:text-3xl">
                {t(`cards.${card.id}.title`)}
              </h3>
              <p className="relative mt-4 leading-relaxed opacity-90">
                {t(`cards.${card.id}.description`)}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
