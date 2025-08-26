// Configuration file for the Smart Crop Support System

export const config = {
  // Database configuration
  database: {
    type: process.env.DB_TYPE || "postgresql",
    host: process.env.DB_HOST || "localhost",
    port: Number.parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "smart_crop_system",
  },

  // AI/ML configuration
  ai: {
    modelPath: process.env.AI_MODEL_PATH || "/models/crop_disease_model.h5",
    confidenceThreshold: Number.parseFloat(process.env.AI_CONFIDENCE_THRESHOLD || "0.7"),
    maxImageSize: Number.parseInt(process.env.MAX_IMAGE_SIZE || "5242880"), // 5MB
    supportedFormats: ["jpg", "jpeg", "png", "webp"],
  },

  // External APIs
  apis: {
    weather: {
      provider: process.env.WEATHER_PROVIDER || "openweathermap",
      apiKey: process.env.WEATHER_API_KEY || "",
      baseUrl: process.env.WEATHER_API_URL || "https://api.openweathermap.org/data/2.5",
    },
    mandi: {
      baseUrl: process.env.MANDI_API_URL || "https://api.data.gov.in/resource",
      apiKey: process.env.MANDI_API_KEY || "",
      updateInterval: Number.parseInt(process.env.MANDI_UPDATE_INTERVAL || "3600000"), // 1 hour
    },
    schemes: {
      baseUrl: process.env.SCHEMES_API_URL || "https://www.india.gov.in/api",
      updateInterval: Number.parseInt(process.env.SCHEMES_UPDATE_INTERVAL || "86400000"), // 24 hours
    },
  },

  // File upload configuration
  upload: {
    maxFileSize: Number.parseInt(process.env.MAX_FILE_SIZE || "10485760"), // 10MB
    allowedTypes: ["image/jpeg", "image/png", "image/webp"],
    uploadPath: process.env.UPLOAD_PATH || "./uploads",
  },

  // Security configuration
  security: {
    jwtSecret: process.env.JWT_SECRET || "your-super-secret-jwt-key",
    jwtExpiry: process.env.JWT_EXPIRY || "7d",
    bcryptRounds: Number.parseInt(process.env.BCRYPT_ROUNDS || "12"),
    rateLimitWindow: Number.parseInt(process.env.RATE_LIMIT_WINDOW || "900000"), // 15 minutes
    rateLimitMax: Number.parseInt(process.env.RATE_LIMIT_MAX || "100"),
  },

  // Application configuration
  app: {
    port: Number.parseInt(process.env.PORT || "3000"),
    environment: process.env.NODE_ENV || "development",
    logLevel: process.env.LOG_LEVEL || "info",
    corsOrigins: process.env.CORS_ORIGINS?.split(",") || ["http://localhost:3000"],
  },

  // Notification configuration
  notifications: {
    email: {
      provider: process.env.EMAIL_PROVIDER || "smtp",
      host: process.env.SMTP_HOST || "",
      port: Number.parseInt(process.env.SMTP_PORT || "587"),
      username: process.env.SMTP_USERNAME || "",
      password: process.env.SMTP_PASSWORD || "",
    },
    sms: {
      provider: process.env.SMS_PROVIDER || "twilio",
      accountSid: process.env.TWILIO_ACCOUNT_SID || "",
      authToken: process.env.TWILIO_AUTH_TOKEN || "",
      fromNumber: process.env.TWILIO_FROM_NUMBER || "",
    },
    push: {
      fcmServerKey: process.env.FCM_SERVER_KEY || "",
    },
  },

  // Supported languages
  languages: {
    supported: ["en", "hi", "pa", "bn", "ta", "te", "mr", "gu"],
    default: "en",
  },

  // Crop categories and types
  crops: {
    categories: ["Cereals", "Pulses", "Oilseeds", "Vegetables", "Fruits", "Spices", "Cash Crops"],
    types: [
      "Rice",
      "Wheat",
      "Maize",
      "Barley",
      "Millet",
      "Lentil",
      "Chickpea",
      "Pigeon Pea",
      "Black Gram",
      "Soybean",
      "Groundnut",
      "Mustard",
      "Sunflower",
      "Tomato",
      "Potato",
      "Onion",
      "Cabbage",
      "Cauliflower",
      "Mango",
      "Banana",
      "Apple",
      "Orange",
      "Grapes",
      "Turmeric",
      "Chili",
      "Coriander",
      "Cumin",
      "Cotton",
      "Sugarcane",
      "Tobacco",
      "Jute",
    ],
  },
}

export default config
