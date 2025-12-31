"use client";

import { useState } from "react";
import { ArenaPromptInput } from "./arena-prompt-input";
import { ModelSelector } from "./model-selector";
import { ArenaResults, ArenaResultProps } from "./arena-results";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Sparkles, Zap } from "lucide-react";
import { toast } from "sonner";
import { fal } from "@fal-ai/client";
import { ARENA_MODELS } from "@/lib/arena/models";
import { useCredits } from "@/hooks/useCredits";
import { PricingArena } from "@/components/arena/pricing-arena";
import { ARENA_DEFAULT_PROMPT } from "@/lib/constants";
import { useTranslations } from "next-intl";

// Configure FAL client
fal.config({
    proxyUrl: "/api/fal/proxy",
});

const POLL_CYCLE_TIME = 1000
const POLL_TIMEOUT = 120000

export function ArenaPlayground() {
    const { credits, refreshCredits } = useCredits();
    const [prompt, setPrompt] = useState(ARENA_DEFAULT_PROMPT);
    const [aspectRatio, setAspectRatio] = useState("1:1");
    const [selectedModels, setSelectedModels] = useState<string[]>(["z-image-turbo", "nano-banana-pro", "flux-2-pro"]);
    const [results, setResults] = useState<ArenaResultProps[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPricing, setShowPricing] = useState(false);

    const t = useTranslations('arena.playground');

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            toast.error(t('errorPrompt'));
            return;
        }
        if (selectedModels.length === 0) {
            toast.error(t('errorModel'));
            return;
        }

        // Calculate required credits
        const requiredCredits = selectedModels.reduce((sum, id) => {
            const model = ARENA_MODELS.find(m => m.id === id);
            return sum + (model?.credit || 0);
        }, 0);

        if ((credits || 0) < requiredCredits) {
            setShowPricing(true);
            return;
        }

        setIsGenerating(true);
        const resultId = Date.now().toString();

        const loadingResult: ArenaResultProps = {
            id: resultId,
            prompt,
            timestamp: new Date(),
            images: selectedModels.map((id) => ({
                modelId: id,
                status: "queued",
            }))
        }
        setResults([loadingResult, ...results])

        try {
            const response = await fetch("/api/async-image-arena", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt,
                    aspectRatio,
                    modelIds: selectedModels,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || "Failed to start generation");
            }

            const data = await response.json();

            // Update results with request IDs and start polling
            const newImages = data.results.map((r: any) => ({
                modelId: r.modelId,
                status: r.status === "failed" ? "failed" : "queued",
                requestId: r.requestId,
                error: r.error
            }));

            setResults(prevResults => {
                return prevResults.map(result => {
                    if (result.id === resultId) {
                        return {
                            ...result,
                            images: newImages
                        };
                    }
                    return result;
                });
            });
            refreshCredits();

            // Start polling for each valid request
            newImages.forEach((res: any) => {
                if (res.requestId && res.status !== "failed") {
                    pollResult(res.modelId, res.requestId, resultId);
                }
            });

        } catch (error: any) {
            toast.error(error.message);
            setIsGenerating(false);
            setResults(prev => prev.map(group =>
                group.id === resultId
                    ? {
                        ...group,
                        images: group.images.map(img =>
                            img.status == "queued" || img.status == "generating"
                                ? { ...img, status: "failed", error: error.message }
                                : img
                        )
                    }
                    : group
            ));
        }
    };

    const pollResult = async (modelId: string, requestId: string, resultId: string) => {
        const TIMEOUT_MS = POLL_TIMEOUT; // 2 min timeout
        const startTime = Date.now();

        const checkStatus = async () => {
            if (Date.now() - startTime > TIMEOUT_MS) {
                setResults(prev => prev.map(group =>
                    group.id === resultId
                        ? {
                            ...group,
                            images: group.images.map(img =>
                                img.requestId === requestId
                                    ? { ...img, status: "failed", error: t('timeout') }
                                    : img
                            )
                        }
                        : group
                ));
                checkAllFinished();
                return;
            }
            try {
                const apiId = ARENA_MODELS.find(m => m.id === modelId)?.apiId || "";
                const status = await fal.queue.status(apiId, {
                    requestId,
                    logs: false
                });

                if (status.status === "COMPLETED") {
                    const result = await fal.queue.result(apiId, {
                        requestId
                    });

                    const imageUrl = result.data.images?.[0]?.url || result.data.image?.url;

                    setResults(prev => prev.map(group =>
                        group.id === resultId
                            ? {
                                ...group,
                                images: group.images.map(img =>
                                    img.requestId === requestId
                                        ? {
                                            ...img,
                                            status: "completed",
                                            imageUrl: imageUrl,
                                            generationTime: Date.now() - startTime
                                        }
                                        : img
                                )
                            }
                            : group
                    ));

                    checkAllFinished();
                } else if (status.status === "IN_QUEUE" || status.status === "IN_PROGRESS") {
                    setResults(prev => prev.map(group =>
                        group.id === resultId
                            ? {
                                ...group,
                                images: group.images.map(img =>
                                    img.requestId === requestId
                                        ? { ...img, status: "generating" }
                                        : img
                                )
                            }
                            : group
                    ));
                    setTimeout(checkStatus, POLL_CYCLE_TIME);
                } else {
                    setResults(prev => prev.map(group =>
                        group.id === resultId
                            ? {
                                ...group,
                                images: group.images.map(img =>
                                    img.requestId === requestId
                                        ? { ...img, status: "failed", error: t('failed') }
                                        : img
                                )
                            }
                            : group
                    ));
                    checkAllFinished();
                }
            } catch (e) {
                console.error("Polling error", e);
                setResults(prev => prev.map(group =>
                    group.id === resultId
                        ? {
                            ...group,
                            images: group.images.map(img =>
                                img.requestId === requestId
                                    ? { ...img, status: "failed", error: t('pollingFailed') }
                                    : img
                            )
                        }
                        : group
                ));
                checkAllFinished();
            }
        };

        checkStatus();
    };

    const checkAllFinished = () => {
        setResults(current => {
            const isAnyGenerating = current.some(group =>
                group.images.some(img => ["queued", "generating"].includes(img.status))
            );

            if (!isAnyGenerating) {
                setIsGenerating(false);
            }
            return current;
        });
    };

    return (
        <section className="max-w-7xl px-4 md:px-6 pb-24 mx-auto">
            <div className="mx-auto bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 md:p-8 shadow-sm">

                <div className="space-y-8">
                    <div className="space-y-6">
                        <ModelSelector
                            selectedModels={selectedModels}
                            onSelect={setSelectedModels}
                            disabled={isGenerating}
                        />

                        <ArenaPromptInput
                            value={prompt}
                            onChange={setPrompt}
                            aspectRatio={aspectRatio}
                            onAspectRatioChange={setAspectRatio}
                            disabled={isGenerating}
                        />

                        <div className="flex flex-col gap-3 justify-start min-w-[140px]">
                            <Button
                                onClick={handleGenerate}
                                disabled={isGenerating || !prompt.trim()}
                                className="h-10 sm:h-14 text-sm sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                            >
                                {isGenerating ? (
                                    <>
                                        <Zap className="mr-2 h-5 w-5 animate-pulse" />
                                        {t('generating')}
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-5 w-5" />
                                        {t('generate', {
                                            credits: selectedModels.reduce((sum, id) => {
                                                const model = ARENA_MODELS.find(m => m.id === id);
                                                return sum + (model?.credit || 0);
                                            }, 0)
                                        })}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    <PricingArena open={showPricing} onOpenChange={setShowPricing} />
                </div>

            </div>

            {results.length > 0 && (
                <div className="py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <ArenaResults results={results} />
                </div>
            )}
        </section>
    );
}
