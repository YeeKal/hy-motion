"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useTranslations } from "next-intl"

export function SubscriptionSkeleton() {
  const t = useTranslations('account.subscriptionDetails');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('info')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t('currentPlan')}</h3>
              <Skeleton className="h-6 w-24" />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t('creditBalance')}</h3>
              <Skeleton className="h-6 w-16" />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t('nextBilling')}</h3>
              <Skeleton className="h-6 w-32" />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t('status')}</h3>
              <Skeleton className="h-6 w-20" />
            </div>
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium mb-2">{t('planBenefits')}</h3>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-40 mr-2" />
          <Skeleton className="h-10 w-32" />
        </CardFooter>
      </Card>
    </div>
  )
}