"use client"

import { LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Link } from "@/i18n/routing"
import { useSession } from "next-auth/react"
import { useTranslations } from "next-intl"
import { Icon } from "@/components/wrapper/lucide-icon"
import { ThirdPartyProviders } from "@/components/auth/third-party-providers";

interface PricingArenaProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

interface PlanFeature {
    icon: string
    text: string
    highlight: boolean
}

export function PricingPopup({ open, onOpenChange }: PricingArenaProps) {
    const { status } = useSession();
    const isLoggedIn = status === "authenticated";
    const t = useTranslations('common.modelPlayground.pricingArena');

    const freeFeatures = t.raw('plans.free.features') as PlanFeature[];
    const basicFeatures = t.raw('plans.basic.features') as PlanFeature[];
    const proFeatures = t.raw('plans.pro.features') as PlanFeature[];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                        {isLoggedIn ? t('title.loggedIn') : t('title.loggedOut')}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {isLoggedIn ? t('description.loggedIn') : t('description.loggedOut')}
                    </DialogDescription>
                </DialogHeader>
                {isLoggedIn ? (
                    <>
                <div className="grid grid-cols-2 gap-4 py-6">
           

                    {/* Basic Tier */}
                    <div className="space-y-4 p-5 rounded-xl bg-card border border-border flex flex-col relative shadow-sm hover:border-primary/50 transition-colors">
                        <div className="text-center space-y-1">
                            <h3 className="font-bold text-lg text-primary">{t('plans.basic.title')}</h3>
                        </div>
                        <ul className="space-y-3 text-sm flex-1">
                            {basicFeatures.map((feature, index) => (
                                <li key={index} className={`flex items-center gap-2 ${feature.highlight ? 'font-medium' : ''}`}>
                                    <Icon name={feature.icon} className={`w-4 h-4 flex-shrink-0 ${feature.highlight ? 'text-primary' : (feature.icon === 'Check' ? 'text-green-500' : '')}`} />
                                    <span>{feature.text}</span>
                                </li>
                            ))}
                        </ul>
                        <Button asChild className="w-full" variant={isLoggedIn ? "default" : "secondary"}>
                            <Link href="/pricing">
                                {t('plans.basic.cta')}
                            </Link>
                        </Button>
                    </div>

                    {/* Pro Tier */}
                    <div className="space-y-4 p-5 rounded-xl bg-primary/5 border border-primary/20 hidden sm:flex flex-col relative overflow-hidden shadow-md">
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-bl-lg font-bold">
                            {t('plans.pro.badge')}
                        </div>
                        <div className="text-center space-y-1">
                            <h3 className="font-bold text-lg text-primary">{t('plans.pro.title')}</h3>
                        </div>
                        <ul className="space-y-3 text-sm flex-1">
                            {proFeatures.map((feature, index) => (
                                <li key={index} className={`flex items-center gap-2 ${feature.highlight ? 'font-medium' : ''}`}>
                                    <Icon name={feature.icon} className={`w-4 h-4 flex-shrink-0 ${feature.highlight ? 'text-primary' : ''}`} />
                                    <span>{feature.text}</span>
                                </li>
                            ))}
                        </ul>
                        <Button asChild className="w-full shadow-lg shadow-primary/20">
                            <Link href="/pricing">
                                {t('plans.pro.cta')}
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col gap-3 mt-2">
                    <div className="flex justify-center">
                        <span className="bg-pink-100 text-pink-700 text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                            {t('footer.promo')}
                        </span>
                    </div>
                    <Button asChild size="lg" className="w-full font-bold text-lg shadow-lg shadow-primary/20">
                        <Link href="/pricing">
                            {t('footer.viewPlans')}
                        </Link>
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                        {t('footer.guarantee')}
                    </p>
                </div>
                </>
                ):
                (
                        <ThirdPartyProviders callbackUrl="/playground" ></ThirdPartyProviders>
                )}
            </DialogContent>
        </Dialog>
    )
}
