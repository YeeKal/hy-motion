import PricingCards from "@/components/payment/pricing-page";
import { Link, redirect } from "@/i18n/routing";
import { EarlyBirdBanner } from "@/components/payment/early-bird-banner";
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/auth-config"
import { getMessages } from "@/i18n/get-messages";

import { NextIntlClientProvider, useTranslations } from "next-intl";
import { Locale } from "@/i18n/config";
import CreditUsageTable from "@/components/payment/pricing-cresit-table"
import {PricingHero} from "@/components/payment/hero"

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params;
    const m = await getMessages(locale, "pricing");

  return {
 title: m.pricing.seo.title,
        description: m.pricing.seo.description,
  };
}

export default async function PricingPage({ params }: { params: Promise<{ locale: Locale }> }) {
    redirect({ href: '/', locale: 'en' });

    const { locale } = await params;
    const m = await getMessages(locale, "pricing");
const pricingData = m.pricing;
  const session = await getServerSession(authOptions)

  return (
    <NextIntlClientProvider messages={pricingData}>
      <section className="container max-w-7xl mx-auto px-4">

        {/* Header Section */}
        <PricingHero/>

        {/* Early Bird Banner */}
        <EarlyBirdBanner />



        <PricingCards user={session ? session.user : undefined} />


        <CreditUsageTable/>

        <div className="mt-12 mb-8">
          <h2 className="text-3xl font-semibold mb-4">
            {pricingData.features.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pricingData.features.items.map((item: any, index: number) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-primary">{item.icon}</span>
                  <h3 className="font-medium">{item.title}</h3>
                </div>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 mb-8">
          <h2 className="text-3xl font-semibold mb-4">
            {pricingData.moreFaq.title}
          </h2>
          <div className="space-y-4">
            {pricingData.moreFaq.items.map((item: any, index: number) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium">
                  {item.question}
                </h3>
                <p className="mt-2" dangerouslySetInnerHTML={{ __html: item.answer }} />
              </div>
            ))}
          </div>
        </div>

        <div className="container mx-auto max-w-5xl px-4">
          {/* The Card-like container for the CTA content */}
          <div className="flex flex-col items-center rounded-2xl bg-gradient-to-br from-pink-200 via-purple-200 to-teal-200 p-8 text-center shadow-sm md:p-12">

            {/* Main Headline */}
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              {pricingData.cta.title}
            </h2>

            {/* Descriptive Text */}
            <p className="mt-4 max-w-2xl text-lg text-foreground">
              {pricingData.cta.desc}
            </p>

            {/* The Call to Action Button */}
            <div className="mt-8">
              <Link
                href="/"
                className="inline-flex items-center justify-center h-14 px-8 text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors shadow-lg"
              >
                {pricingData.cta.button}
              </Link>
            </div>

          </div>
        </div>
      </section>
    </NextIntlClientProvider>
  );
}


