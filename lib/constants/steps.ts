export type StepId = "bookConsultation" | "getPlan" | "ongoingSupport"

export type Step = {
  id: StepId
  number: string
}

export const steps: Step[] = [
  { id: "bookConsultation", number: "01" },
  { id: "getPlan", number: "02" },
  { id: "ongoingSupport", number: "03" },
]
