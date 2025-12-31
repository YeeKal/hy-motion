import { NextRequest, NextResponse } from 'next/server';
import { fal } from "@fal-ai/client";
import { getUserSession } from '@/lib/auth';
import { deductUserCredits } from '@/lib/db';
import { prisma } from "@/lib/prisma";
import { ARENA_MODELS } from '@/lib/arena/models';
import { BaseRatios } from '@/lib/image-generate/constants';
export const dynamic = 'force-dynamic';


function getSizeFromAspectRatio(aspectRatio: string) {
  const ratio = BaseRatios.find(r => r.value === aspectRatio);
  if (ratio) {
    return {
      width: ratio.size.width, height: ratio.size.height
    }
  }
  return { width: 1024, height: 1024 };
}

export async function POST(request: NextRequest) {
  const session = await getUserSession();

  try {
    const body = await request.json();
    const { prompt, aspectRatio = "auto", modelIds } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    if (!modelIds || !Array.isArray(modelIds) || modelIds.length === 0) {
      return NextResponse.json({ error: "At least one model must be selected" }, { status: 400 });
    }

    // 1. Calculate total credits needed
    const selectedModels = ARENA_MODELS.filter(m => modelIds.includes(m.id));
    const totalCreditsNeeded = selectedModels.reduce((sum, model) => sum + model.credit, 0);

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
    console.log(`Deducted ${totalCreditsNeeded} credits from user ${session.user.id} for arena generation`);

    // 4. Submit to FAL queue for each model
    const imageSize = getSizeFromAspectRatio(aspectRatio);

    const promises = selectedModels.map(async (model) => {
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
    });

    const results = await Promise.all(promises);

    return NextResponse.json({
      results: results
    });

  } catch (error: any) {
    console.error("Arena Generation Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
