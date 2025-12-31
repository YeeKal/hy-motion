
//  labubu doll lora
import { Model, ModelType } from "./type";
import { fal } from "@fal-ai/client";

import { BaseRatios, DEFAULT_ASPECTRATIO } from '@/lib/image-generate/constants';
import { AppWindowIcon } from "lucide-react";


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

function getSizeFromAspectRatio(aspectRatio: string, originalWidth?: number, originalHeight?: number) {
  if (aspectRatio === "auto" && originalWidth && originalHeight) {
    return getOptimalDimensions(originalWidth, originalHeight)
  }
  const ratio = BaseRatios.find(r => r.value === aspectRatio);
  if (ratio) {
    return {
      width: ratio.size.width, height: ratio.size.height
    }
  }
  return { width: 1024, height: 1024 };
}

export function compatibilityCheck(model: Model, prompt?: string, images?: string[]): boolean {
  switch (model.type) {
    case ModelType.TextToImage:
      return typeof prompt === "string" && prompt.length > 0; // Text-to-image models can always accept text prompts
    case ModelType.TIToImage:
      return typeof prompt === "string" && prompt.length > 0; // Text-to-image models require text and can optionally accept an image
    case ModelType.TIIToImage:
      return typeof prompt === "string" && prompt.length > 0 && images !== undefined && images.length > 0; // Text-to-image models require both text and an image
    case ModelType.BackgroundRemover:
      return images !== undefined && images.length > 0; // Background remover models require an image
    case ModelType.ImageToImage:
      return images !== undefined && images.length > 0;
    default:
      throw new Error(`Unsupported model type: ${model.type}`);
  }
}

function imagesizeHelper(id: string, aspectRatio: string, width: number, height: number) {
  switch (id) {
    case "nano-banana-pro":
      return aspectRatio
    case "gpt-image-1-5":

      if (width == height) {
        return "1024x1024"
      } else if (width > height) {
        return "1536x1024"
      } else {
        return "1024x1536"
      }

    default:
      return {
        width: width, height: height
      }
  }

}

export async function imageGeneration(model: Model, prompt: string, aspectRatio: string, imageCount: number, images: string[], originalWidth?: number, originalHeight?: number) {
  const imageSize = getSizeFromAspectRatio(aspectRatio, originalWidth, originalHeight);
  console.log({
    modelId: model.id,
    prompt,
    imageCount,
    imageSize
  })
  const count = Math.max(imageCount, 1);

  const { request_id } = await fal.queue.submit(model.apiId, {
    input: {
      prompt: prompt,
      image_size: imagesizeHelper(model.id,aspectRatio,imageSize.width,imageSize.height),
      num_images: count, // Arena typically generates 1 image per model for comparison
      output_format: "png",
      enable_safety_checker: false,
      ...(images?.length > 0 ? model.supportImageArray ? { image_urls: images } : { image_url: images[0] } : {}),
      ...(model.id === "gpt-image-1-5" ? { quality: "low" } : {}),

    },
    webhookUrl: undefined, // Optional: add webhook if needed
  });

  return {
    requestId: request_id,
    apiId: model.apiId
  };
}
