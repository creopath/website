export type CardTheme = "purple" | "blue" | "deep-red"

export const cardThemes: Record<CardTheme, { bg: string; overlay: string }> = {
  purple: {
    bg: "bg-brand-purple",
    overlay:
      "bg-linear-to-br from-brand-purple/95 via-brand-purple/70 to-brand-deep-red/40",
  },
  blue: {
    bg: "bg-brand-blue",
    overlay:
      "bg-linear-to-br from-brand-blue/95 via-brand-blue/70 to-brand-purple/40",
  },
  "deep-red": {
    bg: "bg-brand-deep-red",
    overlay:
      "bg-linear-to-br from-brand-deep-red/95 via-brand-deep-red/70 to-brand-deep-red/40",
  },
}

export type AboutCard = {
  tags: string[]
  title: string
  description: string
  theme: CardTheme
  span?: boolean
  video?: string
}

export const aboutCards: AboutCard[] = [
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
