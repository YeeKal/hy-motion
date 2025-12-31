import {Model,Tool,ToolType,ModelType, ParamRequirement, LoraParams } from "@/lib/types"

export type LoraGroup = {
    baseModel: Model
    loras: LoraParams[]
}


export const kontextLoras: LoraGroup = {
    baseModel:{
        id:"flux-kontext-dev",
        apiId:"fal-ai/flux-kontext-lora",
        type: ModelType.KontextLora,
        name:"Flux Kontext Dev Lora",
        description:"FLUX.1 Kontext [dev] model with LoRA support",
        providerId:"falKontextLora",
        price:0.035,
        duration:60,
        credits:10,
        isFree:false,
        isAvailable:true,
        withImg:true
    },
    loras: [
        {
            id:"3d-game-assert",
            name:"3D Game Asset",
            loraPath:"https://huggingface.co/fal/3D-Game-Assets-Kontext-Dev-LoRA/resolve/main/MnzfOWwLjl1CL_0qu7F6E_adapter_model_comfy_converted.safetensors?download=true",
            loraScale:0.9,
            triggerWords:"Create 3D game asset, isometric view version",
            icon:"https://cdn.kontextflux.io/kontext-lora/3d-game-assert-icon.webp",
            description:"A LoRA for generating 3D game assets in isometric view.",
        },
        {
            id:"fuse-it",
            name:"Fuse It",
            loraPath:"https://huggingface.co/gokaygokay/Fuse-it-Kontext-Dev-LoRA/resolve/main/O93-UdItaNx8JzLYgnf2h_adapter_model_comfy_converted.safetensors?download=true",
            loraScale:0.9,
            triggerWords:"Fuse this image into background",
            icon:"https://cdn.kontextflux.io/kontext-lora/fuse-icon.webp",
            description:"A LoRA for fusing images into the background.",
        },
        {
            id:"Overlay-Kontext-Dev-LoRA",
            name:"Overlay Kontext Dev",
            loraPath:"https://huggingface.co/ilkerzgi/Overlay-Kontext-Dev-LoRA/resolve/main/WVVtJFD90b8SsU6EzeGkO_adapter_model_comfy.safetensors?download=true",
            loraScale:0.9,
            triggerWords:"place it",
            icon:"https://cdn.kontextflux.io/kontext-lora/overlay-icon.webp",
            description:"A LoRA for overlaying images.",
        },
        {
            id:"mech-anything",
            name : "Mech Anything",
            loraPath:"https://huggingface.co/day-dream/MechAnything-Kontext-Dev-Lora/resolve/main/mech-anything-kontext.safetensors?download=true",
            loraScale:0.9,
            triggerWords:"convert the subject to a robot with with white translucent panels and exposed red and black wiring and golden accented metal bits",
            icon: "https://cdn.kontextflux.io/kontext-lora/mech-anything-icon.webp"
        },
        {
            id:"glass-prism",
            name: "Glass Prism",
            loraPath:"https://huggingface.co/drbaph/GlassPrism-kontext-LoRA/resolve/main/glass-prism-kontext-lora.safetensors?download=true",
            loraScale:1.0,
            triggerWords:"make this object a glass prism with reflections",
            icon: "https://cdn.kontextflux.io/kontext-lora/glass-prism-icon.webp"
        },
        {   
            id: "embroidery-style",
            name: "Embroidery Style",
            loraPath:"https://huggingface.co/ilkerzgi/embroidery-patch-kontext-dev-lora/resolve/main/hr-puSFwzOyE6TqTjybFC_adapter_model.safetensors?download=true",
            loraScale:1.0,
            triggerWords:"make it in embroidery style",
            icon:"https://cdn.kontextflux.io/kontext-lora/embroidery-style-icon.webp",
            description: "Lora for embroidery style"
        },
        {   
            id: "metallic-objects",
            name: "Metallic Objects",
            loraPath:"https://huggingface.co/ilkerzgi/metallic-objects-kontext-dev-lora/resolve/main/metallic-objects-kontext-dev-lora.safetensors?download=true",
            loraScale:1.0,
            triggerWords:"Make it metallic with a black background and a 3D perspective",
            icon:"https://cdn.kontextflux.io/kontext-lora/metallic-objects-icon.webp",
            description:"Transform images into a metallic style, featuring a black background and a 3D perspective"
        },
        {   
            id: "glittering-portrait",
            name: "Glittering Portrait",
            loraPath:"https://huggingface.co/ilkerzgi/Glittering-Portrait-Kontext-Dev-Lora/resolve/main/Glittering-Portrait-Kontext-Dev-Lora.safetensors?download=true",
            loraScale:1.2,
            triggerWords:"Glittering Portrait",
            icon:"https://cdn.kontextflux.io/kontext-lora/glittering-portrait-icon.webp",
            description: "Transforms standard portraits into artistic, glittering versions with dramatic lighting effects"

        },
        {   
            id: "cubist-art",
            name: "Cubist Art",
            loraPath:"https://huggingface.co/fal/Cubist-Art-Kontext-Dev-LoRA/resolve/main/59yr4hcEqhdxkEgIu7iwY_adapter_model_comfy_converted.safetensors?download=true",
            loraScale:1.0,
            triggerWords:"Convert this image into cubist art style",
            icon:"https://cdn.kontextflux.io/kontext-lora/cubist-art-icon.webp",
            description: "Convert this image into cubist art style"

        },
        {   
            id: "collage-art",
            name: "Collage Art",
            loraPath:"",
            loraScale:1.0,
            triggerWords:"Convert this image into collage art style",
            icon:"https://cdn.kontextflux.io/kontext-lora/collage-art-icon.webp",
            description: "Convert this image into collage art style"

        },
        {   
            id: "fluffy",
            name: "Fluffy",
            loraPath:"https://huggingface.co/drbaph/Fluffy-kontext-LoRA/resolve/main/fluffy-kontext-lora.safetensors?download=true",
            loraScale:1.0,
            triggerWords:"make this object fluffy",
            icon:"https://cdn.kontextflux.io/kontext-lora/fluffy-icon.webp",
            description:"Transform any object or logo into an adorable fluffy and cute appeal"

        },
        
        {   
            id: "realism-face-detailer",
            name: "Realism Face Detailer",
            loraPath:"https://huggingface.co/fal/Realism-Detailer-Kontext-Dev-LoRA/resolve/main/high_detail.safetensors?download=true",
            loraScale:1.0,
            triggerWords:"Add details to this face, improve skin details",
            icon:"https://cdn.kontextflux.io/kontext-lora/realism-face-detailer-icon.webp"

        },
        {   
            id: "plushie-style",
            name: "Plushie Style",
            loraPath:"https://huggingface.co/fal/Plushie-Kontext-Dev-LoRA/resolve/main/plushie-kontext-dev-lora.safetensors?download=true",
            loraScale:1.0,
            triggerWords:"https://cdn.kontextflux.io/kontext-lora/plushie-icon.webp",
            icon:"https://cdn.kontextflux.io/kontext-lora/plushie-icon.webp"

        },
        {   
            id: "youtube-thumbnails",
            name: "Youtube Thumbnails",
            loraPath:"https://huggingface.co/fal/Youtube-Thumbnails-Kontext-Dev-LoRA/resolve/main/thumbnails_lora_rank_32.safetensors?download=true",
            loraScale:0.4,
            triggerWords:`Generate youtube thumbnails using text "CAN'T BELIEVE IT!"`,
            icon:"https://cdn.kontextflux.io/kontext-lora/youtube-thumbnails-icon.webp",
            description: "Generate youtube thumbnails"

        },
        {   
            id: "light-fix",
            name: "Light Fix",
            loraPath:"https://huggingface.co/gokaygokay/Light-Fix-Kontext-Dev-LoRA/resolve/main/oRdQNr1St3rF_DNI7miGM_adapter_model_comfy_converted.safetensors?download=true",
            loraScale:1.0,
            triggerWords:"Fuse this image into background",
            icon:"https://cdn.kontextflux.io/kontext-lora/light-fix-icon.webp"

        }
        // {   
        //     id: "embroidery-style2",
        //     name: "Embroidery Style",
        //     loraPath:"",
        //     loraScale:1.0,
        //     triggerWords:"",
        //     icon:""

        // }
    ]
}

export const loraGroups: LoraGroup[] = [kontextLoras];
