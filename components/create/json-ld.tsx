import type { GalleryItem } from "@/lib/gallery/types"

interface JsonLdProps {
  item: GalleryItem
}

export function JsonLd({ item }: JsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    name: item.alt,
    description: item.prompt,
    url: item.url,
    image: item.url,
    datePublished: item.createdAt,
    author: {
      "@type": "Organization",
      name: "Z-Image",
    },
    isPartOf: {
      "@type": "CreativeWork",
      name: "Z-Image Gallery",
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
}
