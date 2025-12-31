import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';
import { DEFAULT_OG } from "@/lib/constants";
import { setRequestLocale } from 'next-intl/server';
import { Locale,locales, defaultLocale } from "@/i18n/config";
import { getMessages } from "@/i18n/get-messages";
import {ImageGeneratorUI} from "@/components/models-ui/image-generator-ui"
import {ImageModels} from "@/lib/image-generator/models"
import ImageGallery from "@/components/model-tool/image-gallery"
import {GallerySection} from "@/components/create/gallery-section"


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
    <CreateHero hero={{
        title:langData.hero.title,
        description:langData.hero.description
    }}></CreateHero>
   
    <ImageGeneratorUI models={ImageModels}  />
    <GallerySection />
  </>
}



interface HeroProps {
    title: string;
    description: string;
}

interface HeroComponentProps {
  hero: HeroProps
}

 function CreateHero({ hero }: HeroComponentProps) {
  return (
    <section className="relative py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto text-center">
 

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-pretty leading-tight tracking-tight bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">{hero.title}</h1>

        {/* Tagline */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">{hero.description}</p>
      </div>
    </section>
  )
}


