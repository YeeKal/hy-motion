"use client"

import { Loader, RefreshCw, Sparkles, Zap, ShieldCheck, Rocket } from "lucide-react"
import { useTranslations } from "next-intl"

interface ActionButtonsProps {
  onReset: () => void
  onRandom: () => void
  onGenerate: () => void
  isGenerating: boolean
  hasPrompt: boolean
  isPro?: boolean
  onShowPricing?: () => void
  count?: number
  maxCount?: number
}

export default function ActionButtons({
  onReset,
  onRandom,
  onGenerate,
  isGenerating,
  hasPrompt,
  isPro = false,
  onShowPricing,
  count = 0,
  maxCount  = 0
}: ActionButtonsProps) {
  const remaining = Math.max(0, maxCount - count);
  const t = useTranslations("home.playground.actionButtons");
  return (
    <div className="flex flex-col items-end gap-2 w-full">

      {/* Button Group Row */}
      <div className="flex flex-row justify-between items-center h-10 w-full">

        {/* Left: Skip Verification Link */}
        <div className="hidden sm:flex gap-2 items-center">

         {!isPro && (
         
            <button
              onClick={onShowPricing}
              className="text-lg text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors whitespace-nowrap px-2 py-1 rounded-md hover:bg-muted/50"
            >
              <Rocket size={16} className="text-pink-500" />
              <span> {t("wantUnlimited")}</span>
            </button>
          )}
        </div>


        {/* Right: Action Buttons */}
        <div className="flex flex-row gap-3 text-xs sm:text-md items-stretch h-full">
          <button
            onClick={onReset}
            disabled={isGenerating}
            className="px-2 sm:px-4 bg-muted hover:bg-secondary text-foreground rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 h-full"
          >
            <RefreshCw size={18} />
            <span className="hidden sm:inline">{t("reset")}</span>
          </button>

          <button
            onClick={onRandom}
            disabled={isGenerating}
            className="px-2 sm:px-4 bg-muted hover:bg-secondary text-foreground rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 h-full"
          >
            <Sparkles size={18} />
            <span className="hidden sm:inline">{t("random")}</span>
          </button>

          <div className="relative flex flex-col items-end">
            <button
              onClick={onGenerate}
              disabled={isGenerating || !hasPrompt}
              className="px-2 sm:px-4 bg-primary hover:bg-primary/90 disabled:bg-muted text-primary-foreground disabled:text-muted-foreground rounded-lg font-semibold transition-colors disabled:opacity-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-32 shadow-lg shadow-primary/20 h-10"
            >
              {isGenerating ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  <span>{t("generating")}</span>
                </>
              ) : (
                <>
                  <Zap size={18} className="fill-current" />
                  <span>{t("run")} {!isPro && 
                 (maxCount > 0 ? (
                    <span>
                      ({remaining} / {maxCount})
                    </span>
                  ) : (
                    t("free")
                  ))
                    }</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex sm:hidden gap-2 items-center">

         {!isPro && (
         
            <button
              onClick={onShowPricing}
              className="text-xs sm:text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors whitespace-nowrap px-2 py-1 rounded-md hover:bg-muted/50"
            >
              <Rocket size={16} className="text-pink-500" />
              <span> {t("noCaptcha")}</span>
            </button>
          )}
        </div>
      </div>

      {/* Micro-copy */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70 pr-1">
        <ShieldCheck size={12} />
        <span>{t("noLoginRequired")}</span>
      </div>

    </div>
  )
}