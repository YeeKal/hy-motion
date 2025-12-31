
//  labubu doll lora
import { togetherai } from "@ai-sdk/togetherai";
import { fal } from "@ai-sdk/fal";
import { experimental_generateImage as generateImage } from "ai";
import {ImageSizeInfo} from "@/lib/ai-tools/models";

interface WaveSpeedResponse {
  code: number;
  msg: string;
  data: {
    id: string;
    status: string;
    outputs?: string[];
    error?: string;
  };
}

export async function falaiClient(apiId:string, prompt:string,sizeInfo?: ImageSizeInfo, image_url?:string){
    console.log("falaiCClient called with apiId:", apiId, "prompt:", prompt, "seed:", sizeInfo?.seed);
    try{
        const { image } = await generateImage({
            model: fal.image(apiId),
            prompt: prompt,
            ...(sizeInfo?.size ? { size: sizeInfo.size } : {}),
            ...(image_url ? { providerOptions: { fal: { 
                image_url: image_url,
             } } } : {}),
            ...(sizeInfo?.seed ? { seed: parseInt(sizeInfo.seed, 10) } : {}),
        });

        return image
    }catch(error){
        console.error('Error generating image in falaiCLient:', error);
        throw new Error(`Error in falaiCLient: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

}



export async function wavespeedClient(apiId:string, prompt:string,sizeInfo?: ImageSizeInfo, image_url?:string){
    console.log("wavespeedClient called with apiId:", apiId, "prompt:", prompt, "seed:", sizeInfo?.seed);
    const wavespeed_api_key = process.env.WAVESPEED_API_KEY;
    if (!wavespeed_api_key) {
        throw new Error("WAVESPEED_API_KEY key is required");
    }
    console.log("wavespeed api:",wavespeed_api_key)

  const url = `https://api.wavespeed.ai/api/v3/wavespeed-ai/${apiId}`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${wavespeed_api_key}`,
  };

  // Step 1: Submit the generation request
  const payload = {
    prompt,
    size: sizeInfo?.size ? sizeInfo.size.replace(/x/i, "*") : "1024*1024",
    enable_sync_mode: false,
    enable_base64_output: true, // Important: Get base64 directly
    enable_safety_checker: false,
    ...(image_url ? { image: image_url } : {}),

  };

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
     console.error(`Wavespeedai: HTTP ${response.status}: ${errorText}`);
    throw new Error(`Error in wavespeedaiai: ${response.status}: ${errorText}`);
  }

  const result: WaveSpeedResponse = await response.json();
  const requestId = result.data.id;

  console.log(`Image generation started. Request ID: ${requestId}`);

  // Step 2: Poll for result
  while (true) {
    const resultResponse = await fetch(
      `https://api.wavespeed.ai/api/v3/predictions/${requestId}/result`,
      {
        headers: {
          Authorization: `Bearer ${wavespeed_api_key}`,
        },
      }
    );

    const result: WaveSpeedResponse = await resultResponse.json();

    if (resultResponse.ok && result.code === 200) {
      const data = result.data;
      const status = data.status;

      if (status === "completed") {
        const base64Image = data.outputs?.[0];
        if (!base64Image) {
          throw new Error("No image data returned");
        }
        const mimeMatch = base64Image.match(/^data:(\w+\/\w+);base64,/);
        if (!mimeMatch) {
          throw new Error("Invalid or missing MIME type in Base64 string");
        }

        const mimeType = mimeMatch[1]; // e.g., "image/png"
        const base64Data = base64Image.replace(/^data:\w+\/\w+;base64,/, "");
        console.log("Image generated successfully.");
        return { base64: base64Data, mimeType };
      } else if (status === "failed") {
        throw new Error(`Task failed: ${data.error}`);
      } else {
        console.log("Generating image...", status);
      }
    } else {
        console.error('Error generating image in wavespeedaiai:');
        throw new Error(`Error generating image in wavespeedaiai:${result.msg}: ${result.data.error || ''}`);
    }

    // Wait 100ms before polling again
    await new Promise((resolve) => setTimeout(resolve, 500));
}

}

