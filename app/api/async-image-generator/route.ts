import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '@/lib/auth';
import { deductUserCredits } from '@/lib/db';
import { prisma } from "@/lib/prisma";
import {ImageModels} from "@/lib/image-generator/models"
import {compatibilityCheck, imageGeneration} from "@/lib/image-generator/wrapper"




export async function POST(request: NextRequest) {
  const session = await getUserSession();

  try {
    const body = await request.json();
    const { prompt, aspectRatio = "auto",images=[], imageCount=1,modelId,originalWidth,originalHeight } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }
    if (!modelId) {
      return NextResponse.json({ error: "No valid model selected" }, { status: 400 });
    }


    // 1. find model
    let selectedModel = ImageModels.find(m => m.id == modelId);
    if(!selectedModel){
      return NextResponse.json({ error: `Model ${modelId} not found"` }, { status: 400 });
    }

     //  compatibility check
    if (!compatibilityCheck(selectedModel, prompt, images)) {
      return NextResponse.json({ error: `Model ${selectedModel.name} is not compatible with the provided parameters.` }, { status: 400 });
    }

    //  handle composer, create a new img model if composer exists
    if (selectedModel.composer && selectedModel.composer.length > 0) {
        const composerModel = {...selectedModel};

        let isSupported = false;
        for (const composer of selectedModel.composer) {
            composerModel.apiId = composer.apiId;
            composerModel.providerId = composer.providerId;
            composerModel.credits = composer.credits;
            composerModel.price = composer.price;
            composerModel.type = composer.type;
            if (!compatibilityCheck(composerModel, prompt, images)) {
                continue; //  skip this composer if not compatible
            }
            selectedModel = composerModel; 
            isSupported = true;
            break; //  break after the first compatible composer

        }

        if (!isSupported) {
          return NextResponse.json({ error: `No compatible composer found for model ${selectedModel.name}.` }, { status: 400 });
        }
    }

    const totalCreditsNeeded = Math.max( selectedModel.credits * imageCount, 1);

    // 2. Check user credits
    let userCredits = 0;
    if (session && session.user) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { credits: true },
      });
      userCredits = user?.credits || 0;
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (userCredits < totalCreditsNeeded) {
      return NextResponse.json(
        { error: "Insufficient credits", required: totalCreditsNeeded, current: userCredits },
        { status: 402 }
      );
    }

    // 3. Deduct credits
    await deductUserCredits(session.user.id, totalCreditsNeeded);
    console.log(`Deducted ${totalCreditsNeeded} credits from user ${session.user.id}`);

    // 4. Submit to FAL queue for each model


    const results = await imageGeneration(selectedModel,prompt,aspectRatio,imageCount,images,originalWidth,originalHeight);

    return NextResponse.json(results);

  } catch (error: any) {
    console.error("Arena Generation Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
