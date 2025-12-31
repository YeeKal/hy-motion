"use client"

import { Check, X, Zap, Lock, Infinity, Rocket } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Link } from "@/i18n/routing"
import { MAX_DAILY_LIMIT } from "@/lib/constants"
import { ThirdPartyProviders } from "@/components/auth/third-party-providers";

import { useSession, signIn } from "next-auth/react"
import { useTranslations } from "next-intl"
import { Icon } from "@/components/wrapper/lucide-icon"

interface PricingModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

interface PlanFeature {
    icon: string
    text: string
    highlight: boolean
}

export function PricingModal({ open, onOpenChange }: PricingModalProps) {
    const { data: session } = useSession()
    const isLoggedIn = !!session
    const t = useTranslations("home.playground.pricingModal")
        const freeFeatures = t.raw('plans.free.features') as PlanFeature[];
    const proFeatures = t.raw('plans.pro.features') as PlanFeature[];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                        {isLoggedIn ? t('title.loggedIn') :t('title.loggedOut')}
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        {isLoggedIn ? t('description.loggedIn') :t('description.loggedOut')}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-4 py-4">
                    {/* Free Tier */}
                    <div className="space-y-3 p-4 rounded-lg bg-muted/50 flex flex-col">
                        <h3 className="font-semibold text-muted-foreground text-center">{t('plans.free.title')}</h3>
                        <ul className="space-y-2 text-sm flex-1">
                             {freeFeatures.map((feature, index) => (
                                                            <li key={index} className={`flex items-center gap-2 ${feature.highlight? "":"text-muted-foreground"}`}>
                                                                <Icon name={feature.icon} className={`w-4 h-4 ${feature.icon === 'Check' ? 'text-green-500' : ''}`} />
                                                                <span>{feature.text}</span>
                                                            </li>
                                                        ))}
                            
                        </ul>
                        {!isLoggedIn && (
                            <ThirdPartyProviders callbackUrl="/" isPop={true}></ThirdPartyProviders>
                            // <Button onClick={() => signIn()} className="w-full mt-2" variant="outline">
                            //     Login
                            // </Button>
                        )}
                    </div>

                    {/* Pro Tier */}
                    <div className="space-y-3 p-4 rounded-lg bg-primary/5 border border-primary/20 relative overflow-hidden flex flex-col">
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-bl-lg font-bold">
                            {t('plans.pro.badge')}
                        </div>
                        <h3 className="font-semibold text-primary text-center">{t('plans.pro.title')}</h3>
                        <ul className="space-y-2 text-sm flex-1">
                            {proFeatures.map((feature, index) => (
                                                            <li key={index} className={`flex items-center gap-2  font-medium`}>
                                                                <Icon name={feature.icon} className={`w-4 h-4 text-primary`} />
                                                                <span>{feature.text}</span>
                                                            </li>
                                                        ))}
                           
                        </ul>
                        {!isLoggedIn && (
                            <Button asChild className="w-full mt-2">
                                <Link href="/pricing">
                                    {t('plans.pro.cta')}
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                
                    <div className="flex flex-col gap-3 mt-2">
                        <div className="flex justify-center">
                            <span className="bg-pink-100 text-pink-700 text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                                {t('footer.promo')}
                            </span>
                        </div>
                        {isLoggedIn && (
                        <Button asChild size="lg" className="w-full font-bold text-lg shadow-lg shadow-primary/20">
                            <Link href="/pricing">
                               {t('footer.viewPlans')}
                            </Link>
                        </Button>
                )}

                        <p className="text-xs text-center text-muted-foreground">
                            {t('footer.guarantee')}
                        </p>
                    </div>
            </DialogContent>
        </Dialog>
    )
}
