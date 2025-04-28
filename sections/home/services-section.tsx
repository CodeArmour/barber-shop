import { Clock, Scissors, User } from "lucide-react"

import { ServiceCard } from "@/components/home/service-card"

const services = [
  {
    icon: Scissors,
    title: "Haircut",
    description: "Professional haircut tailored to your style.",
    price: 25,
  },
  {
    icon: User,
    title: "Beard Trim",
    description: "Keep your beard looking sharp and well-groomed.",
    price: 15,
  },
  {
    icon: Clock,
    title: "Full Service",
    description: "Haircut, beard trim, and styling in one session.",
    price: 35,
  },
]

export function ServicesSection() {
  return (
    <section className="py-14 md:py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="section-title">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-10">
          {services.map((service) => (
            <ServiceCard
              key={service.title}
              icon={service.icon}
              title={service.title}
              description={service.description}
              price={service.price}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
