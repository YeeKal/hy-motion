"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { CATEGORIES, type CategoryType } from "@/lib/gallery/types"
import { Button } from "@/components/ui/button"

import { useTranslations } from "next-intl"

export function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = (searchParams.get("category") || "All") as CategoryType
  const t = useTranslations("gallery.categories")

  const handleCategoryChange = (category: CategoryType) => {
    const params = new URLSearchParams(searchParams)
    if (category === "All") {
      params.delete("category")
    } else {
      params.set("category", category)
    }
    router.push(`/gallery?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2 justify-center py-6">
      {CATEGORIES.map((category) => (
        <Button
          key={category}
          onClick={() => handleCategoryChange(category)}
          variant={currentCategory === category ? "default" : "outline"}
          className={`rounded-full px-3 sm:px-4 transition-all text-xs sm:text-sm ${currentCategory === category
              ? "bg-accent text-accent-foreground"
              : "bg-card text-foreground hover:border-accent"
            }`}
        >
          {t(category)}
        </Button>
      ))}
    </div>
  )
}
