import { NextRequest, NextResponse } from "next/server"
import { hash } from "bcrypt"
import { prisma } from "@/lib/prisma"
import {DEFAULT_CREDITS, MONTH_IN_MILLISECONDS} from "@/lib/constants"

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json()
    
    // Validate input
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }
    
    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      )
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    }).catch(error => {
      console.error("Database error during user lookup:", error)
      throw new Error("Database error during registration")
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      )
    }
    
    // Check if the user exists with third-party providers
    const existingAccount = await prisma.account.findFirst({
      where: {
        user: {
          email
        }
      },
      include: {
        user: true
      }
    }).catch(error => {
      console.error("Database error during account lookup:", error)
      throw new Error("Database error during registration")
    })

    if (existingAccount) {
      return NextResponse.json(
        { error: "This email is already registered with a social login provider" },
        { status: 409 }
      )
    }
    
    // Hash password
    const hashedPassword = await hash(password, 10)
    
    // Create user
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        credits: DEFAULT_CREDITS,
        subscriptionExpires: new Date(Date.now() + MONTH_IN_MILLISECONDS)

      }
    }).catch(error => {
      console.error("Database error during user creation:", error)
      throw new Error("Error creating user account")
    })
    
    // Return success without exposing sensitive data
    return NextResponse.json(
      { success: true },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "Failed to register user" },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    )
  }
} 