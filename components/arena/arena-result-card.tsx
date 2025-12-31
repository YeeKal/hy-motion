"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader, Download, Maximize2, X, Check, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ARENA_MODELS } from "@/lib/arena/models";
import { useTranslations } from "next-intl";
export interface ArenaResultItem {
    modelId: string;
    status: "idle" | "queued" | "generating" | "completed" | "failed";
    imageUrl?: string;
    generationTime?: number; // ms
    requestId?: string;
    error?: string;
}


export default function ArenaResultCard({ result }: { result: ArenaResultItem }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [hasDownloaded, setHasDownloaded] = useState(false);
    const t = useTranslations('arena.resultCard');

    const model = ARENA_MODELS.find((m) => m.id === result.modelId);
    const modelName = model ? model.name : result.modelId;

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!result.imageUrl) return;

        setIsDownloading(true);
        try {
            const response = await fetch(result.imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `z-image-arena-${result.modelId}-${Date.now()}.png`;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            setHasDownloaded(true);
            setTimeout(() => setHasDownloaded(false), 2000);
        } catch (error) {
            console.error("Download failed:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    if (result.status === "failed") {
        return (
            <div className="aspect-square bg-destructive/10 rounded-xl border border-destructive/20 flex flex-col items-center justify-center p-4 text-center">
                <p className="font-semibold text-destructive mb-1">{modelName}</p>
                <p className="text-xs text-destructive/80">{result.error || t('failed')}</p>
            </div>
        );
    }

    if (result.status !== "completed" || !result.imageUrl) {
        return (
            <div className="aspect-square bg-muted/50 rounded-xl border border-border flex flex-col items-center justify-center animate-pulse relative overflow-hidden">
                <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium z-10">
                    {modelName}
                </div>
                <div className="flex flex-col items-center gap-3">
                    <Loader className="animate-spin text-primary" size={28} />
                    <p className="text-sm font-medium text-muted-foreground capitalize">
                        {result.status}...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div
                className="group relative aspect-square bg-muted rounded-xl border border-border overflow-hidden cursor-zoom-in shadow-sm hover:shadow-md transition-all duration-300"
                onClick={() => setIsModalOpen(true)}
            >
                <Image
                    src={result.imageUrl}
                    alt={t('generatedBy', { modelName })}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />

                {/* Info Overlay */}
                <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent opacity-100 transition-opacity">
                    <span className="text-xs font-semibold text-white bg-black/40 backdrop-blur-md px-2 py-1 rounded">
                        {modelName}
                    </span>
                    {result.generationTime && (
                        <span className="text-[10px] font-medium text-white/90 flex items-center gap-1 bg-black/40 backdrop-blur-md px-1.5 py-0.5 rounded">
                            <Clock size={10} />
                            {(result.generationTime / 1000).toFixed(1)}s
                        </span>
                    )}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                {/* Actions */}
                <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="bg-black/50 backdrop-blur-sm p-2 rounded-full text-white hover:bg-black/70 transition-colors">
                        <Maximize2 size={16} />
                    </div>
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className={cn(
                            "flex items-center justify-center h-8 w-8 rounded-full shadow-lg transition-all active:scale-95",
                            hasDownloaded
                                ? "bg-green-500 text-white"
                                : "bg-white text-black hover:bg-gray-100"
                        )}
                        title={t('download')}
                    >
                        {isDownloading ? (
                            <Loader size={14} className="animate-spin" />
                        ) : hasDownloaded ? (
                            <Check size={14} />
                        ) : (
                            <Download size={14} />
                        )}
                    </button>
                </div>
            </div>

            {/* Lightbox Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setIsModalOpen(false)}
                >
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50"
                    >
                        <X size={24} />
                    </button>

                    <div
                        className="relative w-full max-w-5xl h-[80vh] mx-4 animate-in zoom-in-95 duration-200 flex flex-col items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full text-white font-medium z-50">
                            {modelName}
                        </div>
                        <Image
                            src={result.imageUrl}
                            alt={t('generatedBy', { modelName })}
                            fill
                            className="object-contain"
                            quality={100}
                        />
                    </div>

                    <div
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-medium shadow-xl transition-transform hover:scale-105 active:scale-95"
                        >
                            {isDownloading ? <Loader size={20} className="animate-spin" /> : <Download size={20} />}
                            {t('downloadHighRes')}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
