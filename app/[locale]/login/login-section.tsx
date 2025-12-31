'use client'
import { Link } from "@/i18n/routing";
import { LoginForm } from "@/components/auth/login-form";
import { DEFAULT_CREDITS } from "@/lib/constants";
import { useTranslations } from "next-intl";

export function LoginSection(){
      const t = useTranslations("page")
    
    return (
        <div className="lg:p-8 h-full flex items-center justify-center">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] py-24">

            {/* 标题与激励文案 */}
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                {t('welcome')}
              </h1>
              <p className="text-sm text-muted-foreground">
                 {t.rich("signInText", {
                  credits: DEFAULT_CREDITS,
                  highlight: (chunks) => <span className="text-indigo-600 font-semibold">{chunks}</span>
                })}
              </p>
            </div>

            <LoginForm />

            {/* 底部协议声明 */}
            <p className="px-8 text-center text-sm text-muted-foreground">
              {t.rich("terms", {
                terms: (chunks) => (
                  <Link
                    href="/terms"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    {chunks}
                  </Link>
                ),
                privacy: (chunks) => (
                  <Link
                    href="/privacy"
                    className="underline underline-offset-4 hover:text-primary"
                  >
                    {chunks}
                  </Link>
                )
              })}
            </p>
          </div>
        </div>
    )
}