export type StatId = "countriesSupported" | "personalisedAdvisory" | "basedInUk"
export type StatImageId = "london" | "cambridge" | "oxford"

export type StatsItem =
  | { type: "image"; src: string; imageId: StatImageId }
  | {
      type: "stat"
      id: StatId
      theme: "purple" | "red" | "blue"
    }

export const statsItems: StatsItem[] = [
  { type: "image", src: "/images/stats-london.jpg", imageId: "london" },
  { type: "stat", id: "countriesSupported", theme: "red" },
  { type: "image", src: "/images/stats-cambridge.jpeg", imageId: "cambridge" },
  { type: "stat", id: "personalisedAdvisory", theme: "purple" },
  { type: "image", src: "/images/stats-oxford.jpeg", imageId: "oxford" },
  { type: "stat", id: "basedInUk", theme: "blue" },
]
