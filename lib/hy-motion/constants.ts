
export interface HyMotionModel {
  id: string;
  name: string;
  tag: string;
  credit: number;
        isAvailable: boolean;
        description: string;
}

export const HY_MOTION_MODELS: HyMotionModel[] = [
  { 
    id: "fal-ai/hunyuan-motion/fast", 
    name: "HY-Motion-1.0-Lite (0.46B)", 
    tag: "Fast",
    credit: 6,
        isAvailable: true,
        description: "Faster generation with moderate quality",

  },
  { 
    id: "fal-ai/hunyuan-motion", 
    name: "HY-Motion-1.0 (1B)", 
    tag: "Quality",
    credit: 8,
        isAvailable: true,
        description: "Higher quality generation with standard speed",

  },
];

export const MAX_PROMPT_LENGTH = 500;
