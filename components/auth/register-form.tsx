"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {Link} from "@/i18n/routing"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThirdPartyProviders } from "./third-party-providers"

export function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  // Client-side validation
  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const validatePassword = (password: string) => {
    return password.length >= 8
  }

  useEffect(() => {
    // Check for success redirect from nextauth
    const status = searchParams.get('status')
    if (status === 'success') {
      setSuccessMessage('Registration successful! You can now log in.')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccessMessage("")
    
    // Client-side validation
    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }
    
    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long")
      return
    }
    
    setIsLoading(true)

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Registration failed")
      }

      // Registration successful - redirect with success message
      router.push("/login?registered=true")
    } catch (error) {
      if (error instanceof Error) {
        // Handle specific error messages from backend
        if (error.message.includes("already exists")) {
          setError("An account with this email already exists")
        } else if (error.message.includes("social login provider")) {
          setError("This email is already registered with Google or GitHub. Please use social login.")
        } else {
          setError(error.message)
        }
      } else {
        setError("An error occurred during registration")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-6 p-6 bg-card rounded-lg shadow-md">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Register</h1>
        <p className="text-muted-foreground">
          Already have an account? <Link href="/login" className="text-primary underline">Login</Link>
        </p>
      </div>

      <ThirdPartyProviders setError={setError} />
      {process.env.NODE_ENV === "development" &&
       <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-sm text-white bg-destructive rounded">
            {error}
          </div>
        )}
        
        {successMessage && (
          <div className="p-3 text-sm text-white bg-green-600 rounded">
            {successMessage}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name
          </label>
          <Input
            id="name"
            value={name}
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            placeholder="you@example.com"
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            placeholder="********"
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            minLength={8}
          />
          <p className="text-xs text-muted-foreground">
            Password must be at least 8 characters long
          </p>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Loading..." : "Register"}
        </Button>
      </form> 
      }
    </div>
  )
}
