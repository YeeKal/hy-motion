"use client"
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { User } from "next-auth"
import { signOut } from "next-auth/react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Coins, CreditCard } from "lucide-react"
import { Link } from "@/i18n/routing"
import { formatTier } from "@/lib/utils"
import { useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl";
import { useCredits } from "@/hooks/useCredits"



export function AccountSettings() {
  const router = useRouter()
  const t = useTranslations('account.settings');
  const { credits,subscriptionTier, isLoading, refreshCredits } = useCredits();


  return (
    <div className="space-y-6 py-20">
      <h2 className="text-3xl font-bold">{t('title')}</h2>

      <div className="grid gap-6 md:grid-cols-2 ">
        <Card>
          <CardHeader>
            <CardTitle>{t('subscriptionTitle')}</CardTitle>
            <CardDescription>{t('subscriptionDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">{t('currentPlan')}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant={subscriptionTier === "FREE" ? "outline" : "default"}>
                    {formatTier(subscriptionTier)}
                  </Badge>
                </div>
              </div>
              {subscriptionTier === "FREE" && (
                <Button variant="outline" asChild>
                  <Link href="/pricing">
                    <CreditCard className="h-4 w-4 mr-2" />
                    {t('upgrade')}
                  </Link>
                </Button>
              )}

            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-medium">{t('creditBalance')}</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <Coins className="h-4 w-4 mr-2 text-amber-500" />
                  <span className="font-medium">{credits || 0}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {t('creditsDesc')}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            {
              subscriptionTier !== "FREE" && (
                <Button variant="outline" asChild>
                  <Link href="/account/subscription">
                    <CreditCard className="h-4 w-4 mr-2" />
                    {t('manageSubscription')}
                  </Link>
                </Button>
              )
            }
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('accountActions')}</CardTitle>
          </CardHeader>
          <CardFooter>
            <Button
              variant="destructive"
              onClick={async () => {
                await signOut({ redirect: false }); // 阻止自动跳转
                router.refresh(); // 关键：强制刷新 Server Components (如 Header)
                router.push("/login"); // 然后再跳转
              }}
            >
              {t('logout')}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}