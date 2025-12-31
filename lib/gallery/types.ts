export type CategoryRawType = "Portrait" |  "Scenery" | "Typography"  | "Creative Art" | "Illustration"
export interface GalleryItem {
  slug: string
  url: string
  prompt: string
  alt: string
  category: CategoryRawType
  createdAt: string
  aspectRatio: string // like "1:1" or "16:9"
}

export type CategoryType = CategoryRawType | "All"

export const CATEGORIES: CategoryType[] = ["All", "Portrait", "Scenery", "Typography", "Creative Art", "Illustration"]