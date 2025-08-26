import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get("location") || "Delhi"

    // Mock weather data - in production, integrate with weather API
    const mockWeather = {
      location,
      current: {
        temperature: 28,
        humidity: 65,
        windSpeed: 12,
        condition: "Partly Cloudy",
        rainfall: 0,
        uvIndex: 6,
      },
      forecast: [
        {
          date: new Date().toISOString().split("T")[0],
          maxTemp: 32,
          minTemp: 24,
          humidity: 70,
          rainfall: 5,
          condition: "Light Rain",
        },
        {
          date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
          maxTemp: 30,
          minTemp: 22,
          humidity: 75,
          rainfall: 12,
          condition: "Moderate Rain",
        },
        {
          date: new Date(Date.now() + 172800000).toISOString().split("T")[0],
          maxTemp: 29,
          minTemp: 21,
          humidity: 80,
          rainfall: 8,
          condition: "Cloudy",
        },
      ],
      farmingAdvice: [
        "Good conditions for irrigation today",
        "Expected rainfall in next 2 days - delay watering",
        "High humidity may increase disease risk - monitor crops closely",
      ],
    }

    return NextResponse.json({
      success: true,
      weather: mockWeather,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch weather" }, { status: 500 })
  }
}
