import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import PageWrapper from "@/components/wrapper/page-wrapper";
import GoogleAnalytics from "@/components/analytics/google-analytics";
import UmamiAnalytics from "@/components/analytics/umami-analytics";
import GoogleAdsense from "@/components/analytics/google-adsense";
import { AuthProvider } from "@/components/common/auth-provider";
import { Toaster } from "sonner";
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
const baseUrl = process.env.BASE_URL || "http://localhost:3000/";


export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}
export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;

    // 验证 locale 合法性（可选，和 layout 里保持一致）
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // 必须先设置 locale，否则 getTranslations 拿不到正确的语言
    setRequestLocale(locale);
    const t = await getTranslations({ locale, namespace: "common.seo" });


    return {
        metadataBase: new URL(baseUrl),
        title: t("title"),
        description: t("description"),
        alternates: {
            canonical: "./",
        },
        openGraph: {
            description: t("description"),
            images: [t("ogImage")],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: t("title"),
            description: t("description"),
            creator: t("creator"),
            images: [t("ogImage")],
        },
    };
}

export default async function LocaleLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    // Enable static rendering
    setRequestLocale(locale);

    // Providing all messages to the client
    // side is the easiest way to get started

    return (
        <NextIntlClientProvider>
            <AuthProvider>
                <PageWrapper>
                    {children}
                    <Toaster position="top-center" richColors />

                    {process.env.ANALYTICS_ID && (
                        <GoogleAnalytics id={process.env.ANALYTICS_ID} />
                    )}
                    {process.env.UMAMI_ID && (
                        <UmamiAnalytics id={process.env.UMAMI_ID} />
                    )}
                    {process.env.GOOGLE_ADSNESE_ID && (
                        <GoogleAdsense id={process.env.GOOGLE_ADSNESE_ID} />
                    )}
                </PageWrapper>
            </AuthProvider>
        </NextIntlClientProvider>
    );
}
