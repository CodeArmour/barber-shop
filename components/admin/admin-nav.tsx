import Link from "next/link"
import { Scissors } from "lucide-react"

export function AdminNav() {
  return (
    <div className="bg-stone-900 text-white py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Scissors className="h-5 w-5" />
          <span className="font-bold text-lg">Sharp Cuts</span>
        </Link>
        <Link href="/" className="text-sm text-stone-300 hover:text-white transition-colors">
          Return to Website
        </Link>
      </div>
    </div>
  )
}
