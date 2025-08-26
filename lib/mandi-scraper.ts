import { config } from "./config"
import { Database, type MandiPrice } from "./database"

export interface MandiPriceSource {
  name: string
  url: string
  selector: string
  parser: (html: string) => MandiPriceData[]
}

export interface MandiPriceData {
  crop: string
  variety?: string
  market: string
  state: string
  district?: string
  minPrice: number
  maxPrice: number
  modalPrice: number
  date: string
  unit: string
  source: string
}

export interface PriceAlert {
  userId: string
  crop: string
  state?: string
  market?: string
  alertType: "price_increase" | "price_decrease" | "threshold"
  threshold?: number
  percentage?: number
}

export class MandiScraper {
  private static instance: MandiScraper
  private sources: MandiPriceSource[]
  private lastUpdateTime: Date | null = null
  private isUpdating = false

  private constructor() {
    this.sources = this.initializeSources()
  }

  public static getInstance(): MandiScraper {
    if (!MandiScraper.instance) {
      MandiScraper.instance = new MandiScraper()
    }
    return MandiScraper.instance
  }

  private initializeSources(): MandiPriceSource[] {
    return [
      {
        name: "AgMarkNet",
        url: "https://agmarknet.gov.in/SearchCmmMkt.aspx",
        selector: ".table-responsive table",
        parser: this.parseAgMarkNetData.bind(this),
      },
      {
        name: "eNAM",
        url: "https://enam.gov.in/web/dhanyakothi/home",
        selector: ".price-table",
        parser: this.parseENAMData.bind(this),
      },
      {
        name: "Data.gov.in",
        url: "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070",
        selector: "",
        parser: this.parseDataGovAPI.bind(this),
      },
    ]
  }

  // Mock scraper for AgMarkNet (in production, use actual web scraping)
  private parseAgMarkNetData(html: string): MandiPriceData[] {
    // Simulate parsing AgMarkNet data
    const mockData: MandiPriceData[] = [
      {
        crop: "Wheat",
        variety: "HD-2967",
        market: "Karnal Mandi",
        state: "Haryana",
        district: "Karnal",
        minPrice: 2100,
        maxPrice: 2300,
        modalPrice: 2200,
        date: new Date().toISOString().split("T")[0],
        unit: "per quintal",
        source: "AgMarkNet",
      },
      {
        crop: "Rice",
        variety: "Basmati",
        market: "Amritsar Mandi",
        state: "Punjab",
        district: "Amritsar",
        minPrice: 3500,
        maxPrice: 4000,
        modalPrice: 3750,
        date: new Date().toISOString().split("T")[0],
        unit: "per quintal",
        source: "AgMarkNet",
      },
      {
        crop: "Tomato",
        variety: "Hybrid",
        market: "Delhi Azadpur Mandi",
        state: "Delhi",
        district: "Delhi",
        minPrice: 800,
        maxPrice: 1200,
        modalPrice: 1000,
        date: new Date().toISOString().split("T")[0],
        unit: "per quintal",
        source: "AgMarkNet",
      },
    ]

    return mockData
  }

  // Mock scraper for eNAM
  private parseENAMData(html: string): MandiPriceData[] {
    const mockData: MandiPriceData[] = [
      {
        crop: "Onion",
        variety: "Nasik Red",
        market: "Nashik Mandi",
        state: "Maharashtra",
        district: "Nashik",
        minPrice: 2000,
        maxPrice: 2500,
        modalPrice: 2250,
        date: new Date().toISOString().split("T")[0],
        unit: "per quintal",
        source: "eNAM",
      },
      {
        crop: "Potato",
        variety: "Jyoti",
        market: "Agra Mandi",
        state: "Uttar Pradesh",
        district: "Agra",
        minPrice: 1200,
        maxPrice: 1500,
        modalPrice: 1350,
        date: new Date().toISOString().split("T")[0],
        unit: "per quintal",
        source: "eNAM",
      },
    ]

    return mockData
  }

