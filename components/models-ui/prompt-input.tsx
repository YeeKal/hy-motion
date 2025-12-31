"use client";

import * as React from "react";
import { Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RANDOM_PROMPTS } from "@/lib/constants";
import { Lock, ShieldCheck, Zap } from "lucide-react"
import { cn } from "@/lib/utils";
import { BaseRatios } from "@/lib/image-generate/constants";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MaxImageCount } from "@/lib/constants"
import { useTranslations } from "next-intl";
interface PromptInputProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    aspectRatio: string
    onAspectRatioChange: (ratio: string) => void
    imageCount: number
    onImageCountChange: (count: number) => void
    onShowPricing: (arg0: boolean) => void
    isPro?: boolean
    required?: boolean
}

const counts = Array.from({ length: MaxImageCount }, (_, i) => i + 1);


export function PromptInput({
    value,
    onChange,
    aspectRatio,
    onAspectRatioChange,
    imageCount,
    onImageCountChange,
    disabled,
    isPro = false,
    onShowPricing,
    required,
}: PromptInputProps) {
    const t = useTranslations("common.modelPlayground.prompt")
    const handleRandom = () => {
        const random = RANDOM_PROMPTS[Math.floor(Math.random() * RANDOM_PROMPTS.length)];
        onChange(random);
    };

    const handleClear = () => {
        onChange("");
    };

    const handleBatchSizeChange = (value: string) => {
        const count = parseInt(value)
        if (count > 1 && !isPro) {
            // If trying to select > 1 and not pro, show pricing
            onShowPricing(true)
            // Reset to 1 (or keep current if it was 1)
            return
        }
        onImageCountChange(count)
    }

    return (
        <div className="flex flex-col gap-2">

            {/* title */}
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">
                    {t("prompt")}
                    {required ? <span className="text-destructive ml-1">*</span> : <span className="text-muted-foreground ml-1 text-xs font-normal">(Optional)</span>}
                </label>
                <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs text-muted-foreground hover:text-primary"
                    onClick={handleRandom}
                    disabled={disabled}
                >
                    <Sparkles className="mr-1 h-3 w-3" />
                                        {t("random")}
                </Button>
            </div>


            <div className="mb-4 border-2 border-border rounded-xl bg-card overflow-hidden shadow-sm transition-all focus-within:border-primary/50 focus-within:shadow-md">


                {/* Textarea */}
                <div className="relative">
                    <textarea
                        value={value}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
                        disabled={disabled}
                        placeholder="Create something amazing..."
                        className="w-full px-3 sm:px-6 py-5 bg-card text-foreground placeholder-muted-foreground text-base focus:outline-none resize-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        rows={3}
                    />
                    {value && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6 text-muted-foreground hover:text-foreground"
                            onClick={handleClear}
                            disabled={disabled}
                        >
                            <X className="h-3 w-3" />
                        </Button>
                    )}

                </div>

                {/* Bottom Controls */}
                <div className="flex flex-row items-center gap-4 px-6 text-xs sm:text-sm py-3 bg-card relative border-t border-border/50">
                    {/* Aspect Ratio Dropdown */}
                    <Select
                        value={aspectRatio}
                        onValueChange={onAspectRatioChange}
                        disabled={disabled}
                    >
                        <SelectTrigger className="bg-input">
                            <SelectValue placeholder="Select ratio" />
                        </SelectTrigger>
                        <SelectContent>
                            {BaseRatios.map((ratio) => (
                                <SelectItem key={ratio.value} value={ratio.value} >
                                    <span className="font-medium">{ratio.label}</span>

                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>


                    <Select
                        value={imageCount.toString()}
                        onValueChange={handleBatchSizeChange}
                        disabled={disabled}
                    >
                        <SelectTrigger className=" bg-input">
                            <SelectValue placeholder="image count" />
                        </SelectTrigger>
                        <SelectContent>
                            {counts.map((c) => (
                                <SelectItem key={c} value={c.toString()}>
                                    <span className="font-medium">{c} {c > 1 ? t("images") : t("image")} {c > 1 ? isPro ? '(Pro)' : '🔒' : ""}</span>

                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Spacer */}
                    <div className="flex-1 hidden sm:block" />
                    <div className=" text-xs text-muted-foreground pointer-events-none">
                        {value.length} {t("chars")}
                    </div>


                </div>
            </div>

        </div>
    );
}
