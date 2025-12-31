import { getServerSession } from "next-auth";
import { redirect } from "@/i18n/routing";
import Image from "next/image";
import { authOptions } from "@/app/api/auth/auth-config";
import { callbackLink } from "@/lib/constants";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "@/i18n/get-messages";
import { Locale } from "@/i18n/config";
import { LoginSection } from "./login-section";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
    const { locale } = await params;
    const m = await getMessages(locale, "login");

  return {
    title: m.login.seo.title,
    description: m.login.seo.description,
  };
}

export default async function LoginPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const session = await getServerSession(authOptions);
  const { locale } = await params;
    if (session) {
    redirect({ href: callbackLink, locale: locale });
  }
    const m = await getMessages(locale, "login");



  return (
    <NextIntlClientProvider messages={m.login}>
      <div className="container mx-auto relative flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">


        {/* --- 左侧：视觉展示区 (仅在大屏显示) --- */}
        <div className="relative hidden h-250 flex-col bg-muted p-10 text-white dark:border-r lg:flex items-center">
          {/* 背景图：建议换成你 Z-Image 生成的最酷的一张图 */}
          <div className="absolute inset-0 bg-zinc-900">
            <Image
              src="https://cdn.hy-motion.ai/home/login-motion.webp"
              alt="Z-Image Generation"
              fill
              className="object-cover opacity-60"
              priority
            />
            {/* 渐变遮罩，保证文字清晰 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
          </div>


          {/* 底部：引语/好评/特性介绍 */}
          <div className="relative z-20 mt-40">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;{m.login.hero.quote}&rdquo;
              </p>
              <footer className="text-sm text-zinc-300">
                {m.login.hero.footer}
              </footer>
            </blockquote>
          </div>
        </div>

        <LoginSection/>

       
      </div>
    </NextIntlClientProvider>
  );
}