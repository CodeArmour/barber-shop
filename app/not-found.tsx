import { ErrorPage } from "@/components/error/error-page"

export default function NotFound() {
  return (
    <ErrorPage
      code="404"
      title="Looks Like We Missed a Spot"
      description="The page you're looking for has been trimmed from our style book or never existed."
    />
  )
}
