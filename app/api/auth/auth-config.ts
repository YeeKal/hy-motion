import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GithubProvider from "next-auth/providers/github"
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { compare } from "bcrypt"
import { prisma } from "@/lib/prisma"
import { SubscriptionTier } from "@prisma/client"

// Lazy-load expensive operations
const getProviders = () => {
  return [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      httpOptions: {
        timeout: 10000
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        }
      }
    }),
    // Credentials provider last
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Email and password are required")
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          }).catch(error => {
            console.error("Database error during user lookup:", error)
            throw new Error("Database error, please try again")
          })

          if (!user) {
            throw new Error("User not found")
          }
          
          if (!user.password) {
            throw new Error("This account cannot use password login")
          }

          const isPasswordValid = await compare(credentials.password, user.password)
          
          if (!isPasswordValid) {
            throw new Error("Invalid password")
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: null,
            subscriptionTier: user.subscriptionTier,
            credits: user.credits
          }
        } catch (error) {
          console.error("Authentication error:", error)
          if (error instanceof Error) {
            throw error
          }
          return null
        }
      }
    }),
  ]
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: getProviders(),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) {
        return false
      }

      // For credentials login, no additional checks needed
      if (account?.provider === "credentials") {
        return true
      }

      try {
        // Check if user exists with this email
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { accounts: true },
        })

        // If no user exists, allow normal sign up flow
        if (!existingUser) {
          return true
        }

        // If user exists and already has this provider linked
        if (existingUser.accounts.some(acc => acc.provider === account?.provider)) {
          return true
        }

        // If user exists but doesn't have this provider linked, link it
        if (account && existingUser) {
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              refresh_token: account.refresh_token,
              access_token: account.access_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state,
            },
          })

          return true
        }

        return true
      } catch (error) {
        console.error("Error in signIn callback:", error)
        return false
      }
    },
    async jwt({ token, user, trigger, session }) {
      // console.log("JWT callback triggered:", { trigger, token, user, session });
      
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.subscriptionTier = (user as any).subscriptionTier;
        token.credits = (user as any).credits;
      }
      
      // Handle session update
      if (trigger === 'update') {
        // console.log("update JWT token:", token?.credits);

        try {
          // Fetch fresh user data from database
          const freshUser = await prisma.user.findUnique({
            where: { id: token.id as string },
        select: {
          credits: true,
          subscriptionTier: true,
        },
          });
          
          if (freshUser) {
            token.credits = freshUser.credits;
            token.subscriptionTier = freshUser.subscriptionTier;
          } else {
            console.error("User not found during session update:", token.id);
          }
          console.log("update JWT token after:", token);

        } catch (error) {
          console.error("Error fetching user data during session update:", error);
        }
      }
      
      return token;
    },
    async session({ session, token }) {
      // console.log("Session callback:", { session, token });
      if (session?.user && token) {
        session.user.id = token.id as string
        session.user.subscriptionTier = token.subscriptionTier as SubscriptionTier
        session.user.credits = token.credits as number
      }
      return session
    },
  },
  events: {
    async signIn({ user, account }) {
      console.log(`User ${user.email} signed in with ${account?.provider}`)
    },
    async linkAccount({ user, account }) {
      console.log(`Linked ${account.provider} account to user ${user.email}`)
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  debug: process.env.NODE_ENV === "development",
}
