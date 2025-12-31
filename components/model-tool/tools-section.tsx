import { ToolsGrid } from "@/components/model-tool/tools-grid"
import { Link } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import type { ToolMetaConfig } from "@/lib/config/tool-types"

interface ToolsSectionProps {
  tools: ToolMetaConfig[]
  showViewAll?: boolean
}

export function ToolsSection({
  tools,
  showViewAll = true,
}: ToolsSectionProps) {
  const t = useTranslations('common.modelsSection')
  const displayTitle = t('title')
  const displayDescription = t('description')

  return (
    <section className="w-full py-12 md:py-16 lg:py-20 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Title Area */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">{displayTitle}</h2>
          <p className="mt-4 text-lg text-gray-600">{displayDescription}</p>
        </div>

        {/* Tools Grid */}
        <ToolsGrid tools={tools} />

        {/* View All Link (Optional) */}
        {showViewAll && (
          <div className="mt-12 text-center">
            <Link
              href="/models"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-primary bg-transparent text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-colors duration-200"
            >
              {t('viewAll')}
              <span className="ml-2">→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
