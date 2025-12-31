"use client"

import type { GalleryItem } from "@/lib/gallery/types"
import { GalleryCard } from "./gallery-card"
import Masonry from "react-masonry-css"
import { useTranslations } from "next-intl"

interface MasonryGridProps {
  items: GalleryItem[]
  loading?: boolean
}


export function MasonryGrid({ items, loading }: MasonryGridProps) {
  const t = useTranslations("gallery.grid")
  const breakpoints = {
    default: 4,
    1536: 3,
    1024: 2,
    768: 1,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-border border-t-accent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <p className="text-muted-foreground mb-2">{t("noImages")}</p>
          <p className="text-sm text-muted-foreground/60">{t("tryDifferent")}</p>
        </div>
      </div>
    )
  }

  return (
    <Masonry breakpointCols={breakpoints} className="masonry-grid" columnClassName="masonry-grid-column">
      {items.map((item) => (
        <div key={item.slug} className="mb-4">
          <article>
            <GalleryCard item={item} />
          </article>
        </div>
      ))}
    </Masonry>
  )
}
