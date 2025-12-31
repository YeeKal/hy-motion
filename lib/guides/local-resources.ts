import { 
  Cpu, HardDrive, Layers, Zap, PenTool, AlertTriangle, 
  FileJson, Settings, Download, Box, RefreshCw, Terminal, 
  GitBranch, FlaskConical, AlertCircle
} from "lucide-react";
import { actionAsyncStorage } from "next/dist/server/app-render/action-async-storage.external";

export const LOCAL_RESOURCES = {
  // --- 1. 模型下载区 (Top Section) ---
  models: [
    {
      id: "turbo",
      name: "Z-Image Turbo",
      status: "Released",
      tag: "Inference",
      description: "8-step distilled model. The fastest inference speed suitable for real-time generation.",
      preview: "https://placehold.co/600x300/4f46e5/ffffff?text=Z-Image+Turbo",
      downloads: [
        { label: "Original (Safetensors)", vram: "16GB+", link: "https://huggingface.co/Tongyi-MAI/Z-Image-Turbo", note: "Best Quality" },
        { label: "FP8 (T5B)", vram: "", link: "https://huggingface.co/T5B/Z-Image-Turbo-FP8", note: "Balanced" },
        { label: "FP8 (drbaph)", vram: "", link: "https://huggingface.co/drbaph/Z-Image-Turbo-FP8", note: "Alternative" },
        { label: "GGUF (Q4/Q8)", vram: "", link: "https://huggingface.co/jayn7/Z-Image-Turbo-GGUF", note: "Low VRAM" },
      ]
    },
    {
      id: "base",
      name: "Z-Image Base",
      status: "Coming Soon",
      tag: "Training",
      description: "Non-distilled foundation model. Requires more steps (20+) but ideal for Fine-tuning.",
      preview: "https://placehold.co/600x300/10b981/ffffff?text=Z-Image+Base",
      downloads: [
        
      ]
    },
    {
      id: "edit",
      name: "Z-Image Edit",
      status: "Coming Soon",
      tag: "Editing",
      description: "A variant fine-tuned on Z-Image specifically for image editing tasks. Allowing for instruction-based editing.",
      preview: "https://placehold.co/600x300/8b5cf6/ffffff?text=Z-Image+Edit",
      downloads: []
    }
  ],

  // --- 2. ComfyUI 详细指南 (Left Card) ---
  comfyGuide: {
    title: "Mastering Z-Image Workflow",
    description: "Follow this exact sequence to avoid errors.",
    steps: [
      {
        id: 1,
        title: "Environment Prep",
        icon: RefreshCw,
        color: "text-blue-500 bg-blue-500/10",
        desc: "If you're a new user, install ComfyUI. If you're already using ComfyUI, update it via the Manager by selecting Update All.",
        actions: [
          { label: "Install ComfyUI", link: "https://www.comfy.org/download", type: "command" },
          { label: "Update All Nodes (Manager)",link: "https://docs.comfy.org/installation/update_comfyui", type: "command" }
        ]
      },
      {
        id: 2,
        title: "Download Essentials",
        icon: Box,
        color: "text-indigo-500 bg-indigo-500/10",
        desc: "Place these files in the correct folders. Turbo needs a specific text encoder.",
        files: [
          { name: "qwen_3_4b.safetensors", path: "/models/text_encoders/", link: "https://huggingface.co/Comfy-Org/z_image_turbo/resolve/main/split_files/text_encoders/qwen_3_4b.safetensors" },
          { name: "z_image_turbo_bf16.safetensors", path: "/models/diffusion_models/", link: "https://huggingface.co/Comfy-Org/z_image_turbo/resolve/main/split_files/diffusion_models/z_image_turbo_bf16.safetensors" },
          { name: "ae.safetensors", path: "/models/vae/", link: "https://huggingface.co/Comfy-Org/z_image_turbo/resolve/main/split_files/vae/ae.safetensors" }
        ],
        actions:[]
      },
      {
        id: 3,
        title: "Load Workflow",
        icon: FileJson,
        color: "text-amber-500 bg-amber-500/10",
        desc: "Don't build from scratch. Use the community verified JSONs.",
        actions: [
          { label: "Download Turbo JSON", link: "https://raw.githubusercontent.com/Comfy-Org/workflow_templates/refs/heads/main/templates/image_z_image_turbo.json", type: "download" },

        ]
      }
    ]
  },

  // --- 3. LoRA & 训练洞察 (Right Card) ---
  loraInsights: {
    title: "LoRA Ecosystem & Training",
    alert: {
      type: "warning",
      title: "Distillation Warning",
      content: "Z-Image Turbo is a distilled model. Distillation compresses the latent space, making it significantly harder to train LoRAs compared to the Base model."
    },
    tools: [
      {
        name: "Ostris AI-Toolkit",
        desc: "The bleeding-edge tool for training flux/z-image architecture. Updated recently to support Z-Image.",
        link: "https://github.com/ostris/ai-toolkit",
        author: "@ostrisai"
      }
    ],
    roadmap: [
      { phase: "Now", action: "Inference Only", desc: "Use Turbo for generating images. Experiment with Ostris tool for style transfer only." },
      { phase: "Next", action: "Wait for Base", desc: "For character/object training, the Z-Image Base model is required for stability." }
    ]
  },
                  
  community:{
    title: "Community Tutorials",
    links:[
        {
            text: "Official ComfyUI Docs",
            link: "https://docs.comfy.org/tutorials/image/z-image/z-image-turbo"
        },
        {
            text: "Low Vram Workflow(GGUF)",
            link: "https://www.reddit.com/r/StableDiffusion/comments/1p7nklr/z_image_turbo_low_vram_workflow_gguf/"
        },
        {
            text: "Deploy on runpod",
            link: "https://runpod.io?ref=5kdp9mps"
        }
    ]
  }
};