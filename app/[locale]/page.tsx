import { getMessages } from "@/i18n/get-messages";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Hero from "@/components/home/hero-section-row";
import { Features } from "@/components/home/features";
import { CTA } from "@/components/home/call-to-action";
import FAQ from "@/components/home/faq";
import { Locale } from "@/i18n/config";
import ScenarioShowcase from "@/components/home/ScenarioShowcase";
import ZImagePerformance from "@/components/home/image-performance";
import { getAllToolConfigs } from "@/lib/config/tool-utils";
import PlaygroundDemo from "@/components/home/playground-demo";
import MotionGallery from "@/components/home/motion-gallery";
export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages(locale, "home");
  const toolMetaConfigs = await getAllToolConfigs(locale);


  // 直接从 messages 中提取各组件的数据
  const homeData = (messages as any).home;


  return (
    <NextIntlClientProvider messages={messages}>
      <main>
        {homeData.seo.structuredData && homeData.seo.structuredData.map((schema: any, index: number) => (
          <script
            key={`ld-json-${index}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        <Hero hero={homeData.hero} />

        {/* <PlaygroundDemo /> */}
        <MotionGallery />

        {/* 4. 激发欲望 (Desire/Visual Proof) - 展示模型不仅快，画质还很好 */}
        <ScenarioShowcase scenarioShowcase={homeData.useCases} />

        {/* 3. 建立认知与差异化 (Logic & Differentiation) - 解释为什么刚才生成的那么快 */}
        {/* <ModelComparison data={homeData.modelComparison} /> */}

        <ZImagePerformance data={homeData.imagePerformance} />


        {/* 5. 增强信任与细节 (Details & Trust) - 核心特性与技术深度 */}
        <Features {...homeData.features} />
        {/* 7. 消除疑虑 (Objection Handling) */}
        <FAQ {...homeData.faq} />

        {/* 8. 行动转化 (Action) */}
        <CTA {...homeData.cta} />
      </main>
    </NextIntlClientProvider>
  );
}

