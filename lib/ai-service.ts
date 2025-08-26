import { config } from "./config"

export interface DiseaseDetectionResult {
  disease: string
  confidence: number
  description: string
  treatment: string
  severity: "None" | "Low" | "Medium" | "High" | "Critical"
  preventiveMeasures: string[]
  affectedCrops: string[]
  symptoms: string[]
}

export interface CropDiseaseDatabase {
  [key: string]: {
    name: string
    description: string
    treatment: string
    severity: "None" | "Low" | "Medium" | "High" | "Critical"
    preventiveMeasures: string[]
    affectedCrops: string[]
    symptoms: string[]
    imageFeatures: string[] // Mock features for pattern matching
  }
}

// Comprehensive crop disease database
const DISEASE_DATABASE: CropDiseaseDatabase = {
  tomato_late_blight: {
    name: "Tomato Late Blight",
    description: "A serious fungal disease that affects tomato plants, causing dark lesions on leaves and stems",
    treatment:
      "Apply copper-based fungicide (Copper oxychloride 50% WP @ 3g/liter). Remove affected parts and improve air circulation. Avoid overhead watering.",
    severity: "High",
    preventiveMeasures: [
      "Plant resistant varieties",
      "Ensure proper spacing for air circulation",
      "Avoid overhead irrigation",
      "Remove plant debris",
      "Apply preventive fungicide sprays",
    ],
    affectedCrops: ["Tomato", "Potato", "Eggplant"],
    symptoms: ["Dark water-soaked lesions", "White fuzzy growth on leaf undersides", "Brown spots on fruits"],
    imageFeatures: ["dark_spots", "water_soaked_lesions", "leaf_browning"],
  },
  wheat_rust: {
    name: "Wheat Rust",
    description: "Fungal disease causing orange-red pustules on wheat leaves and stems",
    treatment:
      "Spray Propiconazole 25% EC @ 1ml/liter or Tebuconazole 10% + Sulphur 65% WG @ 2g/liter. Apply at early infection stage.",
    severity: "Medium",
    preventiveMeasures: [
      "Use resistant wheat varieties",
      "Proper crop rotation",
      "Timely sowing",
      "Balanced fertilization",
      "Monitor weather conditions",
    ],
    affectedCrops: ["Wheat", "Barley", "Oats"],
    symptoms: ["Orange-red pustules", "Yellow streaks", "Premature leaf drying"],
    imageFeatures: ["orange_pustules", "rust_spots", "leaf_yellowing"],
  },
  rice_blast: {
    name: "Rice Blast",
    description: "Fungal disease causing diamond-shaped lesions on rice leaves",
    treatment: "Apply Tricyclazole 75% WP @ 0.6g/liter or Carbendazim 50% WP @ 1g/liter. Ensure proper drainage.",
    severity: "High",
    preventiveMeasures: [
      "Use certified disease-free seeds",
      "Maintain proper water management",
      "Avoid excessive nitrogen fertilization",
      "Plant resistant varieties",
      "Remove infected plant debris",
    ],
    affectedCrops: ["Rice"],
    symptoms: ["Diamond-shaped lesions", "Gray centers with brown borders", "Neck rot in severe cases"],
    imageFeatures: ["diamond_lesions", "gray_spots", "brown_borders"],
  },
  potato_early_blight: {
    name: "Potato Early Blight",
    description: "Fungal disease causing concentric ring spots on potato leaves",
    treatment: "Apply Mancozeb 75% WP @ 2g/liter or Chlorothalonil 75% WP @ 2g/liter. Remove affected foliage.",
    severity: "Medium",
    preventiveMeasures: [
      "Crop rotation with non-solanaceous crops",
      "Proper plant spacing",
      "Avoid overhead irrigation",
      "Remove volunteer plants",
      "Use certified seed potatoes",
    ],
    affectedCrops: ["Potato", "Tomato"],
    symptoms: ["Concentric ring spots", "Target-like lesions", "Yellowing of lower leaves"],
    imageFeatures: ["concentric_rings", "target_spots", "yellowing_leaves"],
  },
  healthy_plant: {
    name: "Healthy Plant",
    description: "Plant appears healthy with no visible signs of disease",
    treatment: "Continue regular monitoring and maintain good agricultural practices. No treatment required.",
    severity: "None",
    preventiveMeasures: [
      "Regular monitoring",
      "Proper nutrition",
      "Adequate watering",
      "Good sanitation practices",
      "Preventive care",
    ],
    affectedCrops: ["All crops"],
    symptoms: ["Green healthy foliage", "Normal growth pattern", "No visible lesions"],
    imageFeatures: ["healthy_green", "normal_texture", "no_spots"],
  },
}

export class AIService {
  private static instance: AIService
  private diseaseDatabase: CropDiseaseDatabase

