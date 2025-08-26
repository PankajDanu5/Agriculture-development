import { config } from "./config"

export interface ImageValidationResult {
  isValid: boolean
  error?: string
  metadata?: {
    size: number
    type: string
    dimensions?: { width: number; height: number }
  }
}

export class ImageUtils {
  // Validate uploaded image
  static validateImage(file: File): ImageValidationResult {
    // Check file size
    if (file.size > config.upload.maxFileSize) {
      return {
        isValid: false,
        error: `Image size (${Math.round(file.size / 1024 / 1024)}MB) exceeds maximum allowed size (${Math.round(config.upload.maxFileSize / 1024 / 1024)}MB)`,
      }
    }

    // Check file type
    if (!config.upload.allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `Image type ${file.type} is not supported. Allowed types: ${config.upload.allowedTypes.join(", ")}`,
      }
    }

    return {
      isValid: true,
      metadata: {
        size: file.size,
        type: file.type,
      },
    }
  }

  // Convert file to buffer for processing
  static async fileToBuffer(file: File): Promise<Buffer> {
    const arrayBuffer = await file.arrayBuffer()
    return Buffer.from(arrayBuffer)
  }

  // Generate unique filename
  static generateFilename(originalName: string, userId: string): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const extension = originalName.split(".").pop()?.toLowerCase() || "jpg"
    return `${userId}_${timestamp}_${random}.${extension}`
  }

  // Mock image preprocessing (in production, use sharp or similar)
  static async preprocessImage(buffer: Buffer): Promise<Buffer> {
    // Simulate image preprocessing delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // In production, this would:
    // - Resize image to optimal dimensions
    // - Normalize pixel values
    // - Apply noise reduction
    // - Enhance contrast if needed

    return buffer // Return original buffer for now
  }

  // Extract basic image metadata
  static async getImageMetadata(buffer: Buffer): Promise<{
    size: number
    format: string
    quality: "low" | "medium" | "high"
  }> {
    // Mock metadata extraction
    const size = buffer.length

    // Determine format from buffer header (simplified)
    let format = "unknown"
    if (buffer[0] === 0xff && buffer[1] === 0xd8) format = "jpeg"
    else if (buffer[0] === 0x89 && buffer[1] === 0x50) format = "png"
    else if (buffer[0] === 0x52 && buffer[1] === 0x49) format = "webp"

    // Determine quality based on file size and format
    let quality: "low" | "medium" | "high" = "medium"
    if (size < 100000) quality = "low"
    else if (size > 1000000) quality = "high"

    return { size, format, quality }
  }

  // Check if image is suitable for disease detection
  static async assessImageQuality(buffer: Buffer): Promise<{
    suitable: boolean
    issues: string[]
    recommendations: string[]
  }> {
    const metadata = await this.getImageMetadata(buffer)
    const issues: string[] = []
    const recommendations: string[] = []

    // Check file size
    if (metadata.size < 50000) {
      issues.push("Image resolution may be too low for accurate detection")
      recommendations.push("Use a higher resolution image (at least 500x500 pixels)")
    }

    if (metadata.size > 5000000) {
      issues.push("Image file size is very large")
      recommendations.push("Consider compressing the image to reduce file size")
    }

    // Check quality
    if (metadata.quality === "low") {
      issues.push("Image quality appears to be low")
      recommendations.push("Ensure good lighting and focus when taking the photo")
    }

    // General recommendations
    if (issues.length === 0) {
      recommendations.push("Image appears suitable for disease detection")
    } else {
      recommendations.push("Take a clear, well-lit photo of the affected plant part")
      recommendations.push("Ensure the diseased area is clearly visible")
      recommendations.push("Avoid blurry or dark images")
    }

    return {
      suitable: issues.length === 0,
      issues,
      recommendations,
    }
  }
}
