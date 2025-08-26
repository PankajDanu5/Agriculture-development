export interface User {
  id: string
  email: string
  passwordHash: string
  name: string
  phone?: string
  location?: string
  farmSize?: number // in acres
  crops?: string[]
  role: "farmer" | "admin"
  languagePreference: string
  createdAt: Date
  updatedAt: Date
}

export interface DiseaseDetection {
  id: string
  userId: string
  imageUrl: string
  imageFilename?: string
  disease: string
  confidence: number
  treatment: string
  severity: "None" | "Low" | "Medium" | "High" | "Critical"
  cropType?: string
  location?: string
  createdAt: Date
}

export interface MandiPrice {
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
  createdAt: Date
  updatedAt: Date
}

export interface GovernmentScheme {
  id: string
  title: string
  description: string
  eligibility: string
  benefits: string
  applicationProcess: string
  deadline?: string
  status: "Active" | "Inactive" | "Expired"
  category: string
  targetStates?: string[]
  officialUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface WeatherData {
  id: string
  location: string
  latitude?: number
  longitude?: number
  temperature: number
  humidity: number
  windSpeed: number
  rainfall: number
  condition: string
  uvIndex: number
  forecastData: WeatherForecast[]
  farmingAdvice: string[]
  dataDate: string
  createdAt: Date
}

export interface WeatherForecast {
  date: string
  maxTemp: number
  minTemp: number
  humidity: number
  rainfall: number
  condition: string
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  type: "disease_alert" | "price_update" | "scheme_update" | "weather_alert" | "general"
  isRead: boolean
  priority: "low" | "medium" | "high"
  createdAt: Date
}

export interface AnalyticsEvent {
  id: string
  userId?: string
  eventType: string
  eventData?: Record<string, any>
  ipAddress?: string
  userAgent?: string
  createdAt: Date
}

export class Database {
  static users: User[] = []
  static detections: DiseaseDetection[] = []
  static prices: MandiPrice[] = []
  static schemes: GovernmentScheme[] = []
  static weather: WeatherData[] = []
  static notifications: Notification[] = []
  static analytics: AnalyticsEvent[] = []

  // User operations
  static async createUser(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const user: User = {
      ...userData,
      id: `user_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.users.push(user)
    return user
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    return this.users.find((user) => user.email === email) || null
  }

  static async getUserById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null
  }

  static async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const userIndex = this.users.findIndex((user) => user.id === id)
    if (userIndex === -1) return null

    this.users[userIndex] = { ...this.users[userIndex], ...updates, updatedAt: new Date() }
    return this.users[userIndex]
  }

  // Disease detection operations
  static async createDetection(detectionData: Omit<DiseaseDetection, "id" | "createdAt">): Promise<DiseaseDetection> {
    const detection: DiseaseDetection = {
      ...detectionData,
      id: `detect_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    }
    this.detections.push(detection)
    return detection
  }

  static async getDetectionsByUser(userId: string): Promise<DiseaseDetection[]> {
    return this.detections.filter((detection) => detection.userId === userId)
  }

  static async getRecentDetections(limit = 10): Promise<DiseaseDetection[]> {
    return this.detections.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, limit)
  }

  // Mandi price operations
  static async createPrice(priceData: Omit<MandiPrice, "id" | "createdAt" | "updatedAt">): Promise<MandiPrice> {
    const price: MandiPrice = {
      ...priceData,
      id: `price_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.prices.push(price)
    return price
  }

  static async getPricesByCrop(crop: string): Promise<MandiPrice[]> {
    return this.prices.filter((price) => price.crop.toLowerCase().includes(crop.toLowerCase()))
  }

  static async getPricesByState(state: string): Promise<MandiPrice[]> {
    return this.prices.filter((price) => price.state.toLowerCase().includes(state.toLowerCase()))
  }

  // Government scheme operations
  static async createScheme(
    schemeData: Omit<GovernmentScheme, "id" | "createdAt" | "updatedAt">,
  ): Promise<GovernmentScheme> {
    const scheme: GovernmentScheme = {
      ...schemeData,
      id: `scheme_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.schemes.push(scheme)
    return scheme
  }

  static async getActiveSchemes(): Promise<GovernmentScheme[]> {
    return this.schemes.filter((scheme) => scheme.status === "Active")
  }

  static async getSchemesByCategory(category: string): Promise<GovernmentScheme[]> {
    return this.schemes.filter((scheme) => scheme.category === category)
  }

  // Notification operations
  static async createNotification(notificationData: Omit<Notification, "id" | "createdAt">): Promise<Notification> {
    const notification: Notification = {
      ...notificationData,
      id: `notif_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    }
    this.notifications.push(notification)
    return notification
  }

  static async getNotificationsByUser(userId: string, unreadOnly = false): Promise<Notification[]> {
    let userNotifications = this.notifications.filter((notif) => notif.userId === userId)
    if (unreadOnly) {
      userNotifications = userNotifications.filter((notif) => !notif.isRead)
    }
    return userNotifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  static async markNotificationAsRead(id: string): Promise<boolean> {
    const notificationIndex = this.notifications.findIndex((notif) => notif.id === id)
    if (notificationIndex === -1) return false

    this.notifications[notificationIndex].isRead = true
    return true
  }

  // Analytics operations
  static async logEvent(eventData: Omit<AnalyticsEvent, "id" | "createdAt">): Promise<AnalyticsEvent> {
    const event: AnalyticsEvent = {
      ...eventData,
      id: `event_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    }
    this.analytics.push(event)
    return event
  }

  static async getAnalyticsByType(eventType: string, days = 30): Promise<AnalyticsEvent[]> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - days)

    return this.analytics.filter((event) => event.eventType === eventType && event.createdAt >= cutoffDate)
  }

  // Utility methods
  static async getDashboardStats(): Promise<{
    totalUsers: number
    totalDetections: number
    totalPrices: number
    activeSchemes: number
    recentDetections: number
  }> {
    const recentDate = new Date()
    recentDate.setDate(recentDate.getDate() - 7)

    return {
      totalUsers: this.users.length,
      totalDetections: this.detections.length,
      totalPrices: this.prices.length,
      activeSchemes: this.schemes.filter((s) => s.status === "Active").length,
      recentDetections: this.detections.filter((d) => d.createdAt >= recentDate).length,
    }
  }
}
