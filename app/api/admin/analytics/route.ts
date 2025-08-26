import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"

const db = new Database()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get("timeframe") || "30d"
    const metric = searchParams.get("metric")

    // Mock analytics data - in production, this would query the database
    const analyticsData = {
      overview: {
        totalFarmers: 15420,
        activeFarmers: 8934,
        totalDiseaseDetections: 3245,
        totalSchemeApplications: 1876,
        systemUptime: 99.8,
        avgResponseTime: 245,
      },
      engagement: {
        dailyActiveUsers: generateTimeSeriesData(30, 200, 800),
        featureUsage: {
          diseaseDetection: 45,
          mandiPrices: 78,
          weatherInfo: 92,
          governmentSchemes: 34,
          notifications: 67,
        },
        userRetention: {
          day1: 85,
          day7: 62,
          day30: 34,
        },
      },
      diseaseDetection: {
        totalDetections: 3245,
        accuracyRate: 94.2,
        commonDiseases: [
          { name: "Leaf Blight", count: 892, percentage: 27.5 },
          { name: "Powdery Mildew", count: 654, percentage: 20.1 },
          { name: "Bacterial Spot", count: 543, percentage: 16.7 },
          { name: "Rust", count: 432, percentage: 13.3 },
          { name: "Mosaic Virus", count: 321, percentage: 9.9 },
        ],
        detectionTrends: generateTimeSeriesData(30, 50, 150),
        cropWiseDetections: {
          tomato: 1234,
          rice: 987,
          wheat: 654,
          cotton: 370,
        },
      },
      mandiPrices: {
        totalPriceUpdates: 12450,
        averagePriceChange: 2.3,
        mostVolatileCrops: [
          { name: "Onion", volatility: 15.2 },
          { name: "Tomato", volatility: 12.8 },
          { name: "Potato", volatility: 9.4 },
        ],
        priceAlerts: 234,
        marketTrends: generateTimeSeriesData(30, 1000, 3000),
      },
      schemes: {
        totalApplications: 1876,
        approvedApplications: 1234,
        pendingApplications: 432,
        rejectedApplications: 210,
        popularSchemes: [
          { name: "PM-KISAN", applications: 567 },
          { name: "Crop Insurance", applications: 432 },
          { name: "Soil Health Card", applications: 321 },
          { name: "Organic Farming", applications: 234 },
        ],
        applicationTrends: generateTimeSeriesData(30, 20, 80),
      },
      system: {
        serverHealth: {
          cpu: 45,
          memory: 67,
          disk: 34,
          network: 23,
        },
        apiMetrics: {
          totalRequests: 234567,
          averageResponseTime: 245,
          errorRate: 0.8,
          successRate: 99.2,
        },
        databaseMetrics: {
          connections: 45,
          queries: 12345,
          slowQueries: 23,
          storage: 78,
        },
      },
    }

    if (metric) {
      return NextResponse.json(analyticsData[metric as keyof typeof analyticsData])
    }

    return NextResponse.json(analyticsData)
  } catch (error) {
    console.error("Analytics API error:", error)
    return NextResponse.json({ error: "Failed to fetch analytics data" }, { status: 500 })
  }
}

function generateTimeSeriesData(days: number, min: number, max: number) {
  const data = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    data.push({
      date: date.toISOString().split("T")[0],
      value: Math.floor(Math.random() * (max - min + 1)) + min,
    })
  }

  return data
}
