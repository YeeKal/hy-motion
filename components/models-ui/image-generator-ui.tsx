"use client";

import { useState, useEffect, } from "react";
import { useSession } from "next-auth/react";
import { Model, ParamRequirement } from "@/lib/image-generator/type";
import { ModelSelector } from "./model-selector";
import { ImageUpload } from "./image-upload";
import { PromptInput } from "./prompt-input";
import { GenerationDisplay } from "./generation-display";
import { HistoryDisplay, HistoryResultProps } from "./history-display";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { fal } from "@fal-ai/client";
import { useCredits } from "@/hooks/useCredits";
import { ArenaResultItem } from "./arena-result-card";
import { useTranslations } from "next-intl";
import { DEFAULT_ASPECTRATIO } from "@/lib/image-generate/constants"
import { PLAYGROUND_SECTION_ID, DEFAULT_PROMPT } from "@/lib/constants"
import { PricingArena } from "./pricing-arena";
import { Suspense } from "react"
import { UrlParamsHandler } from "./url-params-handler"

// Configure FAL client
fal.config({
    proxyUrl: "/api/fal/proxy",
});

interface ImageGeneratorUIProps {
    models: Model[];
    defaultModelId?: string;
}

const POLL_CYCLE_TIME = 1000;
const POLL_TIMEOUT = 120000;

const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            resolve({ width: img.width, height: img.height });
            URL.revokeObjectURL(img.src); // Clean up memory
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });
};

const exampleR:ArenaResultItem[]=[{
     modelId: "z-image-turbo",
    status: "completed",
    imageUrl: "https://cdn.z-image.app/z-image-gallery/anthropomorphic-polar-bear-playing-guitar.webp"
},
 {
        imageUrl: "https://cdn.z-image.app/z-image-gallery/chinese-girl-summer-beach-deck.webp",
        modelId: "z-image-turbo",
    status: "completed",
    },
]

