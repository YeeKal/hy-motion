"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogoGoogle } from "@/components/common/icons"
import { callbackLink } from "@/lib/constants"
interface ThirdPartyProvidersProps {
  setError?: (error: string) => void
  callbackUrl?: string
  isPop?:boolean
}

export function ThirdPartyProviders({ setError = () => { }, callbackUrl = callbackLink,isPop=false }: ThirdPartyProvidersProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)

  const handleProviderLogin = async (provider: "google" | "github") => {
    setIsLoading(true)
    setLoadingProvider(provider)

    try {
      await signIn(provider, {
        callbackUrl: callbackUrl,
      })

    } catch (error) {
      console.error(`${provider} login error:`, error)
      setError(`An error occurred during ${provider} login. Please try again later.`)
    } finally {
      setIsLoading(false)
      setLoadingProvider(null)
    }
  }

  return (
    <>
      <div className=" mx-auto">
        <Button
          type="button"
          variant="outline"
          // className="text-xs sm:text-base"
          onClick={() => handleProviderLogin("google")}
          disabled={isLoading}
        >
     
              <LogoGoogle size={20} />
              <span>
                {loadingProvider === "google"
                  ? "Loading..."
                  : isPop ? "Login": "Login with Google"}
              </span>
           
        </Button>

      </div>
    </>
  )
}