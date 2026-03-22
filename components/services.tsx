"use client"

import { motion } from "motion/react"
import { GraduationCap, Compass, TrendingUp } from "lucide-react"

const services = [
  {
    icon: Compass,
    title: "Career Counselling",
    description:
      "Get personalised career guidance tailored to your goals, strengths, and aspirations. We help you navigate decisions with clarity and confidence.",
  },
  {
    icon: GraduationCap,
    title: "Study Abroad & Admissions",
    description:
      "From choosing the right university in the UK to securing your admission, we guide you through every step of the study-abroad journey.",
  },
  {
    icon: TrendingUp,
    title: "Skill Development & Planning",
    description:
      "Build a roadmap for your professional growth. We identify skill gaps and create actionable plans to help you reach your career goals.",
  },
]

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

export function Services() {
  return (
    <section id="services" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm font-semibold tracking-wide text-primary">
            What We Offer
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Services tailored to your journey
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Whether you&apos;re planning to study abroad, switching careers, or
            building new skills, we provide the expert guidance you need.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-16 grid gap-8 md:grid-cols-3"
        >
          {services.map((service) => (
            <motion.article
              key={service.title}
              variants={item}
              className="rounded-xl bg-white p-8 shadow-md transition-shadow hover:shadow-xl"
            >
              <div className="flex size-12 items-center justify-center rounded-lg bg-brand-red/10">
                <service.icon className="size-6 text-brand-red" />
              </div>
              <h3 className="mt-6 font-heading text-xl font-semibold text-foreground">
                {service.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
