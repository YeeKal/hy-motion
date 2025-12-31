"use client"

import type { GenerationResult } from "./image-generator"
import ImageCard from "./image-card"
import { useTranslations } from "next-intl"

interface ResultsGridProps {
  results: GenerationResult[]
}

export default function ResultsGrid({ results }: ResultsGridProps) {
  const t = useTranslations("home.playground.resultsGrid");
  return (
    <div className="space-y-12">
      {results.map((result) => (
        <div key={result.id} className="space-y-4">
          {/* Prompt Header */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {t("prompt")} <span className="text-primary">{result.prompt}</span>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {result.timestamp.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Images Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {result.images.map((image, idx) => (
              <ImageCard key={`${result.id}-${idx}`} image={image} isLoading={result.isLoading} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
