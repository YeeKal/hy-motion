"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThirdPartyProviders } from "./third-party-providers"
import { callbackLink } from "@/lib/constants"
import { useTranslations } from "next-intl"

// Environment check to determine if in development mode
const isDevelopment = process.env.NODE_ENV === "development"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations("form")

  const addLog = (message: string, isError = false) => {
    if (isDevelopment) {
      const timestamp = new Date().toISOString().split('T')[1].split('.')[0]
      const logMessage = `[Auth Log] ${message}`

      // Log to console with appropriate method
      if (isError) {
        console.error(logMessage)
      } else {
        console.log(logMessage)
      }

      // Add to UI logs
      setLogs(prev => [...prev, `${timestamp} - ${message}`])
    }
  }

  useEffect(() => {
    // Check for successful registration message
    const registered = searchParams.get('registered')
    if (registered === 'true') {
      setError("")
      addLog(t("logs.redirected"))
    }
  }, [searchParams, t])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLogs([])
    setIsLoading(true)
    addLog(`Starting login process for email: ${email.substring(0, 3)}...`)

    try {
      addLog("Calling signIn with credentials")
      console.log("About to call signIn with credentials", { email })
      
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })
      
      console.log("SignIn result:", result)
      addLog(`SignIn result status: ${result?.status}, error: ${result?.error || 'none'}`)

      if (!result?.ok) {
        addLog(`Login failed with error: ${result?.error}`, true)
        
        // Handle different error types
        if (result?.error === "User not found") {
          setError("No account found with this email address")
        } else if (result?.error === "Invalid password") {
          setError("The password you entered is incorrect")
        } else if (result?.error === "This account cannot use password login") {
          setError("This account uses social login. Please sign in with Google or GitHub")
        } else {
          setError(result?.error || "Invalid email or password")
        }
        setIsLoading(false)
        return
      }

      // If login was successful, directly go to chat page
      addLog("Login successful, redirecting to chat")
      router.refresh()
      await new Promise(resolve => setTimeout(resolve, 100))
      router.push(callbackLink)
    } catch (error) {
      addLog(`Uncaught error during login: ${error}`, true)
      setError("An error occurred during login. Please try again later")
      setIsLoading(false)
    }
  }


  return (
    <div className="mx-auto max-w-md min-w-64 flex flex-col items-center space-y-6 p-6 bg-card rounded-lg shadow-md">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">{t("title")}</h1>
      </div>

      <ThirdPartyProviders setError={setError} />

      {isDevelopment && <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-white bg-destructive rounded">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>
            
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
            disabled={isLoading}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "Login"}
        </Button>
        
        {isDevelopment && logs.length > 0 && (
          <div className="mt-4 p-2 text-xs bg-gray-100 dark:bg-gray-800 rounded overflow-auto max-h-40">
            <div className="font-bold mb-1">Debug Log:</div>
            {logs.map((log, i) => (
              <div key={i} className="font-mono">{log}</div>
            ))}
          </div>
        )}
      </form>}

    </div>
  )
}
