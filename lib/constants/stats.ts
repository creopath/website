export type StatsItem =
  | { type: "image"; src: string }
  | {
      type: "stat"
      value: string
      label: string
      description: string
      theme: "purple" | "red" | "blue"
    }

export const statsItems: StatsItem[] = [
  { type: "image", src: "/images/stats-london.jpg" },
  {
    type: "stat",
    value: "10+",
    label: "Countries Supported",
    description:
      "Helping clients from India, Turkey, and beyond reach the UK.",
    theme: "red",
  },
  { type: "image", src: "/images/stats-cambridge.jpeg" },
  {
    type: "stat",
    value: "1:1",
    label: "Personalised Advisory",
    description:
      "Work directly with the people guiding your journey — no handoffs.",
    theme: "purple",
  },
  { type: "image", src: "/images/stats-oxford.jpeg" },
  {
    type: "stat",
    value: "London",
    label: "Based in the UK",
    description:
      "On-the-ground expertise in UK education and career pathways.",
    theme: "blue",
  },
]