export function ImageGeneratorUI({ models, defaultModelId }: ImageGeneratorUIProps) {
    const t = useTranslations("common.modelPlayground");
      const { status } = useSession();
    

    // State
    const [selectedModelId, setSelectedModelId] = useState<string>(
        defaultModelId || "z-image-turbo"
    );
    const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
    const [uploadedImages, setUploadedImages] = useState<File[]>([]);
    const [aspectRatio, setAspectRatio] = useState(DEFAULT_ASPECTRATIO);
    const [imageCount, setImageCount] = useState(1);

    // Changed to store rich result items instead of just strings
    const [generatedResults, setGeneratedResults] = useState<ArenaResultItem[]>([]);

    const [isGenerating, setIsGenerating] = useState(false);
    const [history, setHistory] = useState<HistoryResultProps[]>([]);

    const { credits, refreshCredits } = useCredits();
    const [showPricing, setShowPricing] = useState(false);


    // Derived State
    const selectedModel = models.find((m) => m.id === selectedModelId);

    // Effects
    useEffect(() => {
        if (selectedModel) {
            // Reset images if model doesn't support them
            if (selectedModel.inputs.image === ParamRequirement.Disabled) {
                setUploadedImages([]);
            }
            // Enforce max images
            if (
                selectedModel.inputs.imageMaxNum > 0 &&
                uploadedImages.length > selectedModel.inputs.imageMaxNum
            ) {
                setUploadedImages((prev) => prev.slice(0, selectedModel.inputs.imageMaxNum));
                toast.warning(t("toasts.imagesTruncated", { count: selectedModel.inputs.imageMaxNum }));
            }
        }
    }, [selectedModelId, selectedModel, t]);

    // Polling Logic
    const pollResult = async (requestId: string, apiId: string) => {
        const startTime = Date.now();

        const checkStatus = async () => {
            if (Date.now() - startTime > POLL_TIMEOUT) {
                setGeneratedResults(prev => prev.map(p => ({
                    ...p,
                    status: "failed",
                    error: t("errors.timeout")
                })))
                setIsGenerating(false);
                return;
            }

            try {
                const status = await fal.queue.status(apiId, {
                    requestId,
                    logs: false
                });

                if (status.status === "COMPLETED") {
                    const result = await fal.queue.result(apiId, {
                        requestId
                    });

                    const imageUrls: string[] = (result.data.images?.map((i: { url: string }) => i.url)) ?? [];

                    if (imageUrls.length > 0) {
                        const finalResults: ArenaResultItem[] = imageUrls.map((url) => ({
                            modelId: selectedModelId,
                            requestId,
                            imageUrl: url,
                            generationTime: Date.now() - startTime,
                            status: "completed",
                        }));

                        setGeneratedResults(finalResults)
                        setHistory(prev => [{
                            id: requestId,
                            prompt: prompt,
                            timestamp: new Date(),
                            images: finalResults
                        }, ...prev])

                        toast.success(t("toasts.generationCompleted"));
                    } else {
                        setGeneratedResults(prev => prev.map(p => ({
                            ...p,
                            status: "failed",
                            error: t("toasts.noImagesReturned")
                        })))
                    }
                    setIsGenerating(false);

                } else if (status.status === "IN_QUEUE" || status.status === "IN_PROGRESS") {
                    setGeneratedResults(prev => prev.map((item, i) =>
                        ({ ...item, status: "generating" })
                    ));
                    setTimeout(checkStatus, POLL_CYCLE_TIME);
                } else {
                    setGeneratedResults(prev => prev.map((item, i) =>
                        ({ ...item, status: "failed", error: t("errors.failed") })
                    ));
                    setIsGenerating(false);
                }
            } catch (error) {
                console.error("Polling error", error);
                setGeneratedResults(prev => prev.map((item, i) =>
                    ({ ...item, status: "failed", error: t("errors.pollingError") })
                ));
                setIsGenerating(false);
            }
        };

        checkStatus();
    };

    // Handlers
    const handleGenerate = async () => {
        if (!selectedModel) {
            toast.error(t("toasts.modelInvalid"));
            return;
        }

        // Validation
        if (
            selectedModel.inputs.text === ParamRequirement.Required &&
            !prompt.trim()
        ) {
            toast.error(t("toasts.enterPrompt"));
            return;
        }

        if (
            selectedModel.inputs.image === ParamRequirement.Required &&
            uploadedImages.length === 0
        ) {
            toast.error(t("toasts.uploadReferenceImage"));
            return;
        }

        if (status === "loading") {
            toast.error(t("toasts.sessionStatusLoading"));
            return;
        }
        if (status === "unauthenticated") {
            setShowPricing(true)
            return;
        }

        if ((credits || 0) < selectedModel.credits) {
            setShowPricing(true);
            return;
        }

        setIsGenerating(true);

        // Initialize results with 'queued' status
        const initialResults: ArenaResultItem[] = Array.from({ length: imageCount }).map(() => ({
            modelId: selectedModelId,
            status: "queued"
        }));
        setGeneratedResults(initialResults);

        try {

            // Upload images to FAL storage if needed
            let imageUrls: string[] = [];
            if (uploadedImages.length > 0) {
                setGeneratedResults(prev => prev.map(p => ({
                    ...p,
                    status: "uploading"
                })))
                try {
                    const uploadPromises = uploadedImages.map((file) => fal.storage.upload(file));
                    const uploadedUrls = await Promise.all(uploadPromises);
                    imageUrls = uploadedUrls;
                } catch (uploadError) {
                    console.error("Upload failed", uploadError);
                    toast.error(t("toasts.uploadFailed"));
                    setIsGenerating(false);
                    setGeneratedResults(prev => prev.map(p => ({
                    ...p,
                    status: "failed",
                    error: t("toasts.uploadFailed")
                })))
                    return;
                }
            }

            let imgWidth = null;
            let imgHeight = null;

            if (uploadedImages.length > 0) {
                try {
                    // 2. 获取尺寸
                    const dimensions = await getImageDimensions(uploadedImages[0]);

                    // 3. 将值赋给外部变量
                    imgWidth = dimensions.width;
                    imgHeight = dimensions.height;

                    console.log(`First image dimensions: ${imgWidth}x${imgHeight}`);
                } catch (error) {
                    console.error("Error getting image dimensions", error);
                }
            }

            const response = await fetch("/api/async-image-generator", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt,
                    images: imageUrls,
                    aspectRatio,
                    imageCount,
                    modelId: selectedModelId,
                    ...(imgWidth && { originalWidth: imgWidth }),
                    ...(imgHeight && { originalHeight: imgHeight }),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || t("toasts.generationFailed"));
            }

            const data = await response.json();

            refreshCredits();

            if (data.requestId && data.apiId) {
                pollResult(data.requestId, data.apiId);
            } else {
                toast.error(t("toasts.invalidApiResponse"));
                setIsGenerating(false);
                setGeneratedResults(prev => prev.map(p => ({
                    ...p,
                    status: "failed",
                    error: t("toasts.invalidApiResponse")
                })))

            }

        } catch (error: any) {
            console.error(error);
            toast.error(error.message || t("toasts.failedToGenerate"));
            setIsGenerating(false);
            setGeneratedResults(prev => prev.map(p => ({
                ...p,
                status: "failed",
                error: error.message
            })))
        }

    };

    const handleReset = () => {
        setPrompt("");
        setUploadedImages([]);
        setAspectRatio("1:1");
        setImageCount(1);
        setGeneratedResults([]);
    };

    if (!selectedModel) return <div>No models available</div>;

    const showImageUpload = selectedModel.inputs.image !== ParamRequirement.Disabled;
    const showPrompt = selectedModel.inputs.text !== ParamRequirement.Disabled;

    return (
        <div id={PLAYGROUND_SECTION_ID} className="flex flex-col gap-8 sm:gap-12 p-4 md:p-6 max-w-7xl mx-auto scroll-mt-20">
            <Suspense fallback={null}>
                <UrlParamsHandler
                    onPromptChange={setPrompt}
                    onRatioChange={setAspectRatio}
                    onModelChange={setSelectedModelId}
                />
            </Suspense>

            <ModelSelector
                models={models}
                selectedModelId={selectedModelId}
                onSelect={setSelectedModelId}
                disabled={isGenerating}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Panel - Controls */}
                <div className="w-full flex flex-col gap-6 shrink-0">
                    <div className="space-y-6 p-3 sm:p-6 rounded-2xl bg-card border shadow-sm">


                        {showImageUpload && (
                            <ImageUpload
                                images={uploadedImages}
                                onImagesChange={setUploadedImages}
                                maxImages={selectedModel.inputs.imageMaxNum || 1}
                                disabled={isGenerating}
                                required={selectedModel.inputs.image === ParamRequirement.Required}
                            />
                        )}

                        {showPrompt && (
                            <PromptInput
                                value={prompt}
                                onChange={setPrompt}
                                disabled={isGenerating}
                                aspectRatio={aspectRatio}
                                onAspectRatioChange={setAspectRatio}
                                imageCount={imageCount}
                                onImageCountChange={setImageCount}
                                isPro={(credits || 0) > 0}
                                onShowPricing={setShowPricing}
                                required={selectedModel.inputs.text === ParamRequirement.Required}
                            />
                        )}

                        <div className="flex gap-3">
                            <Button
                                className="flex-1 h-10 sm:h-12 text-md sm:text-lg font-medium shadow-lg shadow-primary/20 transition-all hover:shadow-primary/40 hover:-translate-y-0.5"
                                onClick={handleGenerate}
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        {t("controls.generatingButton")}
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="mr-2 h-5 w-5" />
                                        {t("controls.generateButton")}
                                        <span className="ml-2 text-xs font-normal opacity-80 bg-primary-foreground/20 px-2 py-0.5 rounded-full">
                                            {selectedModel.credits * imageCount} {t("controls.credits")}
                                        </span>
                                    </>
                                )}
                            </Button>

                            <Button
                                variant="outline"
                                size="icon"
                                className="h-10 sm:h-12  w-10 sm:w-12 shrink-0"
                                onClick={handleReset}
                                disabled={isGenerating}
                                title={t("controls.resetButtonTitle")}
                            >
                                <RefreshCcw className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Display */}
                <div className="flex-1 flex items-center overflow-hidden rounded-2xl bg-muted/30 border-2 border-dashed border-muted">
                    <GenerationDisplay
                        results={generatedResults}
                        loading={isGenerating}
                        imageCount={imageCount}
                        onPromptChange={setPrompt}
                        onAspectRatioChange={setAspectRatio}
                    />
                </div>

                <PricingArena open={showPricing} onOpenChange={setShowPricing} />
            </div>

            {/* History Section */}
            <HistoryDisplay resultsHistory={history} />
        </div>
    );
}
