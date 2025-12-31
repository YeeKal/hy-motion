'use client'
import type { ToolConfig } from "@/lib/config/tool-types"
import { Button } from "@/components/ui/button"
import * as Icons from "lucide-react"
import { PLAYGROUND_SECTION_ID } from "@/lib/constants"
import { scrollToPlayground } from "@/lib/utils"

type HeroProps = ToolConfig["hero"]

interface HeroComponentProps {
  hero: HeroProps
}

const getIcon = (iconName?: string) => {
  if (!iconName) return null
  const IconComponent = Icons[iconName as keyof typeof Icons] as any
  return IconComponent ? <IconComponent className="w-5 h-5" /> : <span className="text-xl leading-none">{iconName}</span>
}

export default function ToolHero({ hero }: HeroComponentProps) {
  return (
    <section className="relative py-12 md:py-20 lg:py-24 px-4 md:px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Eyebrow */}
        <div className="inline-block mb-4 md:mb-6">
          <span className="px-3 py-1 text-sm font-medium text-primary bg-primary/10 rounded-full">{hero.eyebrow}</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-pretty leading-tight">{hero.title}</h1>

        {/* Tagline */}
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">{hero.tagline}</p>

        {/* Features */}
        {hero.features && hero.features.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8">
            {hero.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                {feature.icon && <div className="flex-shrink-0 text-primary">{getIcon(feature.icon)}</div>}
                <span className="text-sm md:text-base font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* CTA Button */}
        <Button onClick={() => scrollToPlayground(PLAYGROUND_SECTION_ID)}
          size="lg" className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4">
          Try Now
        </Button>
      </div>
    </section>
  )
}
