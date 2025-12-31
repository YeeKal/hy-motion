
export async function verifyTurnstileToken(token: string): Promise<boolean> {
  try {
    const verifyResponse = await fetch(
      `${process.env.BASE_URL || 'http://localhost:3000'}/api/turnstile/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      }
    )

    if (!verifyResponse.ok) {
      const errorText = await verifyResponse.text()
      console.error("Failed to verify token with internal API:", verifyResponse.status, errorText)
      return false
    }

    const verifyResult = await verifyResponse.json()
    if (!verifyResult.success) {
      console.error("Turnstile verification failed:", verifyResult.error, verifyResult.details)
    }
    return verifyResult.success === true
  } catch (error) {
    console.error("Error verifying Turnstile token:", error)
    return false
  }
}