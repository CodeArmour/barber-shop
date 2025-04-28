import type { LucideIcon } from "lucide-react"

type ServiceCardProps = {
  icon: LucideIcon
  title: string
  description: string
  price: number
}

export function ServiceCard({ icon: Icon, title, description, price }: ServiceCardProps) {
  return (
    <div className="service-card">
      <div className="service-icon-container">
        <Icon className="service-icon" />
      </div>
      <h3 className="service-title">{title}</h3>
      <p className="service-description">{description}</p>
      <p className="service-price">${price}</p>
    </div>
  )
}
