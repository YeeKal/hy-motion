"use client"

import { useState, useEffect } from "react"
import PromptInput from "./prompt-input"
import ActionButtons from "./action-buttons"
import ResultsGrid from "./results-grid"
import { PLAYGROUND_SECTION_ID } from "@/lib/constants"
import { PRO_SKIP_TOKEN, DEFAULT_PROMPT, RANDOM_PROMPTS } from "@/lib/constants"
import { toast } from "sonner";
import { useCredits } from "@/hooks/useCredits"
import { useGuestLimit } from "@/hooks/use-guest-limit";
import { Suspense } from "react"
import { UrlParamsHandler } from "./url-params-handler"
import { ModelCapsules } from "./model-capsule"
import { useTranslations } from "next-intl"
import { useSession } from "next-auth/react"
import { Link } from "@/i18n/routing"

// Window types for Turnstile
declare global {
  interface Window {
    turnstile: any;
  }
}

export interface GeneratedImage {
  url: string
  content_type: string
}

export interface GenerationResult {
  id: string
  prompt: string
  aspectRatio: string
  timestamp: Date
  images: GeneratedImage[]
  isLoading: boolean
}


import { PricingModal } from "@/components/payment/pricing-modal"
import { Button } from "../ui/button"

export default function ImageGenerator() {
  const t = useTranslations("home.playground.verification");
  const { status } = useSession();
  const tResults = useTranslations("home.playground.resultsGrid");
  const tg = useTranslations("home.playground.imageGenerator");

  // 2. Get session data
  const { credits, subscriptionTier, isLoading, refreshCredits } = useCredits();
  //     if (isLoading) {
  //   return <div className="animate-pulse h-10 bg-gray-200 rounded"></div>; // 骨架屏
  // }

  const isPro =
    // subscriptionTier != undefined &&
    //  subscriptionTier !== "FREE" &&
    credits !== undefined &&
    credits > 0

  const { count, max, checkAndIncrement, isLoaded } = useGuestLimit();

  const [prompt, setPrompt] = useState(DEFAULT_PROMPT)
  const [aspectRatio, setAspectRatio] = useState("1:1")
  const [imageCount, setImageCount] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [results, setResults] = useState<GenerationResult[]>([])

  // --- Turnstile State ---
  const [showTurnstile, setShowTurnstile] = useState<boolean>(false)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [turnstileLoaded, setTurnstileLoaded] = useState<boolean>(false)
  const [isVerifying, setIsVerifying] = useState<boolean>(false)

  // --- Pricing Modal State ---
  const [showPricing, setShowPricing] = useState(false)


  // 1. Load Turnstile script
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (typeof window.turnstile !== 'undefined') {
        setTurnstileLoaded(true);
        return;
      }

      // Check for existing script
      if (document.querySelector('script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]')) {
        setTurnstileLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
      script.async = true;
      script.defer = true;

      script.onload = () => setTurnstileLoaded(true);
      script.onerror = () => {
        console.error('Turnstile script failed to load');
        setTurnstileLoaded(false);
      };

      document.head.appendChild(script);

      return () => {
        // Optional cleanup
      };
    }
  }, []);

  // 2. Render/Cleanup Turnstile widget
  useEffect(() => {
    let widgetId: string | null = null;

    if (showTurnstile && turnstileLoaded && typeof window !== 'undefined' && typeof window.turnstile !== 'undefined') {
      const container = document.getElementById('turnstile-container');
      if (container) {
        container.innerHTML = ''; // Clear previous instance

        try {
          widgetId = window.turnstile.render('#turnstile-container', {
            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
            size: 'normal',
            callback: (token: string) => {
              handleTurnstileSuccess(token);
            },
            'error-callback': (errorCode: string) => {
              console.error("Turnstile verification error:", errorCode);
              handleTurnstileError();
            },
            'expired-callback': () => {
              setTurnstileToken(null);
            },
          });
        } catch (error) {
          console.error("Error rendering Turnstile:", error);
          handleTurnstileError();
        }
      }
    }

    return () => {
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, [showTurnstile, turnstileLoaded]);


  const handleReset = () => {
    setPrompt("")
    setAspectRatio("auto")
    setImageCount(1)
  }

  const handleRandom = () => {
    const randomPrompt = RANDOM_PROMPTS[Math.floor(Math.random() * RANDOM_PROMPTS.length)]
    setPrompt(randomPrompt)
  }

  // Step 1: User clicks Generate -> Checks Subscription -> Opens Verification OR Skips
  const initiateGenerate = () => {
    if (!prompt.trim()) return
    if (isGenerating || isVerifying) return

    // 3. Logic Update: Check subscription tier
    // Note: Ensure your backend also validates the subscription before skipping turnstile check

    if (isPro) {
      // Skip verification for paid users
      executeGeneration(PRO_SKIP_TOKEN);
    } else {
      // Non-pro users: verify limit FIRST
      if (!isLoaded) {
        console.log("Guest limit not loaded yet");
        return;
      }

      const allowed = checkAndIncrement();
      if (!allowed) {
        setShowPricing(true);
        return;
      }

      // If allowed, then show verification
      setIsVerifying(true);
      setShowTurnstile(true);
    }
  }

  // Step 2: Verification Success -> Triggers API
  const handleTurnstileSuccess = (token: string) => {
    setTurnstileToken(token);
    setShowTurnstile(false);
    setIsVerifying(false);

    // Execute the actual generation immediately
    executeGeneration(token);
  }

  const handleTurnstileError = () => {
    setIsVerifying(false);
    setShowTurnstile(false);
    toast.error(tg("turnstileError"));
  }

  // Step 3: Actual API Call
  const executeGeneration = async (token: string) => {
    setIsGenerating(true)

    // Check Pro credits
    if (isPro && credits < imageCount) {
      setIsGenerating(false);
      setShowPricing(true);
      return;
    }

    const resultId = Date.now().toString()

    // Add loading result
    const loadingResult: GenerationResult = {
      id: resultId,
      prompt,
      aspectRatio,
      timestamp: new Date(),
      images: Array(imageCount).fill(null),
      isLoading: true,
    }
    setResults([loadingResult, ...results])

    try {
      const formData = new FormData()
      formData.append("prompt", prompt)
      formData.append("aspectRatio", aspectRatio)
      formData.append("imageCount", imageCount.toString())
      // IMPORTANT: Send the token to your backend
      formData.append("turnstileToken", token)

      const response = await fetch("/api/image-generate", {
        method: "POST",
        body: formData,
      })


      if (response.status === 429) {
        setShowPricing(true);
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || "Failed to generate images");
      }


      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || "Failed to generate images");
      }

      const data = await response.json()

      // Update result with generated images
      setResults((prevResults) =>
        prevResults.map((r) =>
          r.id === resultId
            ? {
              ...r,
              images: data.images,
              isLoading: false,
            }
            : r,
        ),
      )
    } catch (error) {

      // Remove failed result or show error state
      setResults((prevResults) => prevResults.filter((r) => r.id !== resultId))
      toast.error(
        "Error generating image",
        {
          description: error instanceof Error ? error.message : "An unknown error occurred.",
          position: "top-center",
          duration: 5000,
        },
      );
    } finally {
      refreshCredits(); // Refresh credits after generation attempt
      setIsGenerating(false)
      setTurnstileToken(null) // Reset token after use
    }
  }

  return (
    <>
      <section id={PLAYGROUND_SECTION_ID} className="scroll-mt-36 pb-20 sm:pb-24 mx-auto max-w-7xl px-3 sm:px-4 lg:px-8">
        {/*  handle params */}
        <Suspense fallback={null}>
          <UrlParamsHandler
            onPromptChange={setPrompt}
            onRatioChange={setAspectRatio}
          />
        </Suspense>

        {/* Header */}
        <div className="flex items-center justify-between py-2 gap-4">
          <ModelCapsules selectedModelId="z-image-turbo" />

          {/* <h2 className="text-md sm:text-4xl font-bold text-foreground">Z-Image Generator</h2> */}
          {!isPro && <Button onClick={() => setShowPricing(true)} variant="outline" size="sm" className="hidden lg:inline"
          >
            {tg("quotaLabel", { quota: Math.max(0, max - count) })}
          </Button>}
        </div>

        {/* Main Input Area */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full">
            <PromptInput
              value={prompt}
              onChange={setPrompt}
              aspectRatio={aspectRatio}
              onAspectRatioChange={setAspectRatio}
              imageCount={imageCount}
              onImageCountChange={setImageCount}
              disabled={isGenerating || isVerifying}
              isPro={!!isPro}
              onShowPricing={() => setShowPricing(true)}
            />

            {/* Action Buttons */}
            <ActionButtons
              onReset={handleReset}
              onRandom={handleRandom}
              onGenerate={initiateGenerate}
              isGenerating={isGenerating || isVerifying}
              hasPrompt={prompt.trim().length > 0}
              isPro={!!isPro}
              onShowPricing={() => setShowPricing(true)}
              count={count}
              maxCount={max}
            />
          </div>
        </div>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="px-4 py-12">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-semibold text-foreground mb-4">{tResults("generatedImages")}</h2>
              <ResultsGrid results={results} />
            </div>
          </div>
        )}
      </section>

      {/* Turnstile Verification Modal */}
      {showTurnstile && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-background border border-border rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-semibold mb-2">{t("title")}</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {t("description")}
            </p>

            <div id="turnstile-container" className="flex justify-center mb-6 min-h-[65px]">
              {!turnstileLoaded && (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground animate-pulse">
                  {t("initializing")}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-end items-center">
              {status === "authenticated" ? (
                <button
                  onClick={() => setShowPricing(true)}
                  className="text-sm text-primary hover:underline font-medium"
                >
                  {t("upgradeToSkip")}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  {t("signInToSkip")}
                </Link>
              )}
              <button
                onClick={() => {
                  setShowTurnstile(false);
                  setIsVerifying(false);
                }}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Modal */}
      <PricingModal open={showPricing} onOpenChange={setShowPricing} />
    </>
  )
}