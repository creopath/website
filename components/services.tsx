"use client"

import Image from "next/image"
import { motion } from "motion/react"
import { GraduationCap, Compass, TrendingUp } from "lucide-react"

const services = [
  {
    icon: Compass,
    title: "Career Counselling",
    description:
      "Get personalised career guidance tailored to your goals, strengths, and aspirations. We help you navigate decisions with clarity and confidence.",
    image: "/images/career-counselling.jpg",
  },
  {
    icon: GraduationCap,
    title: "Study Abroad & Admissions",
    description:
      "From choosing the right university in the UK to securing your admission, we guide you through every step of the study-abroad journey.",
    image: "/images/study-abroad-admissions.jpg",
  },
  {
    icon: TrendingUp,
    title: "Skill Development & Planning",
    description:
      "Build a roadmap for your professional growth. We identify skill gaps and create actionable plans to help you reach your career goals.",
    image: "/images/skill-dev-planning.jpg",
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
          <p className="text-lg font-bold tracking-wide">
            What We Offer
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-brand-deep-red sm:text-4xl">
            Services tailored to your journey
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-foreground">
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
              whileHover="hover"
              className="group relative overflow-hidden rounded-2xl bg-brand-deep-red p-4"
            >
              {/* Image section with clipped square cut */}
              <div className="relative h-56">
                <div
                  className="absolute inset-0"
                  style={{
                    clipPath: `shape(
                      from 64px 8px,
                      curve to 72px 0 with 64px 0,
                      line to calc(100% - 8px) 0,
                      curve to 100% 8px with 100% 0,
                      line to 100% calc(100% - 8px),
                      curve to calc(100% - 8px) 100% with 100% 100%,
                      line to 8px 100%,
                      curve to 0 calc(100% - 8px) with 0 100%,
                      line to 0 72px,
                      curve to 8px 64px with 0 64px,
                      line to 56px 64px,
                      curve to 64px 56px with 64px 64px,
                      close
                    )`,
                  }}
                >
                  <motion.div
                    variants={{
                      hover: { scale: 1.08 },
                    }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </motion.div>
                </div>

                {/* Icon in the cut area */}
                <motion.div
                  variants={{
                    hover: { scale: 1.15, rotate: -8 },
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="absolute top-0 left-0 flex size-12 items-center justify-center"
                >
                  <service.icon className="size-12 text-white" />
                </motion.div>
              </div>

              {/* Content */}
              <div className="px-4 pt-5 pb-4">
                <h3 className="font-heading text-xl font-semibold text-white">
                  {service.title}
                </h3>
                <p className="mt-3 leading-relaxed text-white">
                  {service.description}
                </p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
