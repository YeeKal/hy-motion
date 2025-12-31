import type { ToolConfig } from "@/lib/config/tool-types"
import * as Icons from "lucide-react"
import { HOW_TO_USE_SECTION_ID } from "@/lib/constants"

type HowToProps = ToolConfig["how_to"]

interface HowToComponentProps {
  howTo: HowToProps
}

const getIcon = (iconName: string) => {
  const IconComponent = Icons[iconName as keyof typeof Icons] as any
  return IconComponent ? <IconComponent className="w-8 h-8" /> : null
}

export default function ToolHowTo({ howTo }: HowToComponentProps) {
  return (
    <section id={HOW_TO_USE_SECTION_ID} className="py-12 md:py-20 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{howTo.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{howTo.description}</p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-16"> {/* Increased gap for better spacing */}
          {howTo.steps.map((step, index) => (
            <div key={index} className="relative flex flex-col"> {/* Use flex-col for the main card */}

              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  {getIcon(step.icon)}
                </div>
                {/* Step Number Badge - REMOVED absolute positioning */}
                <div className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-lg">
                  {index + 1}
                </div>

              </div>


              <div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>

              {/* Media Block (Image/Video) - Now pushed to the bottom by flex */}
              {/* {step.media && (
                <div className="mt-6 flex-grow flex items-end"> 
                  {step.media.type === "gif" || step.media.type === "image" ? (
                    <img
                      src={step.media.url || "/placeholder.svg"}
                      alt={step.media.alt}
                      className="w-full rounded-lg shadow-md hover:shadow-lg transition-shadow"
                    />
                  ) : (
                    <video
                      src={step.media.url}
                      className="w-full rounded-lg shadow-md"
                      autoPlay
                      muted
                      loop
                    />
                  )}
                </div>
              )} */}

              {/* 
        -- OPTIMIZATION 3: CONNECTOR LINE --
        The line is still absolute, but its position is now more reliable,
        aligned with the center of the new header.
      */}
              {index < howTo.steps.length - 1 && (
                <div className="hidden md:block absolute top-7 -right-8 w-16 h-0.5 bg-border" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
