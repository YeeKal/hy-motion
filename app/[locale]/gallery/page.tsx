import type { CategoryType } from "@/lib/gallery/types"
import { CategoryFilter } from "@/components/gallery/category-filter"
import { GallerySection } from "@/components/gallery/gallery-section"
import { getMessages } from "@/i18n/get-messages"
import { Locale } from "@/i18n/config";
import { NextIntlClientProvider } from "next-intl";

interface GalleryPageProps {
  searchParams: Promise<{ category?: string }>
}

import { getTranslations } from "next-intl/server"

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const m = await getMessages(locale, "gallery");
  const galleryData = m.gallery.page;

  const t = await getTranslations({ locale: (await params).locale, namespace: "gallery.page" })

  return {
    title: galleryData.title,
    description: galleryData.description,
    keywords: ["AI art", "gallery", "image generation", "prompts", "artwork"],
    openGraph: {
      title: galleryData.ogTitle,
      description: galleryData.ogDescription,
      type: "website",
      url: "/gallery",
    },
  }
}

export default async function GalleryPage({ searchParams, params }: GalleryPageProps & { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const m = await getMessages(locale, "gallery");
  const galleryData = m.gallery.page;
  const searchParamsValue = await searchParams
  const category = searchParamsValue.category as CategoryType | undefined

  return (
    <NextIntlClientProvider messages={m}>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-foreground mb-2">{galleryData.header.title}</h1>
              <p className="text-muted-foreground">{galleryData.header.subtitle}</p>
            </div>
            <CategoryFilter />
          </div>
        </div>

        <GallerySection category={category} />
      </div>
    </NextIntlClientProvider>
  )
}

