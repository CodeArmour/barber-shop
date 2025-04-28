"use client"

import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { FeaturesSection } from "@/sections/home/features-section"
import { HeroSection } from "@/sections/home/hero-section"
import { ServicesSection } from "@/sections/home/services-section"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <ServicesSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  )
}
