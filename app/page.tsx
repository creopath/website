import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Stats } from "@/components/stats"
import { Services } from "@/components/services"
import { HowItWorks } from "@/components/how-it-works"

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Services />
        <HowItWorks />
      </main>
    </>
  )
}
