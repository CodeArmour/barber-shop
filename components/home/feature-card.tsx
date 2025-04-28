type FeatureCardProps = {
  title: string
  description: string
}

export function FeatureCard({ title, description }: FeatureCardProps) {
  return (
    <div className="feature-card">
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  )
}
