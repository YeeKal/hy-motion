import {Model,Tool,ToolType,ModelType, ParamRequirement } from "@/lib/types"
import {isDev} from "@/lib/utils"
export const imgLoras={
    id:"labubu-doll-lora",
    name:"Labubu Doll Lora",
    providerId:"togetherFluxDevLora",
    type: ModelType.LabubuLora,
    description:"A lora for generating Labubu Doll",
    price:0.01,
    duration:60,
    credits:1,
    isFree:false,
    isAvailable:true,
}

export const imgModels:Model[]=[
    {
        id:"black-forest-labs/FLUX.1-schnell-Free",
        apiId:"black-forest-labs/FLUX.1-schnell-Free",
        type: ModelType.TextToImage,
        name:"FLUX.1 Schnell",
        description:"A free model for testing",
        providerId:"togetherai",
        price:0,
        duration:60,
        credits:1,
        isFree:true,
        isAvailable:true,
        withImg:false
    },
    {
        id:"flux-1-kontext-pro",
        apiId:"black-forest-labs/FLUX.1-kontext-pro",
        type: ModelType.TIToImage,
        name:"FLUX.1 Kontext Pro",
        description:"A pro model for editing image",
        providerId:"togetherai",
        price:0.04,
        duration:60,
        credits:10,
        isFree:false,
        isAvailable:true,
        withImg:false
    },
        {
        id:"flux-1-kontext-max",
        apiId:"black-forest-labs/FLUX.1-kontext-max",
        type: ModelType.TIToImage,
        name:"FLUX.1 Kontext max",
        description:"A pro model for editing image",
        providerId:"togetherai",
        price:0.08,
        duration:60,
        credits:20,
        isFree:false,
        isAvailable:true,
        withImg:false
    },
    {
        id:"labubu-doll-lora",
        apiId:"black-forest-labs/FLUX.1-dev-lora",
        type: ModelType.LabubuLora,
        name:"Labubu Doll Model",
        description:"A lora for generating Labubu Doll",
        providerId:"togetherFluxDevLora",
        price:0.035,
        duration:60,
        credits:10,
        isFree:false,
        isAvailable:true,
        withImg:false,
        lora:{
            id:"labubu-doll-lora",
            loraPath:"https://huggingface.co/spaces/yeekal/lbb_lora/resolve/main/flux_lbb_style_v1_2ksteps.safetensors?download=true",
            loraScale:0.8,
            triggerWords:"Labubu style",
            steps:30,
            // size:"768x1024",
            size: isDev() ? "512x512": "768x1024", // Set the desired image size
            n:1
        }
    },
     {
        id:"flux-1-kontext-dev",
        apiId:"black-forest-labs/FLUX.1-kontext-dev",
        type: ModelType.TIToImage,
        name:"FLUX.1 Kontext Dev",
        description:"A dev model for editing image",
        providerId:"falai",
        price:0.025,
        duration:60,
        credits:5,
        isFree:false,
        isAvailable:true,
        withImg:false,
        composer:[
            {
                type: ModelType.TIIToImage,
                apiId:"fal-ai/flux-kontext/dev",
                providerId:"falai",
                credits:5,
                price:0.025
            },
            {
                type: ModelType.TextToImage,
                apiId:"fal-ai/flux-kontext-lora/text-to-image",
                providerId:"falai",
                credits:8,
                price:0.035
            }
        ]
    },
    {
        id:"remove-bg-birefnet-v2",
        apiId:"fal-ai/birefnet/v2",
        type: ModelType.BackgroundRemover,
        name:"Background Remover",
        description:"Remove background from images",
        providerId:"falai",
        price:0.00111,
        duration:60,
        credits:1,
        isFree:false,
        isAvailable:true,
        withImg:false,
    },

    {
        id:"minimax-hailuo-02-standard-image-to-video",
        apiId:"fal-ai/minimax/hailuo-02/standard/image-to-video",
        // apiId:"fal-ai/ltx-video/image-to-video",
        type: ModelType.ImageToVideo,
        name:"Hailuo 02 Standard",
        description:"A model for generating video from image",
        providerId:"falai",
        price:0.27,
        duration:60,
        credits:80,
        isFree:false,
        isAvailable:true,
        withImg:true
    },
    {
        id:"flux-1-krea-dev",
        apiId:"black-forest-labs/FLUX.1-krea-dev",
        type: ModelType.TextToImage,
        name:"FLUX.1 Krea Dev",
        description:"The Opinionated Text-to-Image Model",
        providerId:"togetherai",
        price:0.025,
        duration:60,
        credits:6,
        isFree:false,
        isAvailable:true,
        withImg:false
    },
    {
        id:"qwen-image",
        apiId:"qwen-image/text-to-image", //"fal-ai/qwen-image", // qwen-image/text-to-image
        type: ModelType.TIToImage,
        name:"Qwen-Image",
        description:"Complex text rendering and precise image editing",
        providerId:"wavespeedai",
        price:0.02,
        duration:60,
        credits:5,
        isFree:false,
        isAvailable:true,
        withImg:false,
        composer:[
                {
                type: ModelType.TIIToImage,
                apiId:"qwen-image/edit",
                providerId:"wavespeedai",
                credits:5,
                price:0.02
            },
            {
                type: ModelType.TextToImage,
                apiId:"qwen-image/text-to-image",
                providerId:"wavespeedai",
                credits:5,
                price:0.02
            }
        ]
    },
    {
        id:"qwen-image-edit",
        apiId:"qwen-image/edit", //"fal-ai/qwen-image", // qwen-image/text-to-image
        type: ModelType.TIIToImage,
        name:"Qwen-Image-Edit",
        description:"Precise text image editing",
        providerId:"wavespeedai",
        price:0.02,
        duration:60,
        credits:5,
        isFree:false,
        isAvailable:true,
        withImg:false
    },
    {
        id:"gemini-25-flash-image",
        apiId:"fal-ai/gemini-25-flash-image/edit", //"fal-ai/qwen-image", // qwen-image/text-to-image
        type: ModelType.TIToImage,
        name:"Nnao Banana",
        description:"Generate and edit images with the speed and intelligence of Gemini 2.5 Flash",
        providerId:"falaiGeminiClient",
        price:0.039,
        duration:60,
        credits:10,
        isFree:false,
        isAvailable:true,
        withImg:false,
        composer:[
            
        {
                type: ModelType.TIIToImage,
                apiId:"fal-ai/gemini-25-flash-image/edit",
                providerId:"falaiGeminiClient",
                credits:10,
                price:0.039
            },
            {
                type: ModelType.TextToImage,
                apiId:"fal-ai/gemini-25-flash-image",
                providerId:"falai",
                credits:10,
                price:0.039
            }
        ]
    },
    {
        id:"hunyuan-image-3-0",
        apiId:"hunyuan-image-3", 
        type: ModelType.TextToImage,
        name:"Hunyuan-Image-3",
        description:"The AI that masters text and photorealism",
        providerId:"wavespeedai",
        price:0.05,
        duration:60,
        credits:13,
        isFree:false,
        isAvailable:true,
        withImg:false
    },
]
