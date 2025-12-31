import { isDev } from "@/lib/utils";
export type RechargePlan = {
  code: string;
  name: string;
  buyName: string;
  price: number;
  credit: number;
  desc: string;
  productId: string;
  isMostPop?: boolean;
};
import {MAX_DAILY_LIMIT} from "@/lib/constants"

export const SubscriptionTrialCredits = 1000;


export type PricingCode = {
  code: string;
  name: string;
  price: {
    monthly: number;
    yearly: number;
  };
  credit: {
    monthly: number;
    yearly: number;
  };
  productId: {
    monthly: string;
    yearly: string;
  };
};
export interface PricingPlan {
  id: string;  // code 
  code: PricingCode
  name: string;
  description: string;
  cta: string;
  features: string[];
  missing: string[]; // 缺失的功能（用于展示 X 号）
  popular: boolean;
}


export const PricingCodes: PricingCode[] = isDev()
  ? [
    {
      code: "FREE",
      name: "Free",
      price: { monthly: 0.00, yearly: 0.00 },
      credit: { monthly: 10, yearly: 120 },
      productId: { monthly: "free", yearly: "free" },
    },
    {
      code: "BASIC",
      name: "Basic",
      price: { monthly: 9.99, yearly: 95.04 },
      credit: { monthly: 400, yearly: 4800 },
      productId: { monthly: "prod_2kXdzPP1XHbmujw7Rhlt9z", yearly: "prod_7aMbMJ6sHHPFBBULyIPEkl" },
    },
    {
      code: "PRO",
      name: "Pro",
      price: { monthly: 29.90, yearly: 287.04 },
      credit: { monthly: 1600, yearly: 19200 },
      productId: { monthly: "prod_2kXdzPP1XHbmujw7Rhlt9z", yearly: "prod_2kXdzPP1XHbmujw7Rhlt9z" },
    },
  ]
  : [
    {
      code: "FREE",
      name: "Free",
      price: { monthly: 0, yearly: 0 },
      credit: { monthly: 8, yearly: 120 },
      productId: { monthly: "free", yearly: "free" },
    },
    {
      code: "BASIC",
      name: "Basic",
      price: { monthly: 9.99, yearly: 95.04 },
      credit: { monthly: 400, yearly: 4800 },
      productId: { monthly: "prod_4rAJA1UJS4mHX4JMdCw1mp", yearly: "prod_7iE0GnWdVHKJNCC9BI8K8r" },
    },
    {
      code: "PRO",
      name: "Pro",
      price: { monthly: 29.90, yearly: 287.04 },
      credit: { monthly: 1600, yearly: 19200 },
      productId: { monthly: "prod_5NnbXKSxDYVshiKqfBgDjl", yearly: "prod_4VuKyKmTG2F8LbbX2nypSb" },
    },
  ]


export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "FREE",
    code: PricingCodes.find((code) => code.code === "FREE")!,
    name: "Free",
    description: "Perfect for testing the waters and personal use.",
    cta: "Get Started",

    features: [
      "8 free credits",
      "Public gallery visibility",
    ],
    missing: [
      "Fast GPU Access",
      "Private Mode",
      "Commercial License"
    ],
    popular: false,
  },
  {
    id: "BASIC",
    name: "Basic",
    code: PricingCodes.find((code) => code.code === "BASIC")!,
    description: "For power users and high-volume needs.",
    cta: "Upgrade to Basic",
    features: [
      "400 Fast Generations / mo",
      "Private Mode (Hidden from gallery)",
      "Priority Access",
      "Commercial License",
    ],
    missing: [
    ],
    popular: true,
  },
  {
    id: "PRO",
    name: "Pro",
    code: PricingCodes.find((code) => code.code === "PRO")!,
    description: "For creators who want full ownership and speed.",
    cta: "Upgrade to Pro",
    features: [
      "Everything in Basic",
      "1600 Fast Generations / mo",
      "Top Priority GPU Access",
      "Early Access to New Features",
      "Priority Support",
    ],
    missing: [],
    popular: false,
  },

];

