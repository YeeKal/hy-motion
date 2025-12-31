import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getGalleryItemBySlug, getAllSlugs } from "@/lib/gallery/gallery"
import { ImageDetailModal } from "@/components/gallery/image-detail-modal"
import { JsonLd } from "@/components/gallery/json-ld"
import { getMessages } from "@/i18n/get-messages"
import { Locale } from "@/i18n/config";
import { NextIntlClientProvider } from "next-intl";

interface DetailPageProps {
  params: Promise<{ slug: string; locale: Locale }>
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}


export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { slug, locale } = await params;
  const m = await getMessages(locale, "gallery");
  const galleryData = m.gallery.slugPage;
  const item = await getGalleryItemBySlug(slug)

  if (!item) {
    return {
      title: galleryData.notFound.titl,
      description: galleryData.notFound.description,
    }
  }

  return {
    title: `${item.alt}${galleryData.titleSuffix}`,
    description: item.prompt,
    openGraph: {
      title: item.alt,
      description: item.prompt,
      images: [item.url]
    },
    twitter: {
      card: "summary_large_image",
      title: item.alt,
      description: item.prompt,
      images: [item.url],
    },
  }
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { slug, locale } = await params;

  const item = await getGalleryItemBySlug(slug)
  const m = await getMessages(locale, "gallery");
  if (!item) {
    notFound()
  }

  return (
    <NextIntlClientProvider messages={m}>
      <JsonLd item={item} />
      <ImageDetailModal item={item} isModal={false} />
    </NextIntlClientProvider>
  )
}
