
import { Suspense } from "react"
import type { CategoryType } from "@/lib/gallery/types"
import { getGalleryItems } from "@/lib/gallery/gallery"
import { MasonryGrid } from "@/components/create/masonry-grid"


async function GalleryContent({ category }: { category?: CategoryType }) {
  const items = await getGalleryItems(category)
  return <MasonryGrid items={items} />
}

export async function GallerySection({ category }: { category?: CategoryType }){


  return (

      <main className="container mx-auto px-4 py-12">
        <Suspense fallback={<MasonryGridSkeleton />}>
          <GalleryContent category={category} />
        </Suspense>
      </main>
  )
}

function MasonryGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-card rounded-lg h-64 animate-pulse" />
      ))}
    </div>
  )
}
