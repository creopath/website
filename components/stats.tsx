"use client"

import { motion } from "motion/react"

const stats = [
  { value: "London", label: "Based in the UK" },
  { value: "10+", label: "Countries Supported" },
  { value: "AI-Powered", label: "Career Guidance" },
  { value: "1:1", label: "Personalised Advisory" },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export function Stats() {
  return (
    <section className="bg-brand-purple px-6 py-12">
      <motion.dl
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="mx-auto grid max-w-7xl grid-cols-2 gap-8 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            className="text-center"
          >
            <dt className="text-sm font-medium text-white/70">
              {stat.label}
            </dt>
            <dd className="mt-1 font-heading text-3xl font-bold text-white">
              {stat.value}
            </dd>
          </motion.div>
        ))}
      </motion.dl>
    </section>
  )
}
