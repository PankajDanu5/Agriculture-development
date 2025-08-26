import { Database, type GovernmentScheme } from "./database"

export interface SchemeEligibility {
  isEligible: boolean
  reasons: string[]
  requirements: string[]
  documents: string[]
  applicationSteps: string[]
}

export interface SchemeApplication {
  id: string
  userId: string
  schemeId: string
  status: "draft" | "submitted" | "under_review" | "approved" | "rejected"
  submittedAt?: Date
  documents: Array<{
    type: string
    filename: string
    url: string
    uploadedAt: Date
  }>
  notes?: string
  reviewedAt?: Date
  reviewedBy?: string
}

export interface SchemeCategory {
  name: string
  description: string
  icon: string
  schemes: GovernmentScheme[]
}

export class SchemesService {
  private static instance: SchemesService

  private constructor() {}

  public static getInstance(): SchemesService {
    if (!SchemesService.instance) {
      SchemesService.instance = new SchemesService()
    }
    return SchemesService.instance
  }

  // Check eligibility for a specific scheme
  public async checkEligibility(
    schemeId: string,
    userProfile: {
      farmSize?: number
      crops?: string[]
      location?: string
      income?: number
      landOwnership?: "owned" | "leased" | "sharecropper"
      category?: "small" | "marginal" | "large"
    },
  ): Promise<SchemeEligibility> {
    const scheme = await Database.schemes.find((s) => s.id === schemeId)
    if (!scheme) {
      throw new Error("Scheme not found")
    }

    const eligibility: SchemeEligibility = {
      isEligible: true,
      reasons: [],
      requirements: [],
      documents: [],
      applicationSteps: [],
    }

    // Check eligibility based on scheme type
    switch (scheme.title) {
      case "PM-KISAN Samman Nidhi":
        if (userProfile.farmSize && userProfile.farmSize > 2) {
          eligibility.isEligible = false
          eligibility.reasons.push("Farm size exceeds 2 hectares limit for small and marginal farmers")
        } else {
          eligibility.reasons.push("Eligible as small/marginal farmer with land up to 2 hectares")
        }
        eligibility.requirements = [
          "Must be a small or marginal farmer",
          "Cultivable land should not exceed 2 hectares",
          "Must have valid land records",
        ]
        eligibility.documents = [
          "Aadhaar Card",
          "Bank Account Details",
          "Land Records (Khata/Khatauni)",
          "Passport Size Photo",
        ]
        eligibility.applicationSteps = [
          "Visit pmkisan.gov.in or nearest CSC",
          "Fill the registration form with Aadhaar details",
          "Upload required documents",
          "Submit application and note registration number",
          "Track application status online",
        ]
        break

      case "Pradhan Mantri Fasal Bima Yojana":
        eligibility.reasons.push("All farmers growing notified crops are eligible")
        eligibility.requirements = [
          "Must be growing notified crops in notified areas",
          "Should have valid land records or crop loan documents",
          "Premium payment within due date",
        ]
        eligibility.documents = [
          "Aadhaar Card",
          "Bank Account Details",
          "Land Records",
          "Crop Loan Documents (if applicable)",
          "Sowing Certificate",
        ]
        eligibility.applicationSteps = [
          "Visit nearest bank, insurance company, or CSC",
          "Fill crop insurance application form",
          "Submit required documents",
          "Pay premium amount",
          "Receive policy document",
        ]
        break

      case "Soil Health Card Scheme":
        eligibility.reasons.push("All farmers across the country are eligible")
        eligibility.requirements = ["Must be a farmer with cultivable land", "Should provide soil samples"]
        eligibility.documents = ["Aadhaar Card", "Land Records", "Contact Details"]
        eligibility.applicationSteps = [
          "Contact local agriculture department",
          "Visit Krishi Vigyan Kendra",
          "Provide soil samples from different parts of field",
          "Receive soil health card with recommendations",
        ]
        break

      case "Kisan Credit Card":
        if (userProfile.landOwnership === "sharecropper") {
          eligibility.reasons.push("Eligible as sharecropper under expanded coverage")
        } else {
          eligibility.reasons.push("Eligible as farmer with land ownership/lease")
        }
        eligibility.requirements = [
          "Must be a farmer (including tenant farmers and sharecroppers)",
          "Should have valid land records or crop cultivation proof",
          "Good credit history preferred",
        ]
        eligibility.documents = [
          "Aadhaar Card",
          "PAN Card",
          "Land Records",
          "Bank Account Details",
          "Passport Size Photos",
          "Income Certificate",
        ]
        eligibility.applicationSteps = [
          "Visit nearest bank branch",
          "Fill KCC application form",
          "Submit required documents",
          "Bank verification and assessment",
          "Receive KCC upon approval",
        ]
        break

      default:
        eligibility.reasons.push("General eligibility criteria apply")
        eligibility.requirements = ["Must be a farmer", "Should meet scheme-specific criteria"]
        eligibility.documents = ["Aadhaar Card", "Land Records", "Bank Account Details"]
        eligibility.applicationSteps = [
          "Check detailed eligibility criteria",
          "Gather required documents",
          "Apply through designated channels",
          "Track application status",
        ]
    }

    return eligibility
  }

