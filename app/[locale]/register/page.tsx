import { getServerSession } from "next-auth"
import { RegisterForm } from "@/components/auth/register-form"
import { authOptions } from "@/app/api/auth/auth-config"
import {callbackLink} from "@/lib/constants";
import { redirect } from "@/i18n/routing";
import { Locale } from "@/i18n/config";

export const metadata = {
  title: "Register | z-image.app",
  description:
    "Create an account to access  z-image.app's powerful AI models and visual artifact generation tools.",
};


export default async function RegisterPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const session = await getServerSession(authOptions)
  const { locale } = await params;
  
    if (session) {
    redirect({ href: callbackLink, locale: locale });
  }

  return (

      <main className="flex-1 flex items-center justify-center p-6">
        <RegisterForm />
      </main>
  )
} 