import type { ToolConfig } from "@/lib/config/tool-types"

type UseCasesProps = ToolConfig["useCases"]

interface UseCasesComponentProps {
  useCases: UseCasesProps
}

export default function ToolUseCases({ useCases }: UseCasesComponentProps) {
  if (!useCases || !useCases.scenarios) {
    return null
  }

  return (
    <section className="py-12 md:py-20 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{useCases.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{useCases.description}</p>
        </div>

        <div className="space-y-16">
          {useCases.scenarios.map((item, index) => {
            const isEven = index % 2 === 0

            return (
              <div
                key={item.key}
                className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center ${
                  !isEven ? "md:[direction:rtl]" : ""
                }`}
              >
                {/* Image Container */}
                <div className={!isEven ? "md:[direction:ltr]" : ""}>
                  <div className="relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                    <img
                      src={item.image.src || "/placeholder.svg?height=400&width=500"}
                      alt={item.image.alt}
                      className="w-full h-64 md:h-80 object-cover"
                    />
                  </div>
                </div>

                {/* Content Container */}
                <div className={!isEven ? "md:[direction:ltr]" : ""}>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">{item.shortTitle}</h3>
                  <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-6">{item.description}</p>
                  <div className="flex gap-2">
                    <div className="w-1 bg-primary rounded-full"></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
