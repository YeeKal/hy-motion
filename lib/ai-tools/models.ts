
import { fal } from "@ai-sdk/fal";
import { togetherai } from "@ai-sdk/togetherai";
import { Model, ModelType } from "@/lib/types";

export const baseRatios = [
      { label: "Auto", value: "auto", size: { width: 1024, height: 1024 } }, // Default to square if no aspect ratio is provided
      { label: "Square(1:1)", value: "1:1", size: { width: 1024, height: 1024 } },
      { label: "Portrait(3:4)", value: "3:4", size: { width: 768, height: 1024 } },
      { label: "Landscape(16:9)", value: "16:9", size: { width: 1280, height: 720 } },
      { label: "Standard(4:3)", value: "4:3", size: { width: 1024, height: 768 } },
      { label: "Vertical(9:16)", value: "9:16", size: { width: 720, height: 1280 } },
      { label: "Ultrawide(21:9)", value: "21:9", size: { width: 1536, height: 640 } },
      { label: "Ultra-vertical(9:21)", value: "9:21", size: { width: 640, height: 1536 } },
    ]
export type ImageSizeInfo = {
    width?: number,
    height?: number, 
    size?: `${number}x${number}`, // Optional size in format "width x height"
    originalWidth?: number, 
    originalHeight?: number,
    seed?: string,
}

// Add helper function to calculate optimal dimensions for AI models
const getOptimalDimensions = (originalWidth: number, originalHeight: number, maxPixels = 1048576) => {
  // Calculate aspect ratio
  const aspectRatio = originalWidth / originalHeight

  // If image is already within limits, return as-is (rounded to multiples of 8)
  if (originalWidth * originalHeight <= maxPixels) {
    return {
      width: Math.round(originalWidth / 8) * 8,
      height: Math.round(originalHeight / 8) * 8,
    }
  }

  // Scale down while maintaining aspect ratio
  let newWidth, newHeight

  if (aspectRatio > 1) {
    // Landscape
    newWidth = Math.sqrt(maxPixels * aspectRatio)
    newHeight = newWidth / aspectRatio
  } else {
    // Portrait or square
    newHeight = Math.sqrt(maxPixels / aspectRatio)
    newWidth = newHeight * aspectRatio
  }

  // Round to multiples of 8 (required by most AI models)
  return {
    width: Math.round(newWidth / 8) * 8,
    height: Math.round(newHeight / 8) * 8,
  }
}

// Update the getSizeFromAspectRatio function
export function getSizeFromAspectRatio(ratio: string, originalWidth?: number, originalHeight?: number): { width: number; height: number } | undefined {
  if (ratio === "auto" && originalWidth && originalHeight) {
    return getOptimalDimensions(originalWidth, originalHeight)
  }


  const foundRatio = baseRatios.find((r) => r.value === ratio); // Check if "auto" is in the ratio list
  if (foundRatio ) {
    return foundRatio.size;
  }

  return {
    width: 1024,
    height: 1024,
  };
}

export function compatibilityCheck(model: Model, prompt?: string, image?:string): boolean {
  switch (model.type) {
    case ModelType.TextToImage:
      return typeof prompt === "string" && prompt.length > 0; // Text-to-image models can always accept text prompts
    case ModelType.TIToImage:
      return typeof prompt === "string" && prompt.length > 0; // Text-to-image models require text and can optionally accept an image
    case ModelType.TIIToImage:
      return typeof prompt === "string" && prompt.length > 0 && typeof image === "string" && image.length > 0; // Text-to-image models require both text and an image
    case ModelType.BackgroundRemover:
      return image !== undefined && image.length > 0; // Background remover models require an image
    case ModelType.LabubuLora:
      return typeof prompt === "string" && prompt.length > 0 && typeof model.lora === "object"; // Lora models require a text prompt
    case ModelType.BackgroundRemover:
      return typeof image === "string" && image.length > 0; // Background remover models require an image
    case ModelType.KontextLora:
      return typeof image === "string" && image.length > 0; 
    case ModelType.ImageToVideo:
      return typeof image === "string" && image.length > 0; // Image-to-video
    default:
      throw new Error(`Unsupported model type: ${model.type}`);
  }
}

export function getModel(model: Model) {
  switch (model.providerId) {
    case "togetherai":
      return togetherai.image(model.id);
    case "falai":
      return fal.image(model.id);
    default:
      throw new Error(`Unsupported provider: ${model.providerId}`);
  }
}
export function isProviderEnabled(providerId: string): boolean {
    switch (providerId) {
      case "togetherFluxDevLora":
        return !!process.env.TOGETHERAI_API_KEY;
      case "togetherai":
        return !!process.env.TOGETHERAI_API_KEY;
      case "falai":
        return !!process.env.FAL_API_KEY;
      case "openai":
        return !!process.env.OPENAI_API_KEY;
      case "anthropic":
        return !!process.env.ANTHROPIC_API_KEY;
      case "google":
        return !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;
      case "groq":
        return !!process.env.GROQ_API_KEY;
      case "ollama":
        return !!process.env.OLLAMA_BASE_URL;
      case "azure":
        return !!process.env.AZURE_API_KEY && !!process.env.AZURE_RESOURCE_NAME;
      case "deepseek":
        return !!process.env.DEEPSEEK_API_KEY;
      case "fireworks":
        return !!process.env.FIREWORKS_API_KEY;
      case "xai":
        return !!process.env.XAI_API_KEY;
      case "openrouter":
        return !!process.env.OPENROUTER_API_KEY;
      default:
        return false;
    }
  }
