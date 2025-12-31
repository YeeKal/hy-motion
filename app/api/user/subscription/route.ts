
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth-config";
import { prisma } from "@/lib/prisma"


/**
 * Response interface for user subscription endpoint
 */
export interface UserSubscriptionResponse {
  credits: number;
  subscriptionTier: string;
  subscriptionExpires: Date | null;
  subscriptionStatus: string;
}

/**
 * GET handler for retrieving user's subscription status
 *
 * @returns {Promise<NextResponse>} JSON response containing:
 *   - On success: UserSubscriptionResponse with subscription details
 *   - On error: 401 Unauthorized if no valid session
 */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Fetch user subscription details
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        credits: true,
        subscriptionTier: true,
        subscriptionExpires: true,
        subscriptionStatus: true,
        subscriptionId: true
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      credits: user.credits,
      subscriptionTier: user.subscriptionTier,
      subscriptionExpires: user.subscriptionExpires,
      subscriptionStatus: user.subscriptionStatus,
      subscriptionId: user.subscriptionId
    } as UserSubscriptionResponse);
  } catch (error) {
    console.error("Error fetching subscription details:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription details" },
      { status: 500 }
    );
  }
}

