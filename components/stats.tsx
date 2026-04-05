"use client"

import Image from "next/image"
import { motion } from "motion/react"

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

const themeStyles = {
  purple: "bg-brand-purple",
  red: "bg-brand-deep-red",
  blue: "bg-brand-blue",
} as const

function StatCard({
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

function ImageCard({ src }: { src?: string }) {
  return (
    <motion.div
      variants={item}
      className="h-full overflow-hidden rounded-2xl bg-brand-purple/10 shadow-sm"
    >
      {src ? (
        <div className="relative h-full">
          <Image
            src={src}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex h-full min-h-48 items-center justify-center bg-gradient-to-br from-brand-purple/20 to-brand-deep-red/10">
          <div className="text-center">
            <div className="mx-auto size-16 rounded-full bg-brand-purple/15" />
            <p className="mt-3 text-xs text-muted-foreground">
              Image placeholder
            </p>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export function Stats() {
  return (
    <section className="bg-brand-cloud px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-heading text-3xl font-bold text-brand-purple sm:text-4xl">
            Your Journey, Our Mission
          </h2>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed text-foreground">
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
          {/* Row 1 */}
          <ImageCard src="/images/stats-london.jpg" />
          <StatCard
            value="10+"
            label="Countries Supported"
            description="Helping clients from India, Turkey, and beyond reach the UK."
            theme="red"
          />
          <ImageCard src="/images/stats-cambridge.jpeg" />

          {/* Row 2 */}
          <StatCard
            value="1:1"
            label="Personalised Advisory"
            description="Work directly with the people guiding your journey — no handoffs."
            theme="purple"
          />
          <ImageCard src="/images/stats-oxford.jpeg" />
          <StatCard
            value="London"
            label="Based in the UK"
            description="On-the-ground expertise in UK education and career pathways."
            theme="blue"
          />
        </motion.dl>
      </div>
    </section>
  )
}
