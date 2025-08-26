"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Search,
  Filter,
  MapPin,
  Calendar,
  IndianRupee,
  BarChart3,
} from "lucide-react"

interface MandiPrice {
  id: string
  crop: string
  variety?: string
  market: string
  state: string
  district?: string
  minPrice: number
  maxPrice: number
  modalPrice: number
  priceDate: string
  unit: string
  source?: string
}

interface PriceFilters {
  crops: string[]
  states: string[]
  markets: string[]
}

export default function MandiPricesPage() {
  const [prices, setPrices] = useState<MandiPrice[]>([])
  const [filteredPrices, setFilteredPrices] = useState<MandiPrice[]>([])
  const [filters, setFilters] = useState<PriceFilters>({ crops: [], states: [], markets: [] })
  const [selectedCrop, setSelectedCrop] = useState("all")
  const [selectedState, setSelectedState] = useState("all")
  const [selectedMarket, setSelectedMarket] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Fetch mandi prices
  const fetchPrices = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams({
        crop: selectedCrop,
        state: selectedState,
        market: selectedMarket,
        limit: "100",
      })

      const response = await fetch(`/api/mandi-prices?${params}`)
      const data = await response.json()

      if (data.success) {
        setPrices(data.prices)
        setFilters(data.filters)
        setLastUpdated(data.lastUpdated)
      } else {
        setError(data.message || "Failed to fetch prices")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Trigger manual price update
  const updatePrices = async () => {
    try {
      setIsUpdating(true)
      setError(null)

      const response = await fetch("/api/mandi-prices", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        // Refresh the prices after update
        await fetchPrices()
      } else {
        setError(data.message || "Update failed")
      }
    } catch (err) {
      setError("Update failed. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  // Filter prices based on search term
  useEffect(() => {
    let filtered = prices

    if (searchTerm) {
      filtered = filtered.filter(
        (price) =>
          price.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
          price.market.toLowerCase().includes(searchTerm.toLowerCase()) ||
          price.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (price.variety && price.variety.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    setFilteredPrices(filtered)
  }, [prices, searchTerm])

  // Load prices on component mount and filter changes
  useEffect(() => {
    fetchPrices()
  }, [selectedCrop, selectedState, selectedMarket])

  // Get price trend indicator
  const getPriceTrend = (price: MandiPrice) => {
    // Mock trend calculation - in production, compare with historical data
    const variation = ((price.maxPrice - price.minPrice) / price.modalPrice) * 100

    if (variation > 15) {
      return { icon: <TrendingUp className="h-4 w-4 text-green-600" />, trend: "up", color: "text-green-600" }
    } else if (variation < 5) {
      return { icon: <TrendingDown className="h-4 w-4 text-red-600" />, trend: "down", color: "text-red-600" }
    } else {
      return { icon: <Minus className="h-4 w-4 text-gray-600" />, trend: "stable", color: "text-gray-600" }
    }
  }

  // Format price with currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-2">Mandi Prices</h1>
        <p className="text-gray-600">Real-time market prices from mandis across India</p>
        {lastUpdated && (
          <p className="text-sm text-gray-500 mt-1">Last updated: {new Date(lastUpdated).toLocaleString("en-IN")}</p>
        )}
      </div>

      {/* Controls */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search crops, markets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Crop Filter */}
            <div className="space-y-2">
              <Label>Crop</Label>
              <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                <SelectTrigger>
                  <SelectValue placeholder="All crops" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Crops</SelectItem>
                  {filters.crops.map((crop) => (
                    <SelectItem key={crop} value={crop}>
                      {crop}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* State Filter */}
            <div className="space-y-2">
              <Label>State</Label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="All states" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {filters.states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Market Filter */}
            <div className="space-y-2">
              <Label>Market</Label>
              <Select value={selectedMarket} onValueChange={setSelectedMarket}>
                <SelectTrigger>
                  <SelectValue placeholder="All markets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Markets</SelectItem>
                  {filters.markets.map((market) => (
                    <SelectItem key={market} value={market}>
                      {market}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Update Button */}
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button onClick={updatePrices} disabled={isUpdating} className="w-full">
                {isUpdating ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Update Prices
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Prices Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Market Prices
          </CardTitle>
          <CardDescription>
            Showing {filteredPrices.length} of {prices.length} price records
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Loading mandi prices...</p>
            </div>
          ) : filteredPrices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No price data found for the selected filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Crop</TableHead>
                    <TableHead>Variety</TableHead>
                    <TableHead>Market</TableHead>
                    <TableHead>State</TableHead>
                    <TableHead>Price Range</TableHead>
                    <TableHead>Modal Price</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrices.map((price) => {
                    const trend = getPriceTrend(price)
                    return (
                      <TableRow key={price.id}>
                        <TableCell className="font-medium">{price.crop}</TableCell>
                        <TableCell>{price.variety || "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            {price.market}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{price.state}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>
                              {formatPrice(price.minPrice)} - {formatPrice(price.maxPrice)}
                            </div>
                            <div className="text-gray-500">{price.unit}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 font-medium">
                            <IndianRupee className="h-3 w-3" />
                            {price.modalPrice.toLocaleString("en-IN")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            {formatDate(price.priceDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className={`flex items-center gap-1 ${trend.color}`}>
                            {trend.icon}
                            <span className="text-xs capitalize">{trend.trend}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
