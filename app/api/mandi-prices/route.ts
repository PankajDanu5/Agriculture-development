import { type NextRequest, NextResponse } from "next/server"
import { MandiScraper } from "@/lib/mandi-scraper"
import { Database } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const crop = searchParams.get("crop") || "all"
    const state = searchParams.get("state") || "all"
    const market = searchParams.get("market") || "all"
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const action = searchParams.get("action") // trends, compare, etc.

    const scraper = MandiScraper.getInstance()

    // Handle specific actions
    if (action === "trends" && crop !== "all") {
      const trends = await scraper.getPriceTrends(crop)
      return NextResponse.json({
        success: true,
        trends,
      })
    }

    if (action === "compare" && crop !== "all") {
      const comparison = await scraper.comparePricesAcrossMarkets(crop)
      return NextResponse.json({
        success: true,
        comparison,
      })
    }

    if (action === "update") {
      const updateResult = await scraper.updateAllPrices()
      return NextResponse.json({
        success: updateResult.success,
        result: updateResult,
      })
    }

    if (action === "status") {
      const status = scraper.getUpdateStatus()
      return NextResponse.json({
        success: true,
        status,
      })
    }

    // Get regular price data
    let prices = await Database.prices

    // Apply filters
    if (crop !== "all") {
      prices = prices.filter((price) => price.crop.toLowerCase().includes(crop.toLowerCase()))
    }

    if (state !== "all") {
      prices = prices.filter((price) => price.state.toLowerCase().includes(state.toLowerCase()))
    }

    if (market !== "all") {
      prices = prices.filter((price) => price.market.toLowerCase().includes(market.toLowerCase()))
    }

    // Sort by date (newest first) and limit results
    const sortedPrices = prices
      .sort((a, b) => new Date(b.priceDate).getTime() - new Date(a.priceDate).getTime())
      .slice(0, limit)

    // Get unique crops, states, and markets for filters
    const uniqueCrops = [...new Set(Database.prices.map((p) => p.crop))].sort()
    const uniqueStates = [...new Set(Database.prices.map((p) => p.state))].sort()
    const uniqueMarkets = [...new Set(Database.prices.map((p) => p.market))].sort()

    return NextResponse.json({
      success: true,
      prices: sortedPrices,
      total: prices.length,
      filters: {
        crops: uniqueCrops,
        states: uniqueStates,
        markets: uniqueMarkets,
      },
      lastUpdated: scraper.getUpdateStatus().lastUpdateTime,
    })
  } catch (error) {
    console.error("Mandi prices API error:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch prices",
      },
      { status: 500 },
    )
  }
}

// Trigger manual price update
export async function POST(request: NextRequest) {
  try {
    const scraper = MandiScraper.getInstance()
    const result = await scraper.updateAllPrices()

    return NextResponse.json({
      success: result.success,
      message: `Updated ${result.totalUpdated} prices from ${result.sources.length} sources`,
      result,
    })
  } catch (error) {
    console.error("Manual price update error:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Update failed",
      },
      { status: 500 },
    )
  }
}
