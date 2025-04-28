import { Scissors } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen bg-stone-50 flex flex-col items-center justify-center">
      <div className="animate-spin text-amber-600 mb-4">
        <Scissors className="h-12 w-12" />
      </div>
      <p className="text-stone-600">Loading...</p>
    </div>
  )
}