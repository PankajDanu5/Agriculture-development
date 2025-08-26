import { type NextRequest, NextResponse } from "next/server"
import { AIService } from "@/lib/ai-service"
import { ImageUtils } from "@/lib/image-utils"
import { Database } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File
    const userId = formData.get("userId") as string
    const cropType = formData.get("cropType") as string
    const location = formData.get("location") as string

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          message: "No image provided",
        },
        { status: 400 },
      )
    }

    // Validate image
    const validation = ImageUtils.validateImage(image)
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: validation.error,
        },
        { status: 400 },
      )
    }

    // Convert image to buffer
    const imageBuffer = await ImageUtils.fileToBuffer(image)

    // Assess image quality
    const qualityAssessment = await ImageUtils.assessImageQuality(imageBuffer)

    // Preprocess image
    const processedBuffer = await ImageUtils.preprocessImage(imageBuffer)

    // Get AI service instance
    const aiService = AIService.getInstance()

    // Perform disease detection
    const detectionResult = await aiService.detectDisease(processedBuffer, cropType || undefined, location || undefined)

    // Generate filename for storage
    const filename = ImageUtils.generateFilename(image.name, userId || "anonymous")

    // Save detection record to database (if userId provided)
    let detectionRecord = null
    if (userId) {
      detectionRecord = await Database.createDetection({
        userId,
        imageUrl: `/uploads/${filename}`,
        imageFilename: filename,
        disease: detectionResult.disease,
        confidence: detectionResult.confidence,
        treatment: detectionResult.treatment,
        severity: detectionResult.severity,
        cropType: cropType || undefined,
        location: location || undefined,
      })

      // Create notification for high-severity diseases
      if (detectionResult.severity === "High" || detectionResult.severity === "Critical") {
        await Database.createNotification({
          userId,
          title: `${detectionResult.severity} Disease Detected`,
          message: `${detectionResult.disease} detected in your ${cropType || "crop"} with ${Math.round(detectionResult.confidence * 100)}% confidence. Immediate treatment recommended.`,
          type: "disease_alert",
          isRead: false,
          priority: detectionResult.severity === "Critical" ? "high" : "medium",
        })
      }
    }

    // Log analytics event
    await Database.logEvent({
      userId: userId || undefined,
      eventType: "disease_detection",
      eventData: {
        disease: detectionResult.disease,
        confidence: detectionResult.confidence,
        severity: detectionResult.severity,
        cropType: cropType || null,
        location: location || null,
        imageSize: image.size,
        imageType: image.type,
      },
    })

    return NextResponse.json({
      success: true,
      result: {
        ...detectionResult,
        detectionId: detectionRecord?.id,
        imageQuality: qualityAssessment,
        timestamp: new Date().toISOString(),
        processingTime: "2.1s", // Mock processing time
      },
    })
  } catch (error) {
    console.error("Disease detection error:", error)

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Detection failed",
        error: process.env.NODE_ENV === "development" ? error : undefined,
      },
      { status: 500 },
    )
  }
}

// Get detection history for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 400 },
      )
    }

    const detections = await Database.getDetectionsByUser(userId)
    const limitedDetections = detections.slice(0, limit)

    return NextResponse.json({
      success: true,
      detections: limitedDetections,
      total: detections.length,
      hasMore: detections.length > limit,
    })
  } catch (error) {
    console.error("Get detections error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch detection history",
      },
      { status: 500 },
    )
  }
}
