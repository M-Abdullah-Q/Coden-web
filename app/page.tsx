import Header from "@/components/Header"
import { HeroSection } from "@/components/HeroSection"
import { FloatingElements } from "@/components/FloatingElements"
import { Footer } from "@/components/Footer"

export default function Home() {
  return (
    <main>
      <FloatingElements />
      <Header />
      <HeroSection />
      <Footer />
    </main>
  )
}