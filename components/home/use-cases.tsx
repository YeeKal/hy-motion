import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { getBadgeColor } from "@/lib/utils"
import { ImageParam } from "@/lib/types"

interface UseCasesProps {
  title: string
  description: string
  scenarios: Array<{
    key: string
    shortTitle: string
    originalTitle: string
    tagline: string
    description: string
    images: ImageParam[]
  }>
}

interface ImageSectionProps {
  images: ImageParam[]
}

function ImageSection({ images }: ImageSectionProps) {
  const getGridLayout = (count: number) => {
    switch (count) {
      case 1:
        return "grid-cols-1"
      case 2:
        return "grid-cols-3" // Changed from grid-cols-2 to grid-cols-3 for 2/3 + 1/3 split
      case 3:
        return "grid-cols-3 grid-rows-2" // Changed from grid-cols-2 to grid-cols-3
      case 4:
        return "grid-cols-4 grid-rows-3" // Changed from grid-cols-2 to grid-cols-3
      case 5:
        return "grid-cols-4 grid-rows-3" // Changed from grid-cols-2 to grid-cols-3
      default:
        return "grid-cols-3" // Changed from grid-cols-2 to grid-cols-3
    }
  }

  const getImageSize = (index: number, total: number) => {
    if (total === 1) return "col-span-3 row-span-1 aspect-[4/3]" // Full width
    if (total === 2) {
      if (index === 0) return "col-span-2 row-span-1 aspect-[4/3]" // 2/3 width
      return "col-span-1 row-span-1 aspect-[4/3]" // 1/3 width
    }
    if (total === 3) {
      if (index === 0) return "col-span-2 row-span-2 aspect-square" // 2/3 width, full height
      return "col-span-1 row-span-1 aspect-square" // 1/3 width, half height
    }
    if (total === 4) {
      if (index === 0) return "col-span-3 row-span-3 aspect-square" // 2/3 width, full height
      return "col-span-1 row-span-1 aspect-square" // 1/3 width, half height
    }
    if (total === 5) {
      if (index === 0) return "col-span-2 row-span-2 aspect-square" // 2/3 width, full 
      if (index === 1) return "col-span-2 row-span-2 aspect-square" // 2/3 width, full height
      return "col-span-1 row-span-1 aspect-square" // 1/3 width, half height
    }
    return "col-span-1 row-span-1 aspect-[4/3]"
  }

  return (
    <div className={`grid gap-3 ${getGridLayout(images.length)}`}>
      {images.map((image, index) => (
        <div
          key={index}
          className={`relative group cursor-pointer overflow-hidden rounded-xl border bg-muted/50 ${getImageSize(index, images.length)}`}
        >
          <Image
            src={image.src || "/placeholder.svg"}
            alt={image.alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ))}
    </div>
  )
}

export default function UseCases({
  title,
  description,
  scenarios
}: UseCasesProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">{title}</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {description}
        </p>
      </div>

      <div className="space-y-24">
        {scenarios.map((scenario, index) => {
          const isEven = index % 2 === 0

          return (
            <div key={scenario.key} className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
              {/* Text Content */}
              <div className={`${isEven ? "lg:order-1" : "lg:order-2"}`}>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className={`text-xs ${getBadgeColor(index)}`}>
                        {scenario.shortTitle}
                      </Badge>
                    </div>
                    <h2 className="text-3xl font-bold leading-tight">{scenario.originalTitle}</h2>
                    <p className="text-xl font-medium text-muted-foreground">{scenario.tagline}</p>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-lg">{scenario.description}</p>
                </div>
              </div>

              {/* Images */}
              <div className={`h-full ${isEven ? "lg:order-2" : "lg:order-1"}`}>
                <ImageSection images={scenario.images} />
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}
