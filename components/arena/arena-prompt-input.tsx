"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Sparkles } from "lucide-react";
import { RANDOM_PROMPTS } from "@/lib/constants"
import { BaseRatios } from "@/lib/image-generate/constants";
import { useTranslations } from "next-intl";


interface ArenaPromptInputProps {
    value: string;
    onChange: (value: string) => void;
    aspectRatio: string;
    onAspectRatioChange: (ratio: string) => void;
    disabled?: boolean;
}

export function ArenaPromptInput({
    value,
    onChange,
    aspectRatio,
    onAspectRatioChange,
    disabled,
}: ArenaPromptInputProps) {
    const t = useTranslations('arena.promptInput');

    const handleReset = () => {
        onChange("");
        onAspectRatioChange("1:1");
    };


    const handleRandom = () => {
        const random = RANDOM_PROMPTS[Math.floor(Math.random() * RANDOM_PROMPTS.length)];
        onChange(random);
    };
    return (
        <div className="border-2 border-border rounded-xl bg-card overflow-hidden shadow-sm focus-within:border-primary/50 focus-within:shadow-md transition-all">
            <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                placeholder={t('placeholder')}
                className="w-full px-6 py-5 bg-card text-foreground placeholder-muted-foreground text-sm sm:text-xl focus:outline-none resize-none border-0 focus-visible:ring-0 min-h-[120px]"
            />

            <div className="flex items-center justify-between gap-2 px-4 py-3 bg-muted/30 border-t border-border/50">
                <div className="flex items-center gap-2">
                    <Select value={aspectRatio} onValueChange={onAspectRatioChange} disabled={disabled}>
                        <SelectTrigger className="w-[140px] h-8 text-xs bg-background">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {BaseRatios.map((ratio) => (
                                <SelectItem key={ratio.value} value={ratio.value}>
                                    {ratio.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>


                    <Button variant="outline" onClick={handleRandom} disabled={disabled}>
                        <Sparkles className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" onClick={handleReset} disabled={disabled} size="icon">
                        <RefreshCcw className="h-4 w-4" />
                    </Button>

                </div>

                <div className="text-xs text-muted-foreground">
                    {value.length} {t('chars')}
                </div>
            </div>
        </div>
    );
}
