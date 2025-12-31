import { Suspense } from "react"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/auth-config"
import { redirect } from "next/navigation"
import { SubscriptionDetails } from "@/components/account/subscription-details"
import { SubscriptionSkeleton } from "@/components/account/subscription-skeleton"
import { getMessages } from "@/i18n/get-messages";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Locale } from "@/i18n/config";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages(locale, "account");
  const subData = messages.account.subscription;

    return {
        title: subData.title,
        description: subData.description,
    };
}



export default async function SubscriptionPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages(locale, "account");
  const subData = messages.account.subscription;

  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return (
    <NextIntlClientProvider messages={messages}>
      <main className="container max-w-2xl mx-auto p-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{subData.title}</h1>
            <p className="text-muted-foreground">{subData.viewDetails}</p>
          </div>

          <Suspense fallback={<SubscriptionSkeleton />}>
            <SubscriptionDetails user={session.user} />
          </Suspense>
        </div>
      </main>
    </NextIntlClientProvider>
  )
}