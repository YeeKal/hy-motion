import { fal } from "@fal-ai/client";
import { Model, ParamRequirement } from "@/lib/image-generator/type";


export async function falaiClient(model:Model, prompt:string,aspectRatio:string,imageSize:string, images?:string){
     try {
            const { request_id } = await fal.queue.submit(model.apiId, {
              input: {
                prompt: prompt,
                image_size: model.id === "nano-banana-pro"?aspectRatio:  imageSize,
                num_images: 1, // Arena typically generates 1 image per model for comparison
                output_format: "png",
                enable_safety_checker : false,
              },
              webhookUrl: undefined, // Optional: add webhook if needed
            });
    
            return {
              modelId: model.id,
              requestId: request_id,
              status: "queued",
              apiId: model.apiId
            };
          } catch (e: any) {
            console.error(`Failed to submit job for model ${model.id}:`, e);
            return {
              modelId: model.id,
              error: e.message || "Failed to submit",
              status: "failed"
            };
          }

}
