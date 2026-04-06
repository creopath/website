import { Compass, GraduationCap, TrendingUp, type LucideIcon } from "lucide-react"

export type Service = {
  icon: LucideIcon
  title: string
  description: string
  image: string
}

export const services: Service[] = [
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
