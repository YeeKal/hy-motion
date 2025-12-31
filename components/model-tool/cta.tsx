'use client'

import type { ToolConfig } from "@/lib/config/tool-types"
import { Button } from "@/components/ui/button"
import {PLAYGROUND_SECTION_ID} from "@/lib/constants"
import { scrollToPlayground } from "@/lib/utils"

type CTAProps = ToolConfig["cta"]

interface CTAComponentProps {
  cta: CTAProps
}

export default function ToolCTA({ cta }: CTAComponentProps) {
  return (
    <section className="py-12 md:py-20 px-4 md:px-6 bg-primary text-primary-foreground">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{cta.title}</h2>
        <p className="text-lg mb-8 opacity-95">{cta.description}</p>
          <Button onClick={() => scrollToPlayground(PLAYGROUND_SECTION_ID)}
           size="lg" variant="secondary" className="text-base px-8 py-3">
            {cta.button.text}
          </Button>
      </div>
    </section>
  )
}
