export interface Service {
    id: number
    name: string
    description: string | null
    price: number
    duration: number // in minutes, adjust if different
    createdAt: Date
    updatedAt: Date
  }
  