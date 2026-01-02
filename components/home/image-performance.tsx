import { Icon } from "../wrapper/lucide-icon"
import { Link } from "@/i18n/routing"
import { PLAYGROUND_SECTION_ID } from "@/lib/constants"
interface PerformanceMetric {
  icon: string
  label: string
  value: string
  description: string
  highlight: boolean
}

interface ZImagePerformanceProps {
  data: {
    title: string;
    description: string;
    metrics: PerformanceMetric[];
    introItems: {
      icon: string;
      title: string;
      description: string;
    }[];
    ctaText: string;
  };
}

export default function ZImagePerformance({ data }: ZImagePerformanceProps) {
  if (!data) return null;

  return (
    <div className="w-full bg-background py-16 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{data.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {data.description}
          </p>
        </div>

       

         {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.introItems.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border border-border hover:border-primary transition-colors hover:shadow-md"
            >
              <div className="inline-block p-3 bg-primary/10 rounded-lg mb-4 text-primary">
                <Icon name={feature.icon} className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

         {/* Performance Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {data.metrics.map((metric, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-lg border-2 transition-all duration-300 hover:shadow-lg ${metric.highlight ? "border-primary bg-primary/5" : "border-border bg-card"
                }`}
            >
              {/* Icon */}
              <div
                className={`mb-4 w-12 h-12 rounded-lg flex items-center justify-center ${metric.highlight ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
              >
                <Icon name={metric.icon} className="w-6 h-6" />
              </div>

              {/* Label */}
              <h3 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                {metric.label}
              </h3>

              {/* Value */}
              <div className="mb-4">
                <div className="text-3xl md:text-4xl font-bold text-foreground">{metric.value}</div>
              </div>

              {/* Description */}
              <p className="text-sm text-muted-foreground">{metric.description}</p>

              {/* Highlight indicator */}
              {metric.highlight && (
                <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full animate-pulse" />
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <Link href={`/playground`} className="inline-flex items-center px-8 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:bg-primary/90 transition-colors">
            {data.ctaText}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
