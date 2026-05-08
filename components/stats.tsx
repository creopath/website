"use client"

import { motion } from "motion/react"
import { useTranslations } from "next-intl"

import StatCard from "@/components/stat-card"
import StatImageCard from "@/components/stat-image-card"
import { statsItems } from "@/lib/constants/stats"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

export default function Stats() {
  const t = useTranslations("Stats")

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-3xl font-bold text-brand-purple sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed">
            {t("description")}
          </p>
        </motion.div>

        <motion.dl
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-12 grid auto-rows-[200px] grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {statsItems.map((item) =>
            item.type === "image" ? (
              <StatImageCard
                key={item.src}
                src={item.src}
                alt={t(`imageAlts.${item.imageId}`)}
              />
            ) : (
              <StatCard
                key={item.id}
                value={t(`items.${item.id}.value`)}
                label={t(`items.${item.id}.label`)}
                description={t(`items.${item.id}.description`)}
                theme={item.theme}
              />
            )
          )}
        </motion.dl>
      </div>
    </section>
  )
}