  // Get schemes by category
  public async getSchemesByCategory(): Promise<SchemeCategory[]> {
    const allSchemes = await Database.getActiveSchemes()

    const categories: { [key: string]: SchemeCategory } = {
      "Financial Support": {
        name: "Financial Support",
        description: "Direct financial assistance and subsidies for farmers",
        icon: "IndianRupee",
        schemes: [],
      },
      Insurance: {
        name: "Insurance",
        description: "Crop insurance and risk management schemes",
        icon: "Shield",
        schemes: [],
      },
      "Technical Support": {
        name: "Technical Support",
        description: "Technical guidance and agricultural extension services",
        icon: "BookOpen",
        schemes: [],
      },
      "Credit Support": {
        name: "Credit Support",
        description: "Credit facilities and loan schemes for farmers",
        icon: "CreditCard",
        schemes: [],
      },
      "Input Subsidy": {
        name: "Input Subsidy",
        description: "Subsidies on seeds, fertilizers, and farm equipment",
        icon: "Sprout",
        schemes: [],
      },
    }

    // Categorize schemes
    for (const scheme of allSchemes) {
      if (categories[scheme.category]) {
        categories[scheme.category].schemes.push(scheme)
      } else {
        // Create new category if not exists
        categories[scheme.category] = {
          name: scheme.category,
          description: `Schemes related to ${scheme.category.toLowerCase()}`,
          icon: "FileText",
          schemes: [scheme],
        }
      }
    }

    return Object.values(categories).filter((category) => category.schemes.length > 0)
  }

  // Search schemes
  public async searchSchemes(
    query: string,
    filters?: {
      category?: string
      state?: string
      status?: string
    },
  ): Promise<GovernmentScheme[]> {
    let schemes = await Database.getActiveSchemes()

    // Apply text search
    if (query) {
      const searchTerm = query.toLowerCase()
      schemes = schemes.filter(
        (scheme) =>
          scheme.title.toLowerCase().includes(searchTerm) ||
          scheme.description.toLowerCase().includes(searchTerm) ||
          scheme.category.toLowerCase().includes(searchTerm) ||
          scheme.benefits.toLowerCase().includes(searchTerm),
      )
    }

    // Apply filters
    if (filters?.category) {
      schemes = schemes.filter((scheme) => scheme.category === filters.category)
    }

    if (filters?.status) {
      schemes = schemes.filter((scheme) => scheme.status === filters.status)
    }

    if (filters?.state) {
      schemes = schemes.filter((scheme) => {
        if (!scheme.targetStates || scheme.targetStates.includes("All States")) {
          return true
        }
        return scheme.targetStates.some((state) => state.toLowerCase().includes(filters.state!.toLowerCase()))
      })
    }

    return schemes
  }

