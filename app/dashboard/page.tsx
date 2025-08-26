"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Leaf,
  TrendingUp,
  TrendingDown,
  Bell,
  Cloud,
  Droplets,
  Sun,
  AlertTriangle,
  CheckCircle,
  IndianRupee,
  Calendar,
  MapPin,
  Camera,
  FileText,
  BarChart3,
  RefreshCw,
  User,
} from "lucide-react"

interface DashboardData {
  user: {
    name: string
    location: string
    farmSize: number
    crops: string[]
  }
  recentDetections: Array<{
    id: string
    disease: string
    confidence: number
    severity: string
    cropType: string
    date: string
  }>
  mandiPrices: Array<{
    crop: string
    price: number
    change: number
    market: string
    date: string
  }>
  weather: {
    temperature: number
    humidity: number
    condition: string
    rainfall: number
    forecast: Array<{
      date: string
      condition: string
      maxTemp: number
      minTemp: number
    }>
    farmingAdvice: string[]
  }
  notifications: Array<{
    id: string
    title: string
    message: string
    type: string
    priority: string
    isRead: boolean
    date: string
  }>
  schemes: Array<{
    id: string
    title: string
    category: string
    deadline: string
    status: string
  }>
}

export default function FarmerDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Mock dashboard data - in production, fetch from APIs
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const mockData: DashboardData = {
          user: {
            name: "Rajesh Kumar",
            location: "Punjab, India",
            farmSize: 5.5,
            crops: ["Wheat", "Rice", "Sugarcane"],
          },
          recentDetections: [
            {
              id: "1",
              disease: "Wheat Rust",
              confidence: 0.92,
              severity: "Medium",
              cropType: "Wheat",
              date: "2025-01-26",
            },
            {
              id: "2",
              disease: "Healthy Plant",
              confidence: 0.95,
              severity: "None",
              cropType: "Rice",
              date: "2025-01-25",
            },
          ],
          mandiPrices: [
            { crop: "Wheat", price: 2200, change: 5.2, market: "Karnal Mandi", date: "2025-01-26" },
            { crop: "Rice", price: 3750, change: -2.1, market: "Amritsar Mandi", date: "2025-01-26" },
            { crop: "Sugarcane", price: 300, change: 1.8, market: "Muzaffarnagar Mandi", date: "2025-01-26" },
          ],
          weather: {
            temperature: 18,
            humidity: 65,
            condition: "Partly Cloudy",
            rainfall: 0,
            forecast: [
              { date: "Today", condition: "Partly Cloudy", maxTemp: 22, minTemp: 15 },
              { date: "Tomorrow", condition: "Light Rain", maxTemp: 20, minTemp: 12 },
              { date: "Day 3", condition: "Cloudy", maxTemp: 19, minTemp: 11 },
            ],
            farmingAdvice: [
              "Good conditions for irrigation today",
              "Expected rainfall tomorrow - delay watering",
              "Monitor crops for disease due to high humidity",
            ],
          },
          notifications: [
            {
              id: "1",
              title: "Disease Detected",
              message: "Wheat rust detected in your crop with 92% confidence",
              type: "disease_alert",
              priority: "high",
              isRead: false,
              date: "2025-01-26",
            },
            {
              id: "2",
              title: "Price Alert",
              message: "Wheat prices increased by 5.2% in Karnal Mandi",
              type: "price_update",
              priority: "medium",
              isRead: false,
              date: "2025-01-26",
            },
          ],
          schemes: [
            {
              id: "1",
              title: "PM-KISAN Samman Nidhi",
              category: "Financial Support",
              deadline: "2025-03-31",
              status: "Active",
            },
            {
              id: "2",
              title: "Pradhan Mantri Fasal Bima Yojana",
              category: "Insurance",
              deadline: "2025-04-15",
              status: "Active",
            },
          ],
        }

        setDashboardData(mockData)
      } catch (err) {
        setError("Failed to load dashboard data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
      case "High":
        return "bg-destructive text-destructive-foreground"
      case "Medium":
        return "bg-secondary text-secondary-foreground"
      case "Low":
        return "bg-muted text-muted-foreground"
      case "None":
        return "bg-primary text-primary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground"
      case "medium":
        return "bg-secondary text-secondary-foreground"
      case "low":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sunny":
        return <Sun className="h-6 w-6 text-yellow-500" />
      case "partly cloudy":
        return <Cloud className="h-6 w-6 text-gray-500" />
      case "cloudy":
        return <Cloud className="h-6 w-6 text-gray-600" />
      case "light rain":
      case "rain":
        return <Droplets className="h-6 w-6 text-blue-500" />
      default:
        return <Cloud className="h-6 w-6 text-gray-500" />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Alert variant="destructive" className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error || "Failed to load dashboard"}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Leaf className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold text-foreground">Farmer Dashboard</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {dashboardData.user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell className="h-6 w-6 text-muted-foreground" />
                {dashboardData.notifications.filter((n) => !n.isRead).length > 0 && (
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-xs flex items-center justify-center text-destructive-foreground">
                    {dashboardData.notifications.filter((n) => !n.isRead).length}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{dashboardData.user.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* User Info */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{dashboardData.user.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Farm Size: {dashboardData.user.farmSize} acres</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm">Crops: {dashboardData.user.crops.join(", ")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Last updated: Today</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link href="/disease-detection">
            <Button className="w-full h-20 flex flex-col gap-2 bg-transparent" variant="outline">
              <Camera className="h-6 w-6" />
              <span className="text-sm">Detect Disease</span>
            </Button>
          </Link>
          <Link href="/mandi-prices">
            <Button className="w-full h-20 flex flex-col gap-2 bg-transparent" variant="outline">
              <IndianRupee className="h-6 w-6" />
              <span className="text-sm">Mandi Prices</span>
            </Button>
          </Link>
          <Link href="/government-schemes">
            <Button className="w-full h-20 flex flex-col gap-2 bg-transparent" variant="outline">
              <FileText className="h-6 w-6" />
              <span className="text-sm">Gov Schemes</span>
            </Button>
          </Link>
          <Link href="/analytics">
            <Button className="w-full h-20 flex flex-col gap-2 bg-transparent" variant="outline">
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">Analytics</span>
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Disease Detections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-primary" />
                  Recent Disease Detections
                </CardTitle>
                <CardDescription>Latest AI analysis results for your crops</CardDescription>
              </CardHeader>
              <CardContent>
                {dashboardData.recentDetections.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No recent detections. Upload crop images to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dashboardData.recentDetections.map((detection) => (
                      <div key={detection.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {detection.severity === "None" ? (
                              <CheckCircle className="h-5 w-5 text-primary" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 text-destructive" />
                            )}
                            <div>
                              <p className="font-medium">{detection.disease}</p>
                              <p className="text-sm text-muted-foreground">
                                {detection.cropType} • {Math.round(detection.confidence * 100)}% confidence
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(detection.severity)}>{detection.severity}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(detection.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                    <Link href="/disease-detection">
                      <Button variant="outline" className="w-full bg-transparent">
                        View All Detections
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Mandi Prices */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Today's Mandi Prices
                </CardTitle>
                <CardDescription>Latest market prices for your crops</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.mandiPrices.map((price, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{price.crop}</p>
                        <p className="text-sm text-muted-foreground">{price.market}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <IndianRupee className="h-4 w-4" />
                          <span className="font-medium">{price.price.toLocaleString()}/quintal</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          {price.change > 0 ? (
                            <TrendingUp className="h-3 w-3 text-green-600" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-600" />
                          )}
                          <span className={price.change > 0 ? "text-green-600" : "text-red-600"}>
                            {Math.abs(price.change)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Link href="/mandi-prices">
                    <Button variant="outline" className="w-full bg-transparent">
                      View All Prices
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weather */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getWeatherIcon(dashboardData.weather.condition)}
                  Weather
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">{dashboardData.weather.temperature}°C</div>
                  <div className="text-sm text-muted-foreground">{dashboardData.weather.condition}</div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <span>{dashboardData.weather.humidity}% Humidity</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cloud className="h-4 w-4 text-gray-500" />
                    <span>{dashboardData.weather.rainfall}mm Rain</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">3-Day Forecast</h4>
                  {dashboardData.weather.forecast.map((day, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>{day.date}</span>
                      <div className="flex items-center gap-2">
                        {getWeatherIcon(day.condition)}
                        <span>
                          {day.maxTemp}°/{day.minTemp}°
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Farming Advice</h4>
                  <ul className="text-sm space-y-1">
                    {dashboardData.weather.farmingAdvice.map((advice, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{advice}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dashboardData.notifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No new notifications</p>
                ) : (
                  <div className="space-y-3">
                    {dashboardData.notifications.slice(0, 3).map((notification) => (
                      <div key={notification.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{notification.title}</p>
                            <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                          </div>
                          <Badge className={getPriorityColor(notification.priority)} variant="secondary">
                            {notification.priority}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          {new Date(notification.date).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      View All Notifications
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Government Schemes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Government Schemes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardData.schemes.map((scheme) => (
                    <div key={scheme.id} className="p-3 border rounded-lg">
                      <p className="font-medium text-sm">{scheme.title}</p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge variant="outline" className="text-xs">
                          {scheme.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Deadline: {new Date(scheme.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                  <Link href="/government-schemes">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      View All Schemes
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
