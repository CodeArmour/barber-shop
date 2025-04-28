"use client"

import { ErrorPage } from "@/components/error/error-page"

export default function Error() {
  return (
    <ErrorPage
      code="500"
      title="Our Clippers Need Sharpening"
      description="We're experiencing some technical difficulties. Please try again later or contact us for assistance."
    />
  )
}
