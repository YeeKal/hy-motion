import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Mail,
} from "lucide-react"; // Example icons
import { ContactPageContent } from "./contact-page-content";
import { BRAND_NAME, SUPPORT_EMAIL } from "@/lib/constants";
import { Link } from "@/i18n/routing";
import { setRequestLocale } from 'next-intl/server';
import { getMessages } from "@/i18n/get-messages";
import { Locale } from "@/i18n/config";
import { NextIntlClientProvider } from "next-intl";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const m = await getMessages(locale, "contact");

  return {
    title: m.contact.seo.title,
    description: m.contact.seo.description,
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const m = await getMessages(locale, "contact");
  setRequestLocale(locale);

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white  md:text-5xl">
          {m.contact.header.title}
          <span className="text-primary">{BRAND_NAME}</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          {m.contact.header.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Column 1: Contact Info & Direct Email */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <Mail className="mr-2 h-6 w-6 text-primary" /> {m.contact.inquiries.title}
            </CardTitle>
            <CardDescription>
              {m.contact.inquiries.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {m.contact.inquiries.responseData}
            </p>
            <div>
              <p
                className="text-lg font-semibold text-primary hover:underline flex items-center"
              >
                <Mail className="mr-2 h-5 w-5" /> {SUPPORT_EMAIL}
              </p>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {m.contact.inquiries.faqText}{" "}
              <Link
                href="/#faq"
                className="font-medium text-primary hover:underline"
                prefetch={false}
              >
                {m.contact.inquiries.faqLink}
              </Link>
              .
            </p>
          </CardContent>
        </Card>

        {/* Column 2: Contact Form */}
        <NextIntlClientProvider messages={m.contact.form}>

          <ContactPageContent />
        </NextIntlClientProvider>
      </div>
    </div>
  );
}

