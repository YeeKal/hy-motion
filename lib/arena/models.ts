export interface ArenaModel {
  id: string;
  name: string;
  apiId: string;
  credit: number;
}

export const ARENA_MODELS: ArenaModel[] = [
  {
    id: "z-image-turbo",
    name: "Z-Image",
    apiId: "fal-ai/z-image/turbo",
    credit: 1,
  },
  {
    id: "nano-banana-pro",
    name: "Nano Banana Pro",
    apiId: "fal-ai/nano-banana-pro",
    credit: 30
  },
  {
    id: "flux-2-pro",
    name: "Flux.2 Pro",
    apiId: "fal-ai/flux-2-pro",
    credit: 6
  },
  {
    id: "seedream-4-0",
    name: "Seedream 4.0",
    apiId: "fal-ai/bytedance/seedream/v4/text-to-image",
    credit: 6
  },
  {
    id: "flux-2-dev",
    name: "Flux.2 Dev",
    apiId: "fal-ai/flux-2",
    credit: 3
  },
  {
    id: "flux-2-flex",
    name: "Flux.2 Flex",
    apiId: "fal-ai/flux-2-flex",
    credit: 12
  },
  // {
  //   id: "flux-2-flex",
  //   name: "Flux.2 Flex",
  //   apiId: "fal-ai/flux-2-flex",
  //   credit: 12
  // },
    {
    id: "flux-1-dev",
    name: "Flux.1 Dev",
    apiId: "fal-ai/flux/dev",
    credit: 5
  },
  {
    id: "fast-sdxl",
    name: "Lightning SDXL", // enable_safety_checker: false
    apiId: "fal-ai/fast-lightning-sdxl",
    credit: 1,
  }
];