export async function togetherClient(
    apiId: string,
    prompt: string,
    image_url?: string,
    sizeInfo?: ImageSizeInfo
) {
    console.log("togetherClient called with apiId:", apiId, "prompt:", prompt, "seed:", sizeInfo?.seed);
    try {
        const { image } = await generateImage({
            model: togetherai.image(apiId),
            prompt: prompt,
            ...(sizeInfo?.size ? { size: sizeInfo.size } : {}), // Set the desired image size
            ...(image_url ? { providerOptions: { togetherai: { image_url: image_url } } } : {}),
            ...(sizeInfo?.seed ? { seed: parseInt(sizeInfo.seed, 10) } : {}),
        });

        return image;
    } catch (error) {
        console.error('Error generating image in togetherClient:', error);
        throw new Error(`Error in in togetherClient: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function falaiGeminiClient(apiId:string, prompt:string,sizeInfo?: ImageSizeInfo, image_url?:string){
    console.log("falaiGeminiClient called with apiId:", apiId, "prompt:", prompt, "seed:", sizeInfo?.seed);
    try{
        const { image } = await generateImage({
            model: fal.image(apiId),
            prompt: prompt,
            ...(sizeInfo?.size ? { size: sizeInfo.size } : {}),
            ...(image_url ? { providerOptions: { fal: { 
                image_urls: [image_url],
             } } } : {}),
            ...(sizeInfo?.seed ? { seed: parseInt(sizeInfo.seed, 10) } : {}),
        });

        return image
    }catch(error){
        console.error('Error generating image in falaiCLient:', error);
        throw new Error(`Error in falaiCLient: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

}

export async function falKontextLoraClient(
    apiId: string,
    prompt: string, 
    loraPath: string,
    loraScale: number,
    image_url: string,
    n?: number,
    triggerWords?: string,
    steps?: number,
    sizeInfo?: ImageSizeInfo,
) {
    
    // const modelId = "fal-ai/flux-kontext-lora";

    // check trigger words
    if (triggerWords && !prompt.toLowerCase().includes(triggerWords.toLowerCase())) {
        prompt = triggerWords=="" ? prompt:  `${triggerWords}, ${prompt}`;
    }

    console.log(`prompt: ${prompt}`)

    try {
        const { image } = await generateImage({
            model: fal.image(apiId),
            prompt: prompt,
            ...(sizeInfo?.size ? { size: sizeInfo.size } : {}), // Set the desired image size
            ...(n ? { n: n } : {}),
            ...(sizeInfo?.seed ? { seed: parseInt(sizeInfo.seed, 10) } : {}),// Add seed if provided
            providerOptions:{
                fal: {
                    ...(steps ? { num_inference_steps: steps } : {}),
                    image_url: image_url,
                    loras:[
                        {
                            path: loraPath,
                            scale: loraScale
                        }
                    ],
                    // Correctly pass width and height for Fal API
          ...(sizeInfo?.size && typeof sizeInfo.size === 'string'
            ? {
                width: parseInt(sizeInfo.size.split('x')[0], 10),
                height: parseInt(sizeInfo.size.split('x')[1], 10),
              }
            : {}),
                }
            }
        });
        return image;
    } catch (error) {
        console.error('Error in falKontextLoraClient:', error);
        throw new Error(`Error in falKontextLoraClient: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

export async function togetherFluxDevLoraClient(
    apiId: string,
    prompt: string, 
    loraPath: string,
    loraScale: number,
    n?: number,
    triggerWords?: string,
    steps?: number,
    sizeInfo?: ImageSizeInfo,
    ) {
    
    // const modelId = "black-forest-labs/FLUX.1-dev-lora";

    // check trigger words
    if (triggerWords && !prompt.toLowerCase().includes(triggerWords.toLowerCase())) {
        prompt = `${triggerWords}, ${prompt}`;
    }

    try {
        const { image } = await generateImage({
            model: togetherai.image(apiId),
            prompt: prompt,
            ...(sizeInfo?.size ? { size: sizeInfo.size } : {}), // Set the desired image size
            ...(n ? { n: n } : {}),
        ...(sizeInfo?.seed ? { seed: parseInt(sizeInfo.seed, 10) } : {}),// Add seed if provided
        providerOptions:{
                togetherai: {
                    ...(steps ? { steps: steps } : {}),
                    image_loras:[
                        {
                            path: loraPath,
                            scale: loraScale
                        }
                    ]
                }
            }
        });
        return image;
    } catch (error) {
        console.error('Error in togetherFluxDevLoraClient:', error);
        throw new Error(`Error in togetherFluxDevLoraClient: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}



export async function labubuLoraGenerator(prompt: string, seed?: string) {
    const triggerWords = "Labubu style";
    const steps = 30
    const loraScale = 0.8
    const modelId = "black-forest-labs/FLUX.1-dev-lora";
    const loraPath= "https://huggingface.co/spaces/yeekal/lbb_lora/resolve/main/flux_lbb_style_v1_2ksteps.safetensors?download=true";
    const size = "768x1024"; // Set the desired image size

    // Validate prompt
    if (!prompt) {
        throw new Error('Missing required prompt');
    }
    console.log("raw prompt:", prompt);

    // check trigger words
    if (!prompt.toLowerCase().includes(triggerWords.toLowerCase())) {
        prompt = `${triggerWords}, ${prompt}`;
    }
    console.log("after prompt:", prompt);


    const { image } = await generateImage({
        model: togetherai.image(modelId),
        prompt: prompt,
        // size: size, // Set the desired image size
        size: "512x512", // Set the desired image size
        n: 1, // Generate one image
      ...(seed ? { seed: parseInt(seed, 10) } : {}),// Add seed if provided
       providerOptions:{
            togetherai: {
                steps: steps,
                image_loras:[
                    {
                        path: loraPath,
                        scale: loraScale
                    }
                ]
            }
        }
    });
    return image;
}
