import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/auth-config";
import { prisma } from "@/lib/prisma"
import { creem } from "@/lib/creem";



/**
 * POST handler for canceling a user's subscription
 *
 * @returns {Promise<NextResponse>} JSON response containing:
 *   - On success: { success: true }
 *   - On error: 401 Unauthorized if no valid session
 */
export async function POST(req: Request) {
  const { subscriptionId } = await req.json()
    if(!subscriptionId){
    return NextResponse.json({ error: "No subscription id provided" }, { status: 400 });
    }
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }


  // Check if user has a paid subscription
  if(session.user.subscriptionTier === "FREE"){
    return NextResponse.json({ error: "No active subscription to cancel" }, { status: 400 });
  }

  const apiKey = process.env.CREEM_API_KEY;

  try {
    // Call Creem SDK to cancel the subscription
    // This will prevent renewal at the end of the current period
    await creem.cancelSubscription({
      xApiKey: apiKey as string,
      id: subscriptionId as string,
    });

    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 },
    );
  }
}