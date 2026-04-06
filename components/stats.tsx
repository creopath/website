"use client"

import { motion } from "motion/react"
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
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-3xl font-bold text-brand-purple sm:text-4xl">
            Your Journey, Our Mission
          </h2>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed">
            We&apos;re building something new — and we&apos;re committed to
            making a real impact on every career journey we support.
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
              <StatImageCard key={item.src} src={item.src} />
            ) : (
              <StatCard
                key={item.value}
                value={item.value}
                label={item.label}
                description={item.description}
                theme={item.theme}
              />
            )
          )}
        </motion.dl>
      </div>
    </section>
  )
}