  private constructor() {
    this.diseaseDatabase = DISEASE_DATABASE
  }

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService()
    }
    return AIService.instance
  }

  // Mock image analysis - in production, this would use TensorFlow/PyTorch
  private async analyzeImageFeatures(imageBuffer: Buffer): Promise<string[]> {
    // Simulate image processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock feature extraction based on image characteristics
    const imageSize = imageBuffer.length
    const mockFeatures: string[] = []

    // Simulate different features based on image properties
    if (imageSize > 500000) {
      mockFeatures.push("high_resolution", "detailed_texture")
    }

    // Random feature detection for demo purposes
    const possibleFeatures = [
      "dark_spots",
      "water_soaked_lesions",
      "leaf_browning",
      "orange_pustules",
      "rust_spots",
      "leaf_yellowing",
      "diamond_lesions",
      "gray_spots",
      "brown_borders",
      "concentric_rings",
      "target_spots",
      "yellowing_leaves",
      "healthy_green",
      "normal_texture",
      "no_spots",
    ]

    // Add 2-4 random features for simulation
    const numFeatures = Math.floor(Math.random() * 3) + 2
    for (let i = 0; i < numFeatures; i++) {
      const randomFeature = possibleFeatures[Math.floor(Math.random() * possibleFeatures.length)]
      if (!mockFeatures.includes(randomFeature)) {
        mockFeatures.push(randomFeature)
      }
    }

    return mockFeatures
  }

  // Match detected features with disease database
  private matchDisease(features: string[]): { diseaseKey: string; confidence: number } {
    let bestMatch = { diseaseKey: "healthy_plant", confidence: 0.5 }

    for (const [diseaseKey, diseaseInfo] of Object.entries(this.diseaseDatabase)) {
      const matchingFeatures = features.filter((feature) => diseaseInfo.imageFeatures.includes(feature))

      const confidence = matchingFeatures.length / diseaseInfo.imageFeatures.length

      if (confidence > bestMatch.confidence) {
        bestMatch = { diseaseKey, confidence }
      }
    }

    // Add some randomness for more realistic results
    bestMatch.confidence = Math.min(0.95, bestMatch.confidence + Math.random() * 0.2)

    return bestMatch
  }

  // Main disease detection method
  public async detectDisease(
    imageBuffer: Buffer,
    cropType?: string,
    location?: string,
  ): Promise<DiseaseDetectionResult> {
    try {
      // Validate image size
      if (imageBuffer.length > config.ai.maxImageSize) {
        throw new Error("Image size exceeds maximum allowed size")
      }

      // Extract features from image
      const features = await this.analyzeImageFeatures(imageBuffer)

      // Match with disease database
      const match = this.matchDisease(features)

      // Get disease information
      const diseaseInfo = this.diseaseDatabase[match.diseaseKey]

      // Filter affected crops if crop type is specified
      const relevantCrops = diseaseInfo.affectedCrops
      if (cropType) {
        const isRelevant = diseaseInfo.affectedCrops.some(
          (crop) =>
            crop.toLowerCase().includes(cropType.toLowerCase()) || cropType.toLowerCase().includes(crop.toLowerCase()),
        )

        if (!isRelevant && match.diseaseKey !== "healthy_plant") {
          // If disease doesn't affect the specified crop, reduce confidence
          match.confidence *= 0.6
        }
      }

      // Adjust confidence based on location-specific factors
      if (location && match.confidence > 0.8) {
        // Simulate location-based disease prevalence
        const locationFactors = {
          punjab: ["wheat_rust", "rice_blast"],
          haryana: ["wheat_rust", "tomato_late_blight"],
          "uttar pradesh": ["potato_early_blight", "wheat_rust"],
          maharashtra: ["tomato_late_blight", "potato_early_blight"],
        }

        const locationKey = location.toLowerCase()
        for (const [region, commonDiseases] of Object.entries(locationFactors)) {
          if (locationKey.includes(region) && commonDiseases.includes(match.diseaseKey)) {
            match.confidence = Math.min(0.95, match.confidence + 0.1)
            break
          }
        }
      }

      return {
        disease: diseaseInfo.name,
        confidence: Math.round(match.confidence * 100) / 100,
        description: diseaseInfo.description,
        treatment: diseaseInfo.treatment,
        severity: diseaseInfo.severity,
        preventiveMeasures: diseaseInfo.preventiveMeasures,
        affectedCrops: diseaseInfo.affectedCrops,
        symptoms: diseaseInfo.symptoms,
      }
    } catch (error) {
      throw new Error(`Disease detection failed: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  // Get disease information by name
  public getDiseaseInfo(diseaseName: string): DiseaseDetectionResult | null {
    const diseaseKey = Object.keys(this.diseaseDatabase).find(
      (key) => this.diseaseDatabase[key].name.toLowerCase() === diseaseName.toLowerCase(),
    )

    if (!diseaseKey) return null

    const diseaseInfo = this.diseaseDatabase[diseaseKey]
    return {
      disease: diseaseInfo.name,
      confidence: 1.0,
      description: diseaseInfo.description,
      treatment: diseaseInfo.treatment,
      severity: diseaseInfo.severity,
      preventiveMeasures: diseaseInfo.preventiveMeasures,
      affectedCrops: diseaseInfo.affectedCrops,
      symptoms: diseaseInfo.symptoms,
    }
  }

  // Get all supported diseases
  public getSupportedDiseases(): string[] {
    return Object.values(this.diseaseDatabase).map((disease) => disease.name)
  }

  // Get diseases by crop type
  public getDiseasesByCrop(cropType: string): string[] {
    return Object.values(this.diseaseDatabase)
      .filter((disease) => disease.affectedCrops.some((crop) => crop.toLowerCase().includes(cropType.toLowerCase())))
      .map((disease) => disease.name)
  }
}
