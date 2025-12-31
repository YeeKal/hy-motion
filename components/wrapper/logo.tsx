import Image from "next/image"
import { cn } from "@/lib/utils" // Assuming you have a utils file for className merging
import { LOGO_URL, BRAND_NAME } from "@/lib/constants";

interface LogoProps {
  className?: string
}

export function Logo({ className }: LogoProps) {
  return (
    <div className={cn("relative h-16 w-16", className)}>
      <Image
         src={LOGO_URL} // Replace with your actual logo path (e.g., "/images/logo.png")
        alt={`${BRAND_NAME} logo`}
        fill
        className="object-contain"
        priority
      />
    </div>
  )
}