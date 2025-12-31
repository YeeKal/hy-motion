import { NextRequest, NextResponse } from 'next/server';
import { fal } from "@fal-ai/client";
import { verifyTurnstileToken } from '@/lib/turnstile';
import { PRO_SKIP_TOKEN } from '@/lib/constants';
import { getUserSession } from '@/lib/auth';
import { deductUserCredits } from '@/lib/db';
import { prisma } from "@/lib/prisma"
import { BaseRatios } from '@/lib/image-generate/constants';
import { checkRateLimit } from '@/lib/ratelimit';
import { headers } from "next/headers";
const max_duration = 60;
export const dynamic = 'force-dynamic';


function getSizeFromAspectRatio(aspectRatio: string) {
  const ratio = BaseRatios.find(r => r.value === aspectRatio);
  if (ratio) {
    return {
      width: ratio.size.width, height: ratio.size.height
    }
  }
  // Default size
  return { width: 1024, height: 1024 };

}


// 定义请求体接口
interface GenerateRequest {
  prompt: string;
  aspectRatio?: string; // 例如: "landscape_16_9", "square_hd", "portrait_16_9"
  imageCount?: number;
  outputFormat?: "jpeg" | "png";
  turnstileToken?: string;
}


export async function POST(request: NextRequest) {
  const session = await getUserSession();

  try {

    const formData = await request.formData();
    const prompt = formData.get('prompt') as string;

    const aspectRatio = formData.get("aspectRatio") as string || "auto";
    const imageCount = Math.max(parseInt(formData.get("imageCount") as string) || 1, 1);
    const token = formData.get('turnstileToken') as string;
    const min_credits = imageCount;

    console.log("Received generation request:", {
      prompt,
      aspectRatio,
      imageCount,
      token
    })

    //  1. 基本参数验证
    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }
    let real_credits = 0;
    try {

      if (session && session.user) {
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: {
            credits: true,
          },
        });
        console.log(user)

        real_credits = user?.credits || 0;;
      }
    } catch (error) {
      throw new Error(`Failed to fetch user credits`);
    }

    // 2. 验证 Turnstile Token（如果credits 不足 进行验证）
    if (!session || !session.user || real_credits < min_credits) {
      // 2-1. 获取 Headers 信息
      const headersList = await headers();
      const ip = headersList.get("x-forwarded-for") ?? "127.0.0.1";
      const userAgent = headersList.get("user-agent") ?? "";

      // 2-2. 调用限流器
      const { success, limit, reset, remaining } = await checkRateLimit(ip, userAgent);
      console.log(success, limit, remaining)
      if (!success) {
        return NextResponse.json(
          {
            error: "Out of free credits",
            message: "Rate limit exceeded"
          },
          { 
            status: 429,
            headers: {
                "X-RateLimit-Limit": limit.toString(),
                "X-RateLimit-Remaining": remaining.toString(),
            }
          }
        )
      }

      const turnstileResult = await verifyTurnstileToken(token);
      if (!turnstileResult) {
        return NextResponse.json(
          { error: "Turnstile verification failed" },
          { status: 400 }
        );
      }
    }


    // 2. 调用 fal.ai 模型
    // 使用 fal.subscribe 会自动处理队列等待，直到生成完成才返回
    const result = await fal.subscribe("fal-ai/z-image/turbo", {
      input: {
        prompt: prompt,
        image_size: getSizeFromAspectRatio(aspectRatio), // 映射到 fal 的 image_size 参数
        num_images: imageCount,   // 注意：部分模型(如Flux Pro)可能一次仅支持生成1张
        output_format: "png",
        enable_safety_checker: false
      },
      logs: true, // 在服务端控制台打印进度日志
    });

    // 3. 处理返回结果
    // fal 的返回结构通常包含 data.images
    // 如果 result.data 存在，则直接使用，否则查看 result 本身
    const data = result.data || result;

    if (!data.images) {
      throw new Error("No images returned from fal.ai");
    }

    // 4. 扣除用户积分
    if (session && session.user && real_credits >= min_credits) {



      const creditsToDeduct = min_credits;
      // 调用你的扣除积分的函数
      await deductUserCredits(session.user.id, creditsToDeduct);
      console.log(`Deducted ${creditsToDeduct} credits from user ${session.user.id}`);
    }


    // 4. 返回 Image 数组给前端
    return NextResponse.json({
      images: data.images // 格式通常为 [{ url: "...", width: 1024, height: 768, content_type: "image/jpeg" }]
    });

  } catch (error: any) {
    console.error("Fal AI Generation Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
