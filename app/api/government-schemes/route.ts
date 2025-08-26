import { type NextRequest, NextResponse } from "next/server"
import { SchemesService } from "@/lib/schemes-service"
import { Database } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")
    const category = searchParams.get("category")
    const query = searchParams.get("query") || ""
    const state = searchParams.get("state")
    const userId = searchParams.get("userId")

    const schemesService = SchemesService.getInstance()

    // Handle specific actions
    if (action === "categories") {
      const categories = await schemesService.getSchemesByCategory()
      return NextResponse.json({
        success: true,
        categories,
      })
    }

    if (action === "recommendations" && userId) {
      // Get user profile for recommendations
      const user = await Database.getUserById(userId)
      if (!user) {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
      }

      const userProfile = {
        farmSize: user.farmSize,
        crops: user.crops,
        location: user.location,
      }

      const recommendations = await schemesService.getRecommendations(userProfile)
      return NextResponse.json({
        success: true,
        recommendations,
      })
    }

    if (action === "eligibility") {
      const schemeId = searchParams.get("schemeId")
      if (!schemeId || !userId) {
        return NextResponse.json({ success: false, message: "Scheme ID and User ID are required" }, { status: 400 })
      }

      const user = await Database.getUserById(userId)
      if (!user) {
        return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
      }

      const userProfile = {
        farmSize: user.farmSize,
        crops: user.crops,
        location: user.location,
      }

      const eligibility = await schemesService.checkEligibility(schemeId, userProfile)
      return NextResponse.json({
        success: true,
        eligibility,
      })
    }

    // Search schemes
    const schemes = await schemesService.searchSchemes(query, {
      category: category || undefined,
      state: state || undefined,
      status: "Active",
    })

    return NextResponse.json({
      success: true,
      schemes,
      total: schemes.length,
    })
  } catch (error) {
    console.error("Government schemes API error:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch schemes",
      },
      { status: 500 },
    )
  }
}

// Update schemes data (admin only)
export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    if (action === "update") {
      const schemesService = SchemesService.getInstance()
      const result = await schemesService.updateSchemeData()

      return NextResponse.json({
        success: result.success,
        message: `Updated ${result.updated} schemes`,
        result,
      })
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Schemes update error:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Update failed",
      },
      { status: 500 },
    )
  }
}
