import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/auth-config"
import { AccountSettings } from "@/components/account/account-settings"
import { Logo } from "@/components/wrapper/logo"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/routing"
import { getMessages } from "@/i18n/get-messages";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { Locale } from "@/i18n/config";

/*
not use redirect in this.
show a real page for better seo
 */

export default async function AccountPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages(locale, "account");
  const pageData = messages.account.page;
  const session = await getServerSession(authOptions)

  return (
    <NextIntlClientProvider messages={messages}>
      <main className="container max-w-7xl mx-auto p-6">
        {session ? (
          <div className="px-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#5182ED]  to-[#D56575]
                    bg-clip-text
                    text-transparent ">{"> "}{pageData.hello}{pageData.friend}</h1>
            {/* text-transparent ">{"> Hello, "}{session.user.name}</h1> */}
            {/* <p className="text-muted-foreground">{session.user.email}</p> */}
          </div>

        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 text-center">
              <div className="space-y-4">
                <Logo className="mx-auto" /> {/* Replace with your logo */}
                <h2 className="mt-6 text-3xl font-bold tracking-tight bg-gradient-to-r from-[#5182ED] to-[#D56575] bg-clip-text text-transparent">
                  {pageData.joinCommunity}
                </h2>
                <p className="text-muted-foreground">
                  {pageData.signInDesc}
                </p>
              </div>

                <Button asChild variant="default" className="px-10">
                  <Link href="/login">
                    {pageData.signIn}
                  </Link>
                </Button>
            </div>
          </div>
        )}

        {session && <AccountSettings  />}
      </main>
    </NextIntlClientProvider>
  )
}