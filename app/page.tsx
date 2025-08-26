import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, TrendingUp, Bell, BarChart3 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-green-800">CropCare AI</h1>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline">Farmer Dashboard</Button>
            </Link>
            <Link href="/admin">
              <Button>Admin Panel</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">AI-Powered Smart Crop Support System</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Empowering farmers with AI-driven disease detection, real-time mandi prices, and government scheme updates to
          increase productivity and income.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/dashboard">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Get Started
            </Button>
          </Link>
          <Link href="/disease-detection">
            <Button size="lg" variant="outline">
              Try Disease Detection
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Key Features</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Leaf className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>Disease Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Upload crop images to detect diseases using AI and get treatment recommendations.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Mandi Prices</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Get real-time market prices for your crops from nearby mandis.</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Bell className="h-12 w-12 text-orange-600 mb-4" />
              <CardTitle>Government Schemes</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Stay updated with latest government schemes and subsidies for farmers.</CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>Analytics Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Track farming trends and make data-driven decisions for better yields.</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 CropCare AI - Smart Crop Support System. Built for farmers, by developers.</p>
        </div>
      </footer>
    </div>
  )
}
