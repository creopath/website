"use client"

import { motion } from "motion/react"
import { useTranslations } from "next-intl"

import { steps } from "@/lib/constants/steps"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function HowItWorks() {
  const t = useTranslations("HowItWorks")

  return (
    <section id="how-it-works" className="px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-2xl bg-brand-grey px-8 pb-8 pt-12 sm:px-12 sm:pb-12 lg:px-16 lg:pb-16"
        >
          <div className="text-center">
            <p className="text-lg font-bold tracking-wide text-brand-red">
              {t("eyebrow")}
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-white sm:text-4xl">
              {t("title")}
            </h2>
          </div>

          <motion.ol
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="mt-16 grid gap-8 md:grid-cols-3"
          >
            {steps.map((step) => (
              <motion.li
                key={step.id}
                variants={item}
                className="relative"
              >
                <span className="font-heading text-5xl font-bold text-brand-red">
                  {step.number}
                </span>
                <h3 className="mt-4 font-heading text-xl font-semibold text-white">
                  {t(`steps.${step.id}.title`)}
                </h3>
                <p className="mt-3 leading-relaxed text-white/70">
                  {t(`steps.${step.id}.description`)}
                </p>
              </motion.li>
            ))}
          </motion.ol>
        </motion.div>
      </div>
    </section>
  )
}
