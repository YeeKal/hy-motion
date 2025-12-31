"use client";

import ArenaResultCard, { ArenaResultItem } from "@/components/arena/arena-result-card";
import { ARENA_MODELS } from "@/lib/arena/models";
import { useTranslations } from "next-intl";

// Helper to find model ID by name (since examples use names)
const getModelIdByName = (name: string) => {
    const model = ARENA_MODELS.find(m => m.name === name);
    return model ? model.id : "z-image-turbo";
};

const EXAMPLES = [

    {
        prompt: "Cinematic photo, summer vibes. A beautiful Chinese young girl sitting on a wooden beach deck, leaning back comfortably. She has messy blonde hair, sunglasses perched on her head, and soft makeup. She wears a white t-shirt with red graphic text and red retro gym shorts. The fabric of the shirt is light and airy. Beside her is a soft drink cup and colorful beach balls. The background features a blurred sunny beach scene with a distinctive red and white lifeguard station and blue ocean. High contrast lighting, dappled shadows from an umbrella, 8k resolution, photorealistic textures, depth of field.",
        results: [
            { modelName: "Z-Image", time: 2.8, image: "https://cdn.z-image.app/arena/z-image-arena-z-image-turbo-1764752009926.webp" },
            { modelName: "Nano Banana Pro", time: 17.5, image: "https://cdn.z-image.app/arena/z-image-arena-nano-banana-pro-1764752026959.webp" },
            { modelName: "Flux.2 Pro", time: 10.9, image: "https://cdn.z-image.app/arena/z-image-arena-flux-2-pro-1764752011343.webp" },
            { modelName: "Seedream 4.0", time: 15.8, image: "https://cdn.z-image.app/arena/z-image-arena-seedream-4-0-1764752012708.webp" },
        ]
    },
    {
        prompt: "A magazine cover of a cheerful 20-year-old Chinese woman with messy long hair tied with a silk ribbon, laughing while sitting at a vintage wooden table in a seaside cafe. She wears a vintage floral sundress and retro sunglasses on her head. An iced coffee and a half-eaten croissant are on the table. Dappled sunlight filtering through leaves, warm golden hour glow, Kodak Gold 200 film aesthetic, slight halation, nostalgic mood, candid snapshot style. 8K resolution.\n\nMagazine layout:\nTitle \"SUNDAY\".\nCover text: \"Golden Hour\", \"Slow Living\", \"July Edition 2025\".\nBarcode bottom. Playful retro 70s typography in orange and cream.",
        results: [
            { modelName: "Z-Image", time: 2.5, image: "https://cdn.z-image.app/arena/z-image-arena-z-image-turbo-1764753196651.webp" },
            { modelName: "Nano Banana Pro", time: 24, image: "https://cdn.z-image.app/arena/z-image-arena-nano-banana-pro-1764753198070.webp" },
            { modelName: "Flux.2 Pro", time: 14.6, image: "https://cdn.z-image.app/arena/z-image-arena-flux-2-pro-1764753199301.webp" },
            { modelName: "Seedream 4.0", time: 15.7, image: "https://cdn.z-image.app/arena/z-image-arena-seedream-4-0-1764753200867.webp" },
        ]
    },
    {
        prompt: "An illustration of an anthropomorphic orange fox taking a nap on a large, soft green beanbag chair. The fox is wearing round glasses, a casual outfit with sneakers, and has a peaceful expression. Beside the chair on the floor sits a retro brown radio with a glowing dial. The art style is painterly with visible textures, resembling a modern storybook illustration. The lighting is warm and cozy, suggesting a lazy afternoon. Isolated on a plain white background. 1:1 aspect ratio",
        results: [
            { modelName: "Z-Image", time: 3.1, image: "https://cdn.z-image.app/arena/z-image-arena-z-image-turbo-1764752494197.webp" },
            { modelName: "Nano Banana Pro", time: 19.8, image: "https://cdn.z-image.app/arena/z-image-arena-nano-banana-pro-1764752487663.webp" },
            { modelName: "Flux.2 Pro", time: 12.3, image: "https://cdn.z-image.app/arena/z-image-arena-flux-2-pro-1764752488629.webp" },
            { modelName: "Seedream 4.0", time: 9.1, image: "https://cdn.z-image.app/arena/z-image-arena-seedream-4-0-1764752489796.webp" },
        ]
    },

    {
        prompt: "A futuristic city with flying cars and neon lights, cyberpunk style, highly detailed, 8k",
        results: [
            { modelName: "Z-Image", time: 4.3, image: "https://cdn.z-image.app/arena/z-image-arena-Z-Image-1764739956258.webp" },
            { modelName: "Nano Banana Pro", time: 15.2, image: "https://cdn.z-image.app/arena/z-image-arena-Nano Banana Pro-1764739957524.webp" },
            { modelName: "Flux.2 Pro", time: 35.3, image: "https://cdn.z-image.app/arena/z-image-arena-Flux.2 Pro-1764739958508.webp" },
            { modelName: "Seedream 4.0", time: 8.1, image: "https://cdn.z-image.app/arena/z-image-arena-Seedream 4.0-1764739961809.webp" },
        ]
    }
];

export function ArenaExamples() {
    const t = useTranslations('arena.examples');

    return (
        <section className="space-y-12">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    {t('description')}
                </p>
            </div>

            <div className="space-y-16">
                {EXAMPLES.map((example, idx) => (
                    <div key={idx} className="space-y-6">
                        <div className="bg-muted/30 p-4 rounded-lg border border-border">
                            <p className="font-medium text-foreground">
                                <span className="text-primary font-bold mr-2">{t('promptLabel')}</span>
                                {example.prompt}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {example.results.map((res, rIdx) => {
                                const resultItem: ArenaResultItem = {
                                    modelId: getModelIdByName(res.modelName),
                                    status: "completed",
                                    imageUrl: res.image,
                                    generationTime: res.time * 1000, // Convert to ms
                                    requestId: `example-${idx}-${rIdx}`
                                };

                                return (
                                    <ArenaResultCard key={rIdx} result={resultItem} />
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
