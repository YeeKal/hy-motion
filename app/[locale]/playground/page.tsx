import { notFound } from 'next/navigation';
import { DEFAULT_OG } from "@/lib/constants";
import { setRequestLocale } from 'next-intl/server';
import { Locale,locales, defaultLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/get-messages";
import ToolFeatures from '@/components/model-tool/features';

import HyMotionPlayground from '@/components/3d/motion-playground';
import ToolFAQ from '@/components/model-tool/faq';
import { CTA } from "@/components/home/call-to-action";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const m = await getMessages(locale, "playground");
  const ogImageUrl = m.playground.seo.ogImage
    ? m.playground.seo.ogImage
    : DEFAULT_OG;
  return {
    title: m.playground.seo.title,
    description: m.playground.seo.description,
    openGraph: {
      title: m.playground.seo.title,
      description: m.playground.seo.description,
      images: [{ url: ogImageUrl}],
      type: 'website',
    },
  };
}

export default async function CreatePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  setRequestLocale(locale);

 const m = await getMessages(locale, `playground`);
  // const t=  useTranslations(`common.toolcards`);
    if (!m) {
    return notFound();
  }
    const langData = (m as any)[`playground`];
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

    <ToolFeatures features={langData.outputPipeline} />
    <ToolFeatures features={langData.modelAdvantages} />

    <ToolFAQ faq={langData.faq} />
        <CTA {...langData.creditsUpsell} />


   
  </>
}


