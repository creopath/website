"use client"

import { motion } from "motion/react"

export function About() {
  return (
    <section id="about" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <p className="text-sm font-semibold tracking-wide text-primary">
            About Us
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
            Why Creopath?
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-16 lg:grid-cols-2 lg:items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-lg leading-relaxed text-muted-foreground">
              Creopath was founded with a simple belief: everyone deserves
              access to expert guidance when making life-changing career and
              education decisions.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Based in London, we combine personal expertise with AI-powered
              insights to help individuals from around the world — particularly
              those in India, Turkey, and beyond — navigate their path to the UK
              and global opportunities.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              We&apos;re a small, dedicated team. When you work with us, you
              work directly with the people who care about your success — no
              handoffs, no runaround.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 gap-6"
          >
            {[
              {
                title: "Personalised Approach",
                description:
                  "No generic advice. Every recommendation is tailored to your unique situation.",
              },
              {
                title: "UK Expertise",
                description:
                  "Deep knowledge of UK education, visa processes, and career opportunities.",
              },
              {
                title: "AI-Enhanced Insights",
                description:
                  "We use AI tools to provide data-driven career and education recommendations.",
              },
              {
                title: "End-to-End Support",
                description:
                  "From your first consultation to settling in, we're with you throughout.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-lg bg-white p-5 shadow-md"
              >
                <h3 className="font-heading text-sm font-semibold text-brand-deep-red">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
