/**
 * Submits a prompt to Creem's moderation API.
 * In development environment, uses the Sandbox API (test-api.creem.io).
 * In production, uses the Production API (api.creem.io).
 *
 * @param prompt - The text prompt to moderate
 * @param userId - Optional external identifier for the user
 * @returns The moderation response with decision field
 * @throws Error if moderation fails
 */
export async function checkPromptModeration(
  prompt: string
): Promise<{
  decision: 'allow' | 'deny' | 'flag' | 'review';
  flagged_reason?: string;
  categories?: Record<string, boolean>;
}> {
  const isDevelopment = process.env.NODE_ENV === 'development';

  // Choose the appropriate base URL and API key based on environment
  const baseUrl = isDevelopment
    ?'https://api.creem.io' // 'https://test-api.creem.io'
    : 'https://api.creem.io';

  // In development, use a test API key (creem_test_xxxxx)
  // In production, use the production API key (creem_xxxxx)
  const creemApiKey = process.env.CREEM_API_KEY ?? '';

  const response = await fetch(`${baseUrl}/v1/moderation/prompt`, {
    method: 'POST',
    headers: {
      'x-api-key': creemApiKey,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      prompt
    }),
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    console.log(response.status, await response.text());
    throw new Error(`moderation_http_${response.status}`);
  }

  const moderation = await response.json();

  return moderation as {
    decision: 'allow' | 'deny' | 'flag' | 'review';
    flagged_reason?: string;
    categories?: Record<string, boolean>;
  };
}