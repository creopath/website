"use client"

import { motion, type Variants } from "motion/react"

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const themeStyles = {
  purple: "bg-brand-purple",
  red: "bg-brand-deep-red",
  blue: "bg-brand-blue",
} as const

export default function StatCard({
  value,
  label,
  description,
  theme = "purple",
}: {
  value: string
  label: string
  description: string
  theme?: "purple" | "red" | "blue"
}) {
  return (
    <motion.div
      variants={item}
      className={`flex h-full flex-col justify-center rounded-2xl p-6 text-brand-cloud ${themeStyles[theme]}`}
    >
      <dd className="font-heading text-4xl font-bold">{value}</dd>
      <dt className="mt-2 font-heading text-lg font-semibold">{label}</dt>
      <p className="mt-1">{description}</p>
    </motion.div>
  )
}
