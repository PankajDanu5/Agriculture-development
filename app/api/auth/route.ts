import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, action } = await request.json()

    if (action === "login") {
      // Mock authentication - in production, verify against database
      if (email && password) {
        return NextResponse.json({
          success: true,
          user: {
            id: "1",
            email,
            name: "Farmer User",
            role: "farmer",
          },
          token: "mock-jwt-token",
        })
      }
    }

    if (action === "register") {
      // Mock registration - in production, save to database
      return NextResponse.json({
        success: true,
        message: "User registered successfully",
        user: {
          id: "1",
          email,
          name: "New Farmer",
          role: "farmer",
        },
      })
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 })
  }
}
