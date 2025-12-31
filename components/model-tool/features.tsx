import type { ToolConfig } from "@/lib/config/tool-types"
import * as Icons from "lucide-react"

type FeaturesProps = ToolConfig["features"]

interface FeaturesComponentProps {
  features: FeaturesProps
}

const getIcon = (iconName: string) => {
  const IconComponent = Icons[iconName as keyof typeof Icons] as any
  return IconComponent ? <IconComponent className="w-6 h-6" /> : <span className="text-2xl leading-none">{iconName}</span>
}

export default function ToolFeatures({ features }: FeaturesComponentProps) {
  return (
    <section className="py-12 md:py-20 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{features.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{features.description}</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.items.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border border-border hover:border-primary transition-colors hover:shadow-md"
            >
              <div className="inline-block p-3 bg-primary/10 rounded-lg mb-4 text-primary">{getIcon(feature.icon)}</div>
              <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
