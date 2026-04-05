"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"

type CardTheme = "purple" | "red" | "blue" | "deep-red" | "cloud"

const themeStyles: Record<
  CardTheme,
  { bg: string; text: string; tag: string; overlay: string }
> = {
  purple: {
    bg: "bg-brand-purple",
    text: "text-white",
    tag: "bg-white/15 text-white",
    overlay:
      "bg-linear-to-br from-brand-purple/95 via-brand-purple/70 to-brand-deep-red/40",
  },
  red: {
    bg: "bg-brand-red",
    text: "text-white",
    tag: "bg-white/15 text-white",
    overlay:
      "bg-linear-to-br from-brand-red/95 via-brand-red/70 to-brand-deep-red/40",
  },
  blue: {
    bg: "bg-brand-blue",
    text: "text-white",
    tag: "bg-white/15 text-white",
    overlay:
      "bg-linear-to-br from-brand-blue/95 via-brand-blue/70 to-brand-purple/40",
  },
  "deep-red": {
    bg: "bg-brand-deep-red",
    text: "text-white",
    tag: "bg-white/15 text-white",
    overlay:
      "bg-linear-to-br from-brand-deep-red/95 via-brand-deep-red/70 to-brand-red/40",
  },
  cloud: {
    bg: "bg-white",
    text: "text-foreground",
    tag: "bg-foreground/10 text-foreground",
    overlay: "bg-white/80",
  },
}

const cards: {
  tags: string[]
  title: string
  description: string
  theme: CardTheme
  span?: boolean
  video?: string
}[] = [
  {
    tags: ["mission", "story"],
    title: "Expert guidance for life-changing decisions.",
    description:
      "Creopath was founded with a simple belief: everyone deserves access to expert guidance when making life-changing career and education decisions. Based in London, we combine personal expertise with AI-powered insights to help clients navigate their path to the UK and global opportunities.",
    theme: "purple",
    span: true,
  },
  {
    tags: ["personalised"],
    title: "A personalised approach",
    description:
      "No generic advice. Every recommendation is tailored to your unique situation.",
    theme: "blue",
  },
  {
    tags: ["uk expertise"],
    title: "Deep UK knowledge",
    description:
      "Expertise in UK education, visa processes, and career opportunities.",
    theme: "blue",
    video: "/videos/London_Tower_Bridge.mp4",
  },
  {
    tags: ["innovation"],
    title: "AI-enhanced insights",
    description:
      "We use AI tools to provide data-driven career and education recommendations.",
    theme: "deep-red",
  },
  {
    tags: ["support"],
    title: "End-to-end support",
    description:
      "From your first consultation to settling in, we're with you throughout.",
    theme: "purple",
    video: "/videos/Businesswomen_Collaboration.mp4",
  },
]

export function About() {
  return (
    <section id="about" className="px-4 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-3xl font-bold text-primary sm:text-4xl"
          >
            Why Creopath?
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Button asChild size="lg" className="bg-brand-blue">
              <Link href="#contact">
                Get in touch
                <ArrowUpRight
                  data-icon="inline-end"
                  className="transition-transform duration-300 group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5"
                />
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Bento grid */}
        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
          {cards.map((card, i) => {
            const styles = themeStyles[card.theme]
            return (
              <motion.article
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`relative flex flex-col overflow-hidden rounded-2xl p-8 ${styles.bg} ${styles.text} ${
                  card.span ? "md:col-span-2" : ""
                }`}
              >
                {card.video && (
                  <>
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      className="absolute inset-0 h-full w-full object-cover"
                      aria-hidden="true"
                    >
                      <source src={card.video} type="video/mp4" />
                    </video>
                    <div className={`absolute inset-0 ${styles.overlay}`} />
                  </>
                )}
                <div className="relative flex flex-wrap gap-2">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`rounded-md px-2 py-1 text-xs font-medium ${styles.tag}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3
                  className="relative mt-6 font-heading font-semibold leading-tight text-2xl sm:text-3xl"
                >
                  {card.title}
                </h3>
                <p className="relative mt-4 leading-relaxed opacity-90">
                  {card.description}
                </p>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
