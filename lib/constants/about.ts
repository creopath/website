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

export type AboutCardId =
  | "mission"
  | "personalised"
  | "ukExpertise"
  | "aiInsights"
  | "support"

export type AboutCard = {
  id: AboutCardId
  theme: CardTheme
  span?: boolean
  video?: string
}

export const aboutCards: AboutCard[] = [
  { id: "mission", theme: "purple", span: true },
  { id: "personalised", theme: "blue" },
  {
    id: "ukExpertise",
    theme: "blue",
    video: "/videos/London_Tower_Bridge.mp4",
  },
  { id: "aiInsights", theme: "deep-red" },
  {
    id: "support",
    theme: "purple",
    video: "/videos/Businesswomen_Collaboration.mp4",
  },
]
