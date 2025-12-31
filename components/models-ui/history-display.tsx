"use client";

import ArenaResultCard, { ArenaResultItem } from "@/components/models-ui/arena-result-card";
import { useTranslations } from "next-intl";

export interface HistoryResultProps {
    id: string;
    prompt: string;
    timestamp: Date;
    images: ArenaResultItem[];
}

interface HistoryDisplayProps {
    resultsHistory: HistoryResultProps[];
}

export function HistoryDisplay({ resultsHistory }: HistoryDisplayProps) {
    const t = useTranslations("common.modelPlayground");

    if (resultsHistory.length === 0) return null;

    return (
        <div className="space-y-12 mt-12">
            <h2 className="text-2xl font-semibold">{t("display.generationHistory")}</h2>
            {resultsHistory.map((result) => (
                <div key={result.id} className="space-y-4">
                    {/* Prompt Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-foreground">
                                {t("display.promptLabel")} <span className="text-primary">{result.prompt}</span>
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                {result.timestamp.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Images Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {result.images.map((i, idx) => (
                            <ArenaResultCard
                                key={idx}
                                result={i}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
