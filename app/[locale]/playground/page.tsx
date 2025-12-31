import { notFound } from 'next/navigation';
import { DEFAULT_OG } from "@/lib/constants";
import { setRequestLocale } from 'next-intl/server';
import { Locale,locales, defaultLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/get-messages";

import HyMotionPlayground from '@/components/3d/motion-playground';

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const m = await getMessages(locale, "create");
  const ogImageUrl = m.create.seo.ogImage
    ? m.create.seo.ogImage
    : DEFAULT_OG;
  return {
    title: m.create.seo.title,
    description: m.create.seo.description,
    openGraph: {
      title: m.create.seo.title,
      description: m.create.seo.description,
      images: [{ url: ogImageUrl}],
      type: 'website',
    },
  };
}

export default async function CreatePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale);

 const m = await getMessages(locale, `create`);
  // const t=  useTranslations(`common.toolcards`);
    if (!m) {
    return notFound();
  }
    const langData = (m as any)[`create`];
       if (!langData) {
    return notFound();
  }

  return <>
  {langData.seo.structuredData && langData.seo.structuredData.map((schema:any, index:number) => (
      <script
        key={`ld-json-${index}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    ))}

    <HyMotionPlayground/>
   
  </>
}


