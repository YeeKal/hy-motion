"use client"

import React, { useState } from "react"
import { ChevronDown } from "lucide-react"
import { useTranslations } from "next-intl"

const ASPECT_RATIOS = [
  { label: "Auto", value: "auto", size: { width: 1024, height: 1024 } },
  { label: "Square (1:1)", value: "1:1", size: { width: 1024, height: 1024 } },
  { label: "Portrait (3:4)", value: "3:4", size: { width: 768, height: 1024 } },
  { label: "Landscape (16:9)", value: "16:9", size: { width: 1280, height: 720 } },
  { label: "Standard (4:3)", value: "4:3", size: { width: 1024, height: 768 } },
  { label: "Vertical (9:16)", value: "9:16", size: { width: 720, height: 1280 } },
  { label: "Ultrawide (21:9)", value: "21:9", size: { width: 1536, height: 640 } },
  { label: "Ultra-vertical (9:21)", value: "9:21", size: { width: 640, height: 1536 } },
]

import { Lock, ShieldCheck, Zap } from "lucide-react"

interface PromptInputProps {
  value: string
  onChange: (value: string) => void
  aspectRatio: string
  onAspectRatioChange: (ratio: string) => void
  imageCount: number
  onImageCountChange: (count: number) => void
  disabled?: boolean
  isPro?: boolean
  onShowPricing?: () => void
}

export default function PromptInput({
  value,
  onChange,
  aspectRatio,
  onAspectRatioChange,
  imageCount,
  onImageCountChange,
  disabled,
  isPro = false,
  onShowPricing,
}: PromptInputProps) {
  const t = useTranslations("home.playground.promptInput");
  const currentAspectRatio = ASPECT_RATIOS.find((r) => r.value === aspectRatio)

  const handleBatchSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const count = parseInt(e.target.value)
    if (count > 1 && !isPro) {
      // If trying to select > 1 and not pro, show pricing
      onShowPricing?.()
      // Reset to 1 (or keep current if it was 1)
      return
    }
    onImageCountChange(count)
  }

  return (
    <div className="mb-4 border-2 border-border rounded-xl bg-card overflow-hidden shadow-sm transition-all focus-within:border-primary/50 focus-within:shadow-md">

      {/* Scheme A: Verification Switch (Header) */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border/50">
        <div className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Z-Image Turbo
        </div>

        {/* Verification Toggle */}
        <div
          className="flex items-center gap-0 bg-background border border-border rounded-full p-1 cursor-pointer hover:border-primary/50 transition-all group shadow-sm"
          onClick={() => !isPro && onShowPricing?.()}
        >
          <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${!isPro ? 'bg-pink-100 text-pink-700 shadow-sm' : 'bg-transparent text-muted-foreground'}`}>
            <ShieldCheck size={14} />
            <span >Captcha: {t("captcha.on")}</span>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${isPro ? 'bg-primary/10 text-primary shadow-sm' : 'text-muted-foreground/60'}`}>
            <Zap size={14} />
            <span> {t("captcha.off")}</span>
          </div>
        </div>
      </div>

      {/* Textarea */}
      <textarea
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={t("placeholder")}
        className="w-full px-6 py-5 bg-card text-foreground placeholder-muted-foreground text-xl sm:text-2xl focus:outline-none resize-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        rows={3}
      />

      {/* Bottom Controls */}
      <div className="flex flex-row sm:items-center gap-4 px-6 py-3 bg-card relative border-t border-border/50">
        {/* Aspect Ratio Dropdown */}
        <div className="flex-shrink-0 relative z-40">
          <select
            value={aspectRatio}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onAspectRatioChange(e.target.value)}
            disabled={disabled}
            className="px-3 py-1.5 bg-input border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer pr-8 bg-no-repeat bg-right hover:bg-accent"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234f46e5' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
              backgroundPosition: "right 8px center",
              paddingRight: "28px",
            }}
          >
            {ASPECT_RATIOS.map((ratio) => (
              <option key={ratio.value} value={ratio.value}>
                {ratio.label}
              </option>
            ))}
          </select>
        </div>

        {/* Scheme B: Batch Size Selector */}
        <div className="flex-shrink-0 relative z-40">
          <div className="relative">
            <select
              value={imageCount}
              onChange={handleBatchSizeChange}
              disabled={disabled}
              className="px-3 py-1.5 bg-input border border-border rounded-lg text-foreground text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer pr-8 bg-no-repeat bg-right hover:bg-accent min-w-[140px]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%234f46e5' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundPosition: "right 8px center",
                paddingRight: "28px",
              }}
            >
              <option value={1}>{t("imageCount.one")}</option>
              <option value={2}>{t("imageCount.two")} {isPro ? '(Pro)' : '🔒'}</option>
              <option value={4}>{t("imageCount.four")} {isPro ? '(Pro)' : '🔒'}</option>
            </select>
            {!isPro && imageCount === 1 && (
              <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none">
                {/* Optional lock icon overlay if needed, but emoji works well */}
              </div>
            )}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1 hidden sm:block" />

        {/* Display current dimensions */}
        {currentAspectRatio && (
          <div className="text-xs text-muted-foreground flex-shrink-0 hidden md:block font-mono bg-muted/50 px-2 py-1 rounded">
            {currentAspectRatio.size.width} × {currentAspectRatio.size.height}
          </div>
        )}
      </div>
    </div>
  )
}
