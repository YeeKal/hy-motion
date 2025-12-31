import { type NextRequest, NextResponse } from "next/server"

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY

export async function POST(request: NextRequest) {
  try {
    if (!TURNSTILE_SECRET_KEY) {
      console.error("TURNSTILE_SECRET_KEY is not set in environment variables")
      return NextResponse.json(
        { error: "TURNSTILE_SECRET_KEY is not set in environment variables" },
        { status: 500 }
      )
    }

    let token: string | null = null;
    
    // Try to get token from JSON body first
    try {
      const body = await request.json()
      token = body.token
    } catch (jsonError) {
      // If JSON parsing fails, try to get from form data
      try {
        const formData = await request.formData()
        token = formData.get('token') as string
      } catch (formError) {
        // If both fail, return error
        return NextResponse.json(
          { error: "Invalid request format" },
          { status: 400 }
        )
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: "Turnstile token is required" },
        { status: 400 }
      )
    }

    // Verify token with Cloudflare Turnstile API
    const verifyResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${encodeURIComponent(TURNSTILE_SECRET_KEY)}&response=${encodeURIComponent(token)}`,
      }
    )

    if (!verifyResponse.ok) {
      return NextResponse.json(
        { error: "Failed to verify token with Cloudflare" },
        { status: 500 }
      )
    }

    const verifyResult = await verifyResponse.json()

    if (!verifyResult.success) {
      return NextResponse.json(
        { 
          error: "Invalid Turnstile token", 
          details: verifyResult["error-codes"] || ["Unknown error"]
        },
        { status: 400 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: "Token verified successfully"
    })

  } catch (error: any) {
    console.error('[Turnstile Verify API Error]', error)
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    )
  }
}