import { DefaultSession } from "next-auth"
import { SubscriptionTier } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email?: string | null
      name?: string | null
      image?: string | null
      subscriptionTier?: SubscriptionTier
      credits?: number
    } & DefaultSession["user"]
  }

  interface User {
    subscriptionTier?: SubscriptionTier
    credits?: number
  }
}
