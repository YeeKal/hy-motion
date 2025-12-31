
import { NextRequest, NextResponse } from 'next/server';
import { fal } from "@fal-ai/client";
import { getUserSession } from '@/lib/auth';
import { deductUserCredits } from '@/lib/db';
import { prisma } from "@/lib/prisma";
import { HY_MOTION_MODELS } from '@/lib/hy-motion/constants';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    const session = await getUserSession();

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { prompt, duration = 5, modelId } = body;

        if (!prompt) {
            return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
        }

        const model = HY_MOTION_MODELS.find(m => m.id === modelId);
        if (!model) {
            return NextResponse.json({ error: "Invalid model selected" }, { status: 400 });
        }

    try {
        // Check credits
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { credits: true },
        });
        const userCredits = user?.credits || 0;

        if (userCredits < model.credit) {
            return NextResponse.json(
                { error: "Insufficient credits", required: model.credit, current: userCredits },
                { status: 402 }
            );
        }

        // Deduct credits
        await deductUserCredits(session.user.id, model.credit);
        console.log(`Deducted ${model.credit} credits from user ${session.user.id} for hy-motion generation`);

        // Submit to Fal AI
        const { request_id } = await fal.queue.submit(modelId, {
            input: {
                prompt: prompt,
                duration: duration,
            },
            webhookUrl: undefined,
        });

        return NextResponse.json({
            request_id,
            message: "Request submitted successfully"
        });

    } catch (error: any) {
        console.error("HyMotion Generation Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
