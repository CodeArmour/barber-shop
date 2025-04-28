"use client"

import { Toaster } from "sonner"

export function SonnerToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "white",
          color: "#1c1917",
          borderRadius: "0.75rem",
          padding: "16px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        },
        className: "barber-toast",
        duration: 4000,
      }}
      className="toast-container"
    />
  )
}
