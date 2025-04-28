import type { Metadata } from 'next'
import './globals.css'

import { SonnerToasterProvider } from "@/components/sonner-toast-provider"


export const metadata: Metadata = {
  title: 'Barber Shop',
  description: 'A simple barber shop website',
  generator: 'Next.js',
  applicationName: 'Barber Shop',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <SonnerToasterProvider />
      </body>
    </html>
  )
}
