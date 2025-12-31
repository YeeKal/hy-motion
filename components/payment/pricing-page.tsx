"use client";

import { useState, useEffect, Suspense } from "react"; // 1. 引入 Suspense
import { motion } from "framer-motion";
import { Check, X, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PRICING_PLANS, PricingPlan } from "@/lib/ai-tools/products";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ThirdPartyProviders } from "@/components/auth/third-party-providers";
import { PLAYGROUND_SECTION_ID } from "@/lib/constants";

import { useRouter, usePathname} from "@/i18n/routing";
import { useSearchParams } from "next/navigation";
import { User } from "next-auth";
import { useSession } from "next-auth/react";

interface PricingPageProps {    
    user: User | undefined
}

// 2. 将原来的 PricingPage 重命名为 PricingContent，并移除 default export
function PricingContent({user}: PricingPageProps) {
  // 1. 获取 status
  const { status } = useSession();
  console.log("status:", status)
  
  const [isYearly, setIsYearly] = useState(true);
  const [loading, setLoading] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [callbackUrl, setCallbackUrl] = useState("/pricing");

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname(); 

  // Handle pending checkout from URL params after login
  useEffect(() => {
    // 🛑 A. 如果正在加载，直接返回，什么都不做
    if (status === "loading") return;

    // 🛑 B. 如果确认未登录，也可以直接返回（或者处理未登录逻辑）
    if (status === "unauthenticated") return;

    // ✅ C. 只有明确是 "authenticated" 时才执行逻辑
    if (status === "authenticated") {
      const planId = searchParams.get("planId");
      const isYearlyParam = searchParams.get("isYearly");

      if (planId) {
        const plan = PRICING_PLANS.find((p) => p.id === planId);
        
        if (plan) {
          // Resume checkout
          const isYearlyOverride = isYearlyParam === "true";
          handleCheckout(plan, isYearlyOverride);

          // Clean up URL parameters to avoid re-triggering
           const currentParams = new URLSearchParams(searchParams.toString());
          currentParams.delete("planId");
          currentParams.delete("isYearly");
          
          // 如果还有剩余参数，拼接到路径后；如果没有，直接跳转 pathname
          const newPath = currentParams.toString() 
            ? `${pathname}?${currentParams.toString()}` 
            : pathname;

          router.replace(newPath); 
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, searchParams, router]); // 建议添加依赖项

  const handleCheckout = async (plan: PricingPlan, isYearlyOverride?: boolean) => {
    // Use override if provided (from URL param), otherwise use current state
    const currentIsYearly = isYearlyOverride ?? isYearly;

        // 🛡️ 防御性编程：如果 session 还在加载，暂时不处理或显示 loading
    if (status === "loading") {
        toast.info("Loading user status .../n Try again later");
        return;
    }

    // Skip if free plan or no product ID
    if (plan.id === "FREE") {
      switch(status){
        case "authenticated":
          router.push("/create");
          return;
        case "unauthenticated":
          router.push("/login");
          return;
        default:
          router.push("/");
          return;
      }
    }



    if (status === "unauthenticated") {
      // Set callback URL with parameters to persist intent
      const params = new URLSearchParams();
      params.set("planId", plan.id);
      params.set("isYearly", currentIsYearly.toString());
      setCallbackUrl(`/pricing?${params.toString()}`);
      console.log("set callback url:",`/pricing?${params.toString()}`)

      setShowLoginModal(true);
      return;
    }

    const productId = currentIsYearly ? plan.code.productId.yearly : plan.code.productId.monthly;

    console.log("Initiating checkout for product ID:", productId);


    if (!productId || productId === "free") {
      return;
    }

    setLoading(plan.id);
    try {
      const response = await fetch(
        `/api/creem/checkout?product_id=${productId}`
      );
      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }
      const responseData = await response.json();
      window.location.href = responseData.checkoutUrl;
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error(
        "An unexpected error occurred. Please try again or contact support."
      );
    } finally {
      setLoading(null);
    }
  };

  return (
    <section className="py-8 overflow-hidden">
      {/* Toggle Switch */}
      <div className="flex justify-center mb-12">
        <div className="relative flex items-center bg-muted p-1 rounded-full border border-border">
          <button
            onClick={() => setIsYearly(false)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
              !isYearly ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsYearly(true)}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all duration-300",
              isYearly ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            Yearly <span className="text-green-500 text-xs ml-1">(-20%)</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {PRICING_PLANS.map((plan) => (
          <PricingCard
            key={plan.id}
            plan={plan}
            isYearly={isYearly}
            loading={loading === plan.id || status === "loading"}
            onCheckout={() => handleCheckout(plan)}
          />
        ))}
      </div>

      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create an Account or Sign In</DialogTitle>
            <DialogDescription>
              Please sign in or create an account to continue with your
              purchase.
            </DialogDescription>
          </DialogHeader>
          <ThirdPartyProviders callbackUrl={callbackUrl} />
          {/* <ThirdPartyProviders/> */}
        </DialogContent>
      </Dialog>
    </section>
  );
}



// 3. 创建一个新的默认导出组件，包裹 Suspense
export default function PricingPage({user}: PricingPageProps) {
  return (
    // fallback 可以是一个加载动画，这里暂时用简单的 div
    <Suspense fallback={<div className="flex justify-center py-20">Loading pricing...</div>}>
      <PricingContent user={user}/>
    </Suspense>
  );
}

// --- 子组件 (保持不变) ---

interface PricingCardProps {
  plan: PricingPlan;
  isYearly: boolean;
  loading: boolean;
  onCheckout: () => void;
}

function PricingCard({ plan, isYearly, loading, onCheckout }: PricingCardProps) {
  const price = isYearly ? plan.code.price.yearly : plan.code.price.monthly;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "relative flex flex-col p-8 rounded-2xl border bg-card/50 backdrop-blur-sm transition-all duration-300",
        plan.popular
          ? "border-primary shadow-2xl shadow-primary/10 ring-1 ring-primary/20 z-10 sm:scale-105"
          : "border-border hover:border-primary/50 hover:shadow-lg"
      )}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
          <Sparkles size={12} fill="currentColor" /> Most Popular
        </div>
      )}

      <div className="mb-2">
        <h3 className="text-xl font-bold">{plan.name}</h3>
        <p className="text-sm text-muted-foreground mt-2 min-h-[40px]">{plan.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-extrabold">${isYearly ? (price / 12).toFixed(2) : price}</span>
          <span className="text-muted-foreground">/mo</span>
          {isYearly && plan.code.code != "FREE" && (
            <span className="text-muted-foreground line-through ml-2">
              ${plan.code.price.monthly}/mo
            </span>
          )}
        </div>
        {isYearly && plan.code.price.monthly > 0 && (
          <p className="text-xs text-green-500 mt-1 font-medium">
            Billed ${price} yearly (Save 20%)
          </p>
        )}
        <div className="mt-4 inline-flex items-center px-3 py-1 rounded-md bg-secondary/50 text-secondary-foreground text-sm font-medium">
          <Zap size={14} className="mr-2 fill-current" />
          {isYearly && plan.code.code != "FREE" ? `${plan.code.credit.yearly} credits/year` : `${plan.code.credit.monthly} credits/month`}
        </div>
      </div>

      <div className="flex-1 space-y-4 mb-8">
        {plan.features.map((feature, i) => (
          <div key={i} className="flex items-start gap-3 text-sm">
            <Check className="w-5 h-5 text-green-500 shrink-0" />
            <span>{feature}</span>
          </div>
        ))}
        {plan.missing.map((feature, i) => (
          <div key={i} className="flex items-start gap-3 text-sm text-muted-foreground/50">
            <X className="w-5 h-5 shrink-0" />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <Button
        size="lg"
        className={cn("w-full rounded-full font-bold",
          plan.popular ? "bg-primary" : "bg-secondary/50 text-secondary-foreground"
        )}
        variant={plan.popular ? "default" : "secondary"}
        onClick={onCheckout}
        disabled={loading}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin mr-2"></div>
            <span>Processing...</span>
          </div>
        ) : (
          plan.cta
        )}
      </Button>
    </motion.div>
  );
}