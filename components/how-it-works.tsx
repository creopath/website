"use client"

import { motion } from "motion/react"

const steps = [
  {
    number: "01",
    title: "Book a Consultation",
    description:
      "Schedule a free introductory call. We'll learn about your goals, background, and where you want to be.",
  },
  {
    number: "02",
    title: "Get Your Personalised Plan",
    description:
      "We create a tailored roadmap covering education pathways, career options, and actionable next steps.",
  },
  {
    number: "03",
    title: "Receive Ongoing Support",
    description:
      "From applications to interviews, we guide you through every milestone until you reach your destination.",
  },
]

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

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-y border-border bg-card px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm font-semibold tracking-wide text-primary">
            How It Works
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Three simple steps to get started
          </h2>
        </motion.div>

        <motion.ol
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 grid gap-8 md:grid-cols-3"
        >
          {steps.map((step) => (
            <motion.li key={step.number} variants={item} className="relative">
              <span className="font-heading text-5xl font-bold text-primary/10">
                {step.number}
              </span>
              <h3 className="mt-4 font-heading text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  )
}
