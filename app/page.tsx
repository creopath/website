import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Stats } from "@/components/stats"

export default function Page() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Stats />
      </main>
    </>
  )
}
