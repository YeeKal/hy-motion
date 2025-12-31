'use client'
import { useTranslations } from "next-intl"


export function PricingHero(){
  const t = useTranslations("hero")
  return (
            <div className="text-center space-y-4 py-4 md:px-8 md:py-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            {t.rich("title", {
              highlight: (chunks) => <span className="text-primary">{chunks}</span>
            })}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto whitespace-pre-line">
            {t("subtitle")}
          </p>
        </div>
  )
}