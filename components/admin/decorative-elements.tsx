import Image from "next/image"

export function DecorativeElements() {
  return (
    <>
      <div className="hidden md:block fixed bottom-0 left-0 w-64 h-64 opacity-10">
        <Image src="/classic-barber-pole-new.png" alt="Decorative barber pole" width={200} height={200} />
      </div>
      <div className="hidden md:block fixed top-0 right-0 w-64 h-64 opacity-10">
        <Image src="/barber-tools-new.png" alt="Decorative scissors" width={200} height={200} />
      </div>
    </>
  )
}