  // Get scheme recommendations for user
  public async getRecommendations(userProfile: {
    farmSize?: number
    crops?: string[]
    location?: string
    income?: number
    landOwnership?: string
  }): Promise<{
    highPriority: GovernmentScheme[]
    recommended: GovernmentScheme[]
    other: GovernmentScheme[]
  }> {
    const allSchemes = await Database.getActiveSchemes()
    const highPriority: GovernmentScheme[] = []
    const recommended: GovernmentScheme[] = []
    const other: GovernmentScheme[] = []

    for (const scheme of allSchemes) {
      try {
        const eligibility = await this.checkEligibility(scheme.id, userProfile)

        if (eligibility.isEligible) {
          // High priority schemes for small farmers
          if (
            (userProfile.farmSize && userProfile.farmSize <= 2 && scheme.title.includes("PM-KISAN")) ||
            scheme.title.includes("Fasal Bima") ||
            scheme.title.includes("Soil Health")
          ) {
            highPriority.push(scheme)
          } else {
            recommended.push(scheme)
          }
        } else {
          other.push(scheme)
        }
      } catch (error) {
        // If eligibility check fails, add to other category
        other.push(scheme)
      }
    }

    return { highPriority, recommended, other }
  }

  // Create scheme application
  public async createApplication(
    userId: string,
    schemeId: string,
    documents?: Array<{ type: string; filename: string; url: string }>,
  ): Promise<SchemeApplication> {
    const application: SchemeApplication = {
      id: `app_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      schemeId,
      status: "draft",
      documents: documents?.map((doc) => ({ ...doc, uploadedAt: new Date() })) || [],
    }

    // In production, save to database
    // await Database.createApplication(application)

    return application
  }

  // Submit application
  public async submitApplication(applicationId: string): Promise<SchemeApplication> {
    // In production, update in database
    const application: SchemeApplication = {
      id: applicationId,
      userId: "user_001",
      schemeId: "scheme_001",
      status: "submitted",
      submittedAt: new Date(),
      documents: [],
    }

    // Create notification
    await Database.createNotification({
      userId: application.userId,
      title: "Application Submitted",
      message: `Your scheme application has been submitted successfully. Application ID: ${applicationId}`,
      type: "scheme_update",
      isRead: false,
      priority: "medium",
    })

    return application
  }

  // Get application status
  public async getApplicationStatus(applicationId: string): Promise<SchemeApplication | null> {
    // Mock application status - in production, fetch from database
    return {
      id: applicationId,
      userId: "user_001",
      schemeId: "scheme_001",
      status: "under_review",
      submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      documents: [
        {
          type: "Aadhaar Card",
          filename: "aadhaar.pdf",
          url: "/uploads/aadhaar.pdf",
          uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      ],
      notes: "Application is under review by the concerned department",
    }
  }

  // Update scheme data (for admin)
  public async updateSchemeData(): Promise<{
    success: boolean
    updated: number
    errors: string[]
  }> {
    // Mock scheme update - in production, scrape from official websites
    const errors: string[] = []
    let updated = 0

    try {
      // Simulate fetching from official sources
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock new schemes data
      const newSchemes = [
        {
          title: "Pradhan Mantri Kisan Maan Dhan Yojana",
          description: "Pension scheme for small and marginal farmers",
          eligibility: "Small and marginal farmers aged 18-40 years",
          benefits: "Monthly pension of Rs. 3000 after 60 years of age",
          applicationProcess: "Apply online at maandhan.in or visit nearest CSC",
          deadline: "2025-12-31",
          status: "Active" as const,
          category: "Financial Support",
          targetStates: ["All States"],
          officialUrl: "https://maandhan.in",
        },
      ]

      for (const schemeData of newSchemes) {
        await Database.createScheme(schemeData)
        updated++
      }

      // Log analytics event
      await Database.logEvent({
        eventType: "schemes_update",
        eventData: {
          updated,
          errors: errors.length,
          timestamp: new Date().toISOString(),
        },
      })

      return {
        success: errors.length === 0,
        updated,
        errors,
      }
    } catch (error) {
      errors.push(`Update failed: ${error instanceof Error ? error.message : "Unknown error"}`)
      return {
        success: false,
        updated,
        errors,
      }
    }
  }
}
