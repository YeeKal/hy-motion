"use client"

import { Check, X, Zap, Lock, Infinity, Rocket, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Link } from "@/i18n/routing"
import { useSession, signIn } from "next-auth/react"
import { PRICING_PLANS } from "@/lib/ai-tools/products"
import { useTranslations } from "next-intl"

interface PricingArenaProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function PricingArena({ open, onOpenChange }: PricingArenaProps) {
    const { data: session } = useSession();
    const isLoggedIn = !!session;
        const t = useTranslations('arena.pricing');
    

    const basicPlan = PRICING_PLANS.find(p => p.id === "BASIC");
    const proPlan = PRICING_PLANS.find(p => p.id === "PRO");

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-center">
                        {isLoggedIn ? t('titleLoggedIn') : t('titleLoggedOut')}
                    </DialogTitle>
                    <DialogDescription className="text-center text-base mt-2">
                        {t('description')}
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-6">
                    {/* Free Tier */}
                    <div className="space-y-4 hidden p-5 rounded-xl bg-muted/50 border border-border sm:flex flex-col">
                        <div className="text-center space-y-1">
                            <h3 className="font-bold text-lg">{t('free.title')}</h3>
                        </div>
                        <ul className="space-y-3 text-sm flex-1">
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span>{t('free.credits')}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span>{t('free.access')}</span>
                            </li>
                            <li className="flex items-center gap-2 text-muted-foreground">
                                <X className="w-4 h-4 flex-shrink-0" />
                                <span>{t('free.limit')}</span>
                            </li>
                        </ul>
                        {!isLoggedIn && (
                                <Link href="/login">
                            
                            <Button className="w-full" variant="default">
                                <LogIn className="w-4 h-4 mr-2" />
                                {t('free.button')}

                            </Button>
                            </Link>

                        )}
                    </div>

                    {/* Basic Tier */}
                    <div className="space-y-4 p-5 rounded-xl bg-card border border-border flex flex-col relative shadow-sm hover:border-primary/50 transition-colors">
                        <div className="text-center space-y-1">
                            <h3 className="font-bold text-lg text-primary">{t('basic.title')}</h3>
                        </div>
                        <ul className="space-y-3 text-sm flex-1">
                            <li className="flex items-center gap-2 font-medium">
                                <Zap className="w-4 h-4 text-primary flex-shrink-0" />
                                <span>{t('basic.credits')}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span>{t('basic.compare')}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <span>{t('basic.license')}</span>
                            </li>
                        </ul>
                        <Button asChild className="w-full" variant={isLoggedIn ? "default" : "secondary"}>
                            <Link href="/pricing">
                                {t('basic.button')}
                            </Link>
                        </Button>
                    </div>

                    {/* Pro Tier */}
                    <div className="space-y-4 p-5 rounded-xl bg-primary/5 border border-primary/20 flex flex-col relative overflow-hidden shadow-md">
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-bl-lg font-bold">
                            {t('pro.badge')}
                        </div>
                        <div className="text-center space-y-1">
                            <h3 className="font-bold text-lg text-primary">{t('pro.title')}</h3>
                        </div>
                        <ul className="space-y-3 text-sm flex-1">
                            <li className="flex items-center gap-2 font-medium">
                                <Rocket className="w-4 h-4 text-primary flex-shrink-0" />
                                <span>{t('pro.credits')}</span>
                            </li>
                            <li className="flex items-center gap-2 font-medium">
                                <Infinity className="w-4 h-4 text-primary flex-shrink-0" />
                                <span>{t('pro.priority')}</span>
                            </li>
                            <li className="flex items-center gap-2 font-medium">
                                <Lock className="w-4 h-4 text-primary flex-shrink-0" />
                                <span>{t('pro.private')}</span>
                            </li>
                        </ul>
                        <Button asChild className="w-full shadow-lg shadow-primary/20">
                            <Link href="/pricing">
                                {t('pro.button')}
                            </Link>
                        </Button>
                    </div>
                </div>
            <div className="flex flex-col gap-3 mt-2">
                    <div className="flex justify-center">
                        <span className="bg-pink-100 text-pink-700 text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                            {t('promo')}
                        </span>
                    </div>
                    <Button asChild size="lg" className="w-full font-bold text-lg shadow-lg shadow-primary/20">
                        <Link href="/pricing">
                            {t('viewPlans')}
                        </Link>
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                       {t('footer')}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
