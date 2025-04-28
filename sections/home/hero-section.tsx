import { BookingButton } from "@/components/home/booking-button"

export function HeroSection() {
  return (
    <section className="hero-section">
      <div className="container mx-auto px-4 text-center max-w-5xl">
        <h2 className="hero-title">Professional Haircuts & Styling</h2>
        <p className="hero-description">Book your appointment today and experience the best haircut in town.</p>
        <BookingButton />
      </div>
    </section>
  )
}
