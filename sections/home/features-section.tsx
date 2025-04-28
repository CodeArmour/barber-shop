import { FeatureCard } from "@/components/home/feature-card"

const features = [
  {
    title: "Experienced Barbers",
    description: "Our team has years of experience in cutting and styling hair.",
  },
  {
    title: "Modern Techniques",
    description: "We stay up-to-date with the latest trends and techniques.",
  },
  {
    title: "Clean Environment",
    description: "We maintain a clean and sanitized environment for your safety.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-14 md:py-20 bg-stone-100">
      <div className="container mx-auto px-4 max-w-6xl text-center">
        <h2 className="section-title">Why Choose Us?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-10 max-w-5xl mx-auto">
          {features.map((feature) => (
            <FeatureCard key={feature.title} title={feature.title} description={feature.description} />
          ))}
        </div>
      </div>
    </section>
  )
}
