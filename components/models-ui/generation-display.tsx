"use client";

import * as React from "react";
import { Maximize2, ChevronLeft, ChevronRight, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import ArenaResultCard, { ArenaResultItem } from "@/components/models-ui/arena-result-card";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";

interface GenerationDisplayProps {
    results: ArenaResultItem[];
    loading: boolean;
    imageCount: number;
    onPromptChange?: (prompt: string) => void;
    onAspectRatioChange?: (ratio: string) => void;
}

interface ExampleImage {
    src: string;
    alt: string;
    prompt: string;
    aspectRatio: string;
}

const EXAMPLE_IMAGES: ExampleImage[] = [
    {
        src: "https://cdn.z-image.app/z-image-gallery/chinese-girl-summer-beach-deck.webp",
        alt: "chinese-girl-summer-beach-deck",
        prompt: "Cinematic photo, summer vibes. A beautiful Chinese young girl sitting on a wooden beach deck, leaning back comfortably. She has messy blonde hair, sunglasses perched on her head, and soft makeup. She wears a white t-shirt with red graphic text and red retro gym shorts. The fabric of the shirt is light and airy. Beside her is a soft drink cup and colorful beach balls. The background features a blurred sunny beach scene with a distinctive red and white lifeguard station and blue ocean. High contrast lighting, dappled shadows from an umbrella, 8k resolution, photorealistic textures, depth of field.",
        aspectRatio: "3:4"
    },
    {
        src: "https://cdn.z-image.app/z-image-gallery/anthropomorphic-polar-bear-playing-guitar.webp",
        alt: "anthropomorphic-polar-bear-playing-guitar",
        prompt: "An illustration of a gentle anthropomorphic polar bear sitting on a wooden stool, strumming an acoustic guitar. The bear is wearing a flannel shirt and a beanie, with eyes closed in enjoyment. Next to the stool is a potted monstera plant. The style features visible brushstrokes and a soft, pastel color palette with warm lighting highlighting the fur texture. Digital painting style, isolated on a white background.",
        aspectRatio: "1:1"
    },
    {
        src: "https://cdn.z-image.app/z-image-gallery/magazine-cover-chinese-woman-teal-tram-shanghai.webp",
        alt: "magazine-cover-chinese-woman-teal-tram-shanghai",
        prompt: "A magazine cover of a stylish 20-year-old Chinese woman with bob-cut hair, casually leaning against a teal tram in a quiet early-morning street market. She wears a cream knit sweater and pleated trousers. A paper bag filled with fresh chrysanthemums rests at her feet. Soft diffused dawn light, delicate pastel palette, Fuji Pro 160NS style, grainy but silky texture, shallow depth of field, slightly underexposed shadows, fashion editorial angle. 8K resolution.\n\nMagazine layout:\nTitle “MORNING LINES”.\nCover text: “City Calm”, “Shanghai Flow”, “Vol. 18 | October 2025”.\nBarcode bottom.",
        aspectRatio: "1:1"
    },
    {
        src: "https://cdn.z-image.app/z-image-gallery/fisheye-girl-jumping-shibuya-with-cartoon-monster.webp",
        alt: "fisheye-girl-jumping-shibuya-with-cartoon-monster",
        prompt: "A photo taken with an extreme fisheye lens. A young woman with blonde twin tails wearing a gray cardigan and plaid skirt school uniform is excitedly jumping at the Shibuya Scramble Crossing, with one hand dramatically reaching toward the foreground of the lens, her fingernails clearly visible. In the background, the distorted Shibuya 109 building and other structures stand tall, the streets crowded with pedestrians and vehicles. A huge pink and blue gradient cartoon monster floats above the city, with massive tentacles and horns surrounding the distorted cityscape. Sunny weather with strong light and shadow contrasts. Circular frame.",
        aspectRatio: "1:1"
    },
];

export function GenerationDisplay({
    results = [],
    loading,
    imageCount,
    onPromptChange,
    onAspectRatioChange,
}: GenerationDisplayProps) {
    const t = useTranslations("common.modelPlayground");
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [currentExampleIndex, setCurrentExampleIndex] = React.useState(0);
    const [isHoveringExample, setIsHoveringExample] = React.useState(false);
    const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

    // Reset selection when results change
    React.useEffect(() => {
        if (results && results.length > 0) {
            setSelectedIndex(0);
        }
    }, [results]);

    // Auto-scroll for examples
    React.useEffect(() => {
        if (results.length > 0 || isHoveringExample) return;

        const interval = setInterval(() => {
            setCurrentExampleIndex((prev) => (prev + 1) % EXAMPLE_IMAGES.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [results.length, isHoveringExample]);

    const handlePreviousExample = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentExampleIndex((prev) => (prev - 1 + EXAMPLE_IMAGES.length) % EXAMPLE_IMAGES.length);
    };

    const handleNextExample = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentExampleIndex((prev) => (prev + 1) % EXAMPLE_IMAGES.length);
    };

    const handleUseExample = (example: ExampleImage, index: number) => {
        if (onPromptChange) onPromptChange(example.prompt);
        if (onAspectRatioChange) onAspectRatioChange(example.aspectRatio);

        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    if ((!results || results.length === 0) && !loading) {
        const currentExample = EXAMPLE_IMAGES[currentExampleIndex];

        return (
            <div
                className="relative flex flex-col items-center justify-center h-full w-full  bg-muted/10 border border-border group"
                onMouseEnter={() => setIsHoveringExample(true)}
                onMouseLeave={() => setIsHoveringExample(false)}
            >
                {/* Background Image with Blur */}
                <div className="absolute inset-0 z-0">
                    <img
                        src={currentExample.src}
                        alt={currentExample.alt}
                        className="w-full h-full object-cover opacity-20 blur-2xl scale-110 transition-all duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/90 to-background/50" />
                </div>

                {/* Main Content */}
                <div className="relative z-10 flex flex-col items-center justify-center w-full h-[400px] md:h-[500px] p-3 md:p-6 animate-in fade-in zoom-in duration-500 key={currentExampleIndex}">
                    <div className="relative flex items-center justify-center w-full h-full group/image cursor-pointer"
                        onClick={() => handleUseExample(currentExample, currentExampleIndex)}>
                        <img
                            src={currentExample.src}
                            alt={currentExample.alt}
                            className="w-auto h-auto max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-transform duration-700 group-hover/image:scale-[1.02]"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity">
                            <Button variant="secondary" className="gap-2 shadow-lg">
                                {copiedIndex === currentExampleIndex ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                {t("display.useThisPrompt")}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Navigation Arrows */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-background/50 hover:bg-background/80 text-foreground backdrop-blur-sm transition-all shadow-sm"
                    onClick={handlePreviousExample}
                >
                    <ChevronLeft className="h-8 w-8" />
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-background/50 hover:bg-background/80 text-foreground backdrop-blur-sm transition-all shadow-sm"
                    onClick={handleNextExample}
                >
                    <ChevronRight className="h-8 w-8" />
                </Button>

                {/* Indicators */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-2 p-2 rounded-full bg-background/30 backdrop-blur-md">
                    {EXAMPLE_IMAGES.map((_, index) => (
                        <button
                            key={index}
                            className={cn(
                                "w-2 h-2 rounded-full transition-all shadow-sm",
                                index === currentExampleIndex
                                    ? "bg-primary w-6"
                                    : "bg-primary/40 hover:bg-primary/60"
                            )}
                            onClick={() => setCurrentExampleIndex(index)}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full flex flex-col gap-3 md:gap-6">
            {/* Main Display Area */}
            <div className="flex-1 min-h-[400px] w-full relative">
                {results[selectedIndex] ? (
                    <div className="w-full h-full">
                        <ArenaResultCard result={results[selectedIndex]} />
                    </div>
                ) : (
                    <Skeleton className="w-full h-full rounded-xl" />
                )}
            </div>

            {/* Thumbnails List */}
            {(results.length > 1) && (
                <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
                    {results.map((result, index) => (
                        <div
                            key={index}
                            className={cn(
                                "relative w-24 h-24 rounded-lg overflow-hidden cursor-pointer border-2 transition-all flex-shrink-0 snap-start",
                                selectedIndex === index
                                    ? "border-primary ring-2 ring-primary/20"
                                    : "border-transparent hover:border-primary/50 opacity-70 hover:opacity-100"
                            )}
                            onClick={() => setSelectedIndex(index)}
                        >
                            {result.imageUrl ? (
                                <img
                                    src={result.imageUrl}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                    <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