  // Mock API parser for Data.gov.in
  private parseDataGovAPI(jsonData: string): MandiPriceData[] {
    try {
      // In production, parse actual API response
      const mockData: MandiPriceData[] = [
        {
          crop: "Cotton",
          variety: "Shankar-6",
          market: "Guntur Mandi",
          state: "Andhra Pradesh",
          district: "Guntur",
          minPrice: 5800,
          maxPrice: 6200,
          modalPrice: 6000,
          date: new Date().toISOString().split("T")[0],
          unit: "per quintal",
          source: "Data.gov.in",
        },
        {
          crop: "Sugarcane",
          variety: "Co-86032",
          market: "Muzaffarnagar Mandi",
          state: "Uttar Pradesh",
          district: "Muzaffarnagar",
          minPrice: 280,
          maxPrice: 320,
          modalPrice: 300,
          date: new Date().toISOString().split("T")[0],
          unit: "per quintal",
          source: "Data.gov.in",
        },
      ]

      return mockData
    } catch (error) {
      console.error("Error parsing Data.gov.in API:", error)
      return []
    }
  }

  // Fetch data from a single source
  private async fetchFromSource(source: MandiPriceSource): Promise<MandiPriceData[]> {
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))

      // In production, use actual HTTP requests
      // const response = await fetch(source.url)
      // const html = await response.text()
      // return source.parser(html)

      // For now, return mock data based on source
      if (source.name === "AgMarkNet") {
        return this.parseAgMarkNetData("")
      } else if (source.name === "eNAM") {
        return this.parseENAMData("")
      } else if (source.name === "Data.gov.in") {
        return this.parseDataGovAPI("")
      }

      return []
    } catch (error) {
      console.error(`Error fetching from ${source.name}:`, error)
      return []
    }
  }

  // Update all mandi prices from all sources
  public async updateAllPrices(): Promise<{
    success: boolean
    totalUpdated: number
    errors: string[]
    sources: string[]
  }> {
    if (this.isUpdating) {
      return {
        success: false,
        totalUpdated: 0,
        errors: ["Update already in progress"],
        sources: [],
      }
    }

    this.isUpdating = true
    const errors: string[] = []
    const sources: string[] = []
    let totalUpdated = 0

    try {
      // Fetch from all sources concurrently
      const promises = this.sources.map(async (source) => {
        try {
          const data = await this.fetchFromSource(source)
          sources.push(source.name)
          return data
        } catch (error) {
          errors.push(`${source.name}: ${error instanceof Error ? error.message : "Unknown error"}`)
          return []
        }
      })

      const results = await Promise.all(promises)
      const allPriceData = results.flat()

      // Save to database
      for (const priceData of allPriceData) {
        try {
          await Database.createPrice({
            crop: priceData.crop,
            variety: priceData.variety,
            market: priceData.market,
            state: priceData.state,
            district: priceData.district,
            minPrice: priceData.minPrice,
            maxPrice: priceData.maxPrice,
            modalPrice: priceData.modalPrice,
            priceDate: priceData.date,
            unit: priceData.unit,
            source: priceData.source,
          })
          totalUpdated++
        } catch (error) {
          errors.push(
            `Database error for ${priceData.crop}: ${error instanceof Error ? error.message : "Unknown error"}`,
          )
        }
      }

      this.lastUpdateTime = new Date()

      // Log analytics event
      await Database.logEvent({
        eventType: "mandi_price_update",
        eventData: {
          totalUpdated,
          sources: sources.length,
          errors: errors.length,
          updateTime: this.lastUpdateTime.toISOString(),
        },
      })

      return {
        success: errors.length === 0,
        totalUpdated,
        errors,
        sources,
      }
    } finally {
      this.isUpdating = false
    }
  }

  // Get price trends for a specific crop
  public async getPriceTrends(
    crop: string,
    days = 30,
  ): Promise<{
    crop: string
    currentPrice: number
    previousPrice: number
    change: number
    changePercentage: number
    trend: "up" | "down" | "stable"
    history: Array<{ date: string; price: number }>
  }> {
    const prices = await Database.getPricesByCrop(crop)

    if (prices.length === 0) {
      throw new Error(`No price data found for ${crop}`)
    }

    // Sort by date
    const sortedPrices = prices.sort((a, b) => new Date(b.priceDate).getTime() - new Date(a.priceDate).getTime())

    const currentPrice = sortedPrices[0].modalPrice
    const previousPrice = sortedPrices[1]?.modalPrice || currentPrice

    const change = currentPrice - previousPrice
    const changePercentage = previousPrice > 0 ? (change / previousPrice) * 100 : 0

    let trend: "up" | "down" | "stable" = "stable"
    if (Math.abs(changePercentage) > 2) {
      trend = changePercentage > 0 ? "up" : "down"
    }

    const history = sortedPrices.slice(0, days).map((price) => ({
      date: price.priceDate,
      price: price.modalPrice,
    }))

    return {
      crop,
      currentPrice,
      previousPrice,
      change,
      changePercentage,
      trend,
      history,
    }
  }

  // Compare prices across markets
  public async comparePricesAcrossMarkets(crop: string): Promise<{
    crop: string
    markets: Array<{
      market: string
      state: string
      price: number
      date: string
      rank: number
    }>
    highestPrice: { market: string; price: number }
    lowestPrice: { market: string; price: number }
    averagePrice: number
  }> {
    const prices = await Database.getPricesByCrop(crop)

    if (prices.length === 0) {
      throw new Error(`No price data found for ${crop}`)
    }

    // Get latest price for each market
    const marketPrices = new Map<string, MandiPrice>()
    for (const price of prices) {
      const key = `${price.market}-${price.state}`
      const existing = marketPrices.get(key)
      if (!existing || new Date(price.priceDate) > new Date(existing.priceDate)) {
        marketPrices.set(key, price)
      }
    }

    const markets = Array.from(marketPrices.values())
      .map((price) => ({
        market: price.market,
        state: price.state,
        price: price.modalPrice,
        date: price.priceDate,
        rank: 0,
      }))
      .sort((a, b) => b.price - a.price)
      .map((market, index) => ({ ...market, rank: index + 1 }))

    const highestPrice = { market: markets[0].market, price: markets[0].price }
    const lowestPrice = { market: markets[markets.length - 1].market, price: markets[markets.length - 1].price }
    const averagePrice = markets.reduce((sum, market) => sum + market.price, 0) / markets.length

    return {
      crop,
      markets,
      highestPrice,
      lowestPrice,
      averagePrice,
    }
  }

  // Get price alerts for users
  public async checkPriceAlerts(): Promise<{
    alertsTriggered: number
    notifications: Array<{
      userId: string
      message: string
      type: string
    }>
  }> {
    // Mock price alerts - in production, fetch from database
    const mockAlerts: PriceAlert[] = [
      {
        userId: "user_001",
        crop: "Wheat",
        state: "Punjab",
        alertType: "price_increase",
        percentage: 10,
      },
      {
        userId: "user_002",
        crop: "Tomato",
        alertType: "threshold",
        threshold: 1200,
      },
    ]

    const notifications: Array<{ userId: string; message: string; type: string }> = []

    for (const alert of mockAlerts) {
      const prices = await Database.getPricesByCrop(alert.crop)
      if (prices.length === 0) continue

      const latestPrice = prices.sort((a, b) => new Date(b.priceDate).getTime() - new Date(a.priceDate).getTime())[0]

      let shouldAlert = false
      let message = ""

      if (alert.alertType === "threshold" && alert.threshold) {
        if (latestPrice.modalPrice >= alert.threshold) {
          shouldAlert = true
          message = `${alert.crop} price has reached ₹${latestPrice.modalPrice}/quintal, crossing your threshold of ₹${alert.threshold}/quintal`
        }
      } else if (alert.alertType === "price_increase" && alert.percentage) {
        // Check if price increased by specified percentage
        const previousPrices = prices.slice(1, 8) // Last 7 days
        if (previousPrices.length > 0) {
          const avgPreviousPrice = previousPrices.reduce((sum, p) => sum + p.modalPrice, 0) / previousPrices.length
          const increasePercentage = ((latestPrice.modalPrice - avgPreviousPrice) / avgPreviousPrice) * 100

          if (increasePercentage >= alert.percentage) {
            shouldAlert = true
            message = `${alert.crop} price increased by ${increasePercentage.toFixed(1)}% to ₹${latestPrice.modalPrice}/quintal`
          }
        }
      }

      if (shouldAlert) {
        notifications.push({
          userId: alert.userId,
          message,
          type: "price_update",
        })

        // Create notification in database
        await Database.createNotification({
          userId: alert.userId,
          title: `Price Alert: ${alert.crop}`,
          message,
          type: "price_update",
          isRead: false,
          priority: "medium",
        })
      }
    }

    return {
      alertsTriggered: notifications.length,
      notifications,
    }
  }

  // Get update status
  public getUpdateStatus(): {
    isUpdating: boolean
    lastUpdateTime: Date | null
    nextUpdateTime: Date | null
  } {
    const nextUpdateTime = this.lastUpdateTime
      ? new Date(this.lastUpdateTime.getTime() + config.apis.mandi.updateInterval)
      : null

    return {
      isUpdating: this.isUpdating,
      lastUpdateTime: this.lastUpdateTime,
      nextUpdateTime,
    }
  }
}
