import { Model, ModelType, ParamRequirement } from "@/lib/image-generator/type"



export const ImageModels: Model[] = [
    {
        id: "z-image-turbo",
        apiId: "fal-ai/z-image/turbo",
        type: ModelType.TextToImage,
        name: "Z-Image",

        description: "World's Fatest Image Generator AI",
        providerId: "fal",
        price: 0.005,
        credits: 1,
        isAvailable: true,
        supportImageArray: false,
        inputs: {
            text: ParamRequirement.Required,
            image: ParamRequirement.Disabled,
            imageMaxNum: 0 // the max image numbers supported
        },
    },

    {
        id: "gpt-image-1-5",
        apiId: "fal-ai/gpt-image-1.5",
        type: ModelType.TIToImage,
        name: "GPT Image 1.5",
        description: "Precise edits that preserve what matter",
        providerId: "fal",
        price: 0.013, // 0.009-0.013 low version
        credits: 3,
        isAvailable: true,
        supportImageArray: true,
        inputs: {
            text: ParamRequirement.Required,
            image: ParamRequirement.Optional,
            imageMaxNum: 4
        },
        composer: [{
            type: ModelType.TIIToImage,
            apiId: "fal-ai/gpt-image-1.5/edit",
            providerId: "fal",
            credits: 3,
            price: 0.013
        }, {
            type: ModelType.TextToImage,
            apiId: "fal-ai/gpt-image-1.5",
            providerId: "fal",
            credits: 3,
            price: 0.013
        }
        ]
    },
    {
        id: "qwen-image-edit-2511",
        name: "Qwen Image Edit 2511",
        apiId: "fal-ai/qwen-image-edit-2511",
        type: ModelType.ImageToImage,
        description: "decomposing an image into multiple RGBA layers",
        providerId: "fal",
        price: 0.03,
        credits: 6,
        isAvailable: true,
        supportImageArray: true,
        inputs: {
            text: ParamRequirement.Required,
            image: ParamRequirement.Required,
            imageMaxNum: 4
        }
    },
    {
        id: "qwen-image-layered",
        name: "Qwen Image Layered",
        apiId: "fal-ai/qwen-image-layered",
        type: ModelType.ImageToImage,
        description: "decomposing an image into multiple RGBA layers",
        providerId: "fal",
        price: 0.05,
        credits: 10,
        isAvailable: true,
        supportImageArray: false,
        inputs: {
            text: ParamRequirement.Disabled,
            image: ParamRequirement.Required,
            imageMaxNum: 1
        }
    },
    {
        id: "nano-banana-pro",
        name: "Nano Banana Pro",
        apiId: "fal-ai/nano-banana-pro",
        type: ModelType.TIToImage,
        description: "Nano Banana Pro",
        providerId: "fal",
        price: 0.04,
        credits: 30,
        isAvailable: true,
        supportImageArray: true,
        inputs: {
            text: ParamRequirement.Required,
            image: ParamRequirement.Optional,
            imageMaxNum: 10
        },
        composer: [{
            type: ModelType.TIIToImage,
            apiId: "fal-ai/nano-banana-pro/edit",
            providerId: "fal",
            credits: 30,
            price: 0.15
        }, {
            type: ModelType.TextToImage,
            apiId: "fal-ai/nano-banana-pro",
            providerId: "fal",
            credits: 30,
            price: 0.15
        }
        ]
    },

    {
        id: "flux-2-pro",
        name: "Flux.2 Pro",
        apiId: "fal-ai/flux-2-pro",
        type: ModelType.TIToImage,
        description: "Flux.2 Pro",
        providerId: "fal",
        price: 0.03,
        credits: 6,
        isAvailable: true,
        supportImageArray: true,
        inputs: {
            text: ParamRequirement.Required,
            image: ParamRequirement.Optional,
            imageMaxNum: 1 // TODO, MAX 3, PRICE IS COMPLEX
        },
        composer: [
            {
                type: ModelType.TIIToImage,
                apiId: "fal-ai/flux-2-pro/edit",
                providerId: "fal",
                credits: 12,
                price: 0.06 // 0.03 + 0.03
            }, {
                type: ModelType.TextToImage,
                apiId: "fal-ai/flux-2-flex",
                providerId: "fal",
                price: 0.03,
                credits: 6,
            }
        ]
    },
    {
        // fal-ai/bytedance/seedream/v4.5/edit
        id: "seedream-4-5",
        apiId: "fal-ai/bytedance/seedream/v4.5",
        type: ModelType.TIToImage,
        name: "Seedream 4.5",
        description: "Seedream 4.5",
        providerId: "fal",
        price: 0.04,
        credits: 8,
        isAvailable: true,
        supportImageArray: true,
        inputs: {
            text: ParamRequirement.Required,
            image: ParamRequirement.Optional,
            imageMaxNum: 10
        },
        composer: [
            {
                type: ModelType.TIIToImage,
                apiId: "fal-ai/bytedance/seedream/v4.5/edit",
                providerId: "fal",
                credits: 8,
                price: 0.04
            }, {
                type: ModelType.TextToImage,
                apiId: "fal-ai/bytedance/seedream/v4.5/text-to-image",
                providerId: "fal",
                credits: 8,
                price: 0.04
            }

        ]
    },
    {
        id: "flux-2-dev",
        name: "Flux.2 Dev",
        apiId: "fal-ai/flux-2",
        type: ModelType.TIToImage,
        description: "Flux.2 Dev",
        providerId: "fal",
        price: 0.012,
        credits: 3,
        isAvailable: true,
        supportImageArray: true,
        inputs: {
            text: ParamRequirement.Required,
            image: ParamRequirement.Optional,
            imageMaxNum: 1 // TODO, MAX 3, PRICE IS COMPLEX
        },
        composer: [{
            type: ModelType.TIIToImage,
            apiId: "fal-ai/flux-2/edit",
            providerId: "fal",
            credits: 5,
            price: 0.024 // 0.012 + 0.012
        }, {
            type: ModelType.TextToImage,
            apiId: "fal-ai/flux-2",
            providerId: "fal",
            price: 0.012,
            credits: 3,
        }

        ]
    },
    {
        id: "flux-2-flex",
        name: "Flux.2 Flex",
        apiId: "fal-ai/flux-2-flex",
        type: ModelType.TIToImage,
        description: "Flux.2 Flex",
        providerId: "fal",
        price: 0.06,
        credits: 12,
        isAvailable: true,
        supportImageArray: true,
        inputs: {
            text: ParamRequirement.Required,
            image: ParamRequirement.Optional,
            imageMaxNum: 1 // TODO, MAX 3, PRICE IS COMPLEX
        },
        composer: [{
            type: ModelType.TIIToImage,
            apiId: "fal-ai/flux-2-flex/edit",
            providerId: "fal",
            credits: 24,
            price: 0.12 // 0.06 + 0.06
        }, {
            type: ModelType.TextToImage,
            apiId: "fal-ai/flux-2-flex",
            providerId: "fal",
            price: 0.06,
            credits: 12,
        }

        ]
    },
    {
        id: "fast-sdxl",
        apiId: "fal-ai/fast-sdxl",
        type: ModelType.TextToImage,
        name: "FAST SDXL",
        description: "Run SDXL at the speed of light",
        providerId: "fal",
        price: 0.00111,
        credits: 1,
        isAvailable: true,
        supportImageArray: false,
        inputs: {
            text: ParamRequirement.Required,
            image: ParamRequirement.Disabled,
            imageMaxNum: 0 // the max image numbers supported
        },
    },

    //   {
    //     id: "fast-sdxl",
    //     name: "Lightning SDXL", // enable_safety_checker: false
    //     apiId: "fal-ai/fast-lightning-sdxl",
    //     credit: 1,
    //   }
];
