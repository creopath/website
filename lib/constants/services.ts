import { Compass, GraduationCap, TrendingUp, type LucideIcon } from "lucide-react"

export type Service = {
  id: "careerCounselling" | "studyAbroad" | "skillDevelopment"
  icon: LucideIcon
  image: string
}

export const services: Service[] = [
  {
    id: "careerCounselling",
    icon: Compass,
    image: "/images/career-counselling.jpg",
  },
  {
    id: "studyAbroad",
    icon: GraduationCap,
    image: "/images/study-abroad-admissions.jpg",
  },
  {
    id: "skillDevelopment",
    icon: TrendingUp,
    image: "/images/skill-dev-planning.jpg",
  },
]
