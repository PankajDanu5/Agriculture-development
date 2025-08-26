"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Upload, Camera, Loader2, CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react"

interface DetectionResult {
  disease: string
  confidence: number
  description: string
  treatment: string
  severity: "None" | "Low" | "Medium" | "High" | "Critical"
  preventiveMeasures: string[]
  affectedCrops: string[]
  symptoms: string[]
  imageQuality: {
    suitable: boolean
    issues: string[]
    recommendations: string[]
  }
  timestamp: string
  processingTime: string
}

export default function DiseaseDetectionPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isDetecting, setIsDetecting] = useState(false)
  const [result, setResult] = useState<DetectionResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cropType, setCropType] = useState("")
  const [location, setLocation] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const cropTypes = [
    "Rice",
    "Wheat",
    "Maize",
    "Tomato",
    "Potato",
    "Onion",
    "Cotton",
    "Sugarcane",
    "Soybean",
    "Groundnut",
    "Mustard",
    "Sunflower",
    "Chili",
    "Turmeric",
  ]

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      setError(null)
      setResult(null)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDetection = async () => {
    if (!selectedImage) {
      setError("Please select an image first")
      return
    }

    setIsDetecting(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("image", selectedImage)
      formData.append("userId", "user_001") // Mock user ID
      if (cropType) formData.append("cropType", cropType)
      if (location) formData.append("location", location)

      const response = await fetch("/api/disease-detection", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.result)
      } else {
        setError(data.message || "Detection failed")
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsDetecting(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "destructive"
      case "High":
        return "destructive"
      case "Medium":
        return "secondary"
      case "Low":
        return "outline"
      case "None":
        return "default"
      default:
        return "outline"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Critical":
        return <XCircle className="h-4 w-4" />
      case "High":
        return <AlertTriangle className="h-4 w-4" />
      case "Medium":
        return <Info className="h-4 w-4" />
      case "Low":
        return <Info className="h-4 w-4" />
      case "None":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-2">AI Disease Detection</h1>
        <p className="text-gray-600">
          Upload an image of your crop to detect diseases and get treatment recommendations
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Crop Image
            </CardTitle>
            <CardDescription>Take a clear photo of the affected plant part for accurate detection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">Select Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                ref={fileInputRef}
                className="cursor-pointer"
              />
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Selected crop"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cropType">Crop Type (Optional)</Label>
                <Select value={cropType} onValueChange={setCropType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop type" />
                  </SelectTrigger>
                  <SelectContent>
                    {cropTypes.map((crop) => (
                      <SelectItem key={crop} value={crop}>
                        {crop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location (Optional)</Label>
                <Input
                  id="location"
                  placeholder="e.g., Punjab, India"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
            </div>

            {/* Detect Button */}
            <Button onClick={handleDetection} disabled={!selectedImage || isDetecting} className="w-full" size="lg">
              {isDetecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Image...
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4" />
                  Detect Disease
                </>
              )}
            </Button>

            {/* Error Display */}
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle>Detection Results</CardTitle>
            <CardDescription>AI analysis results and treatment recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            {!result ? (
              <div className="text-center py-8 text-gray-500">
                <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Upload an image to see detection results</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Disease Information */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{result.disease}</h3>
                    <Badge variant={getSeverityColor(result.severity)} className="flex items-center gap-1">
                      {getSeverityIcon(result.severity)}
                      {result.severity}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Confidence: {Math.round(result.confidence * 100)}%</span>
                    <span>•</span>
                    <span>Processing time: {result.processingTime}</span>
                  </div>

                  <p className="text-gray-700">{result.description}</p>
                </div>

                <Separator />

                {/* Treatment */}
                <div className="space-y-2">
                  <h4 className="font-medium text-green-700">Treatment Recommendation</h4>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm">{result.treatment}</p>
                  </div>
                </div>

                {/* Symptoms */}
                {result.symptoms.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Symptoms</h4>
                    <ul className="text-sm space-y-1">
                      {result.symptoms.map((symptom, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-orange-500 mt-1">•</span>
                          <span>{symptom}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Preventive Measures */}
                {result.preventiveMeasures.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Preventive Measures</h4>
                    <ul className="text-sm space-y-1">
                      {result.preventiveMeasures.map((measure, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{measure}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Affected Crops */}
                {result.affectedCrops.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Commonly Affected Crops</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.affectedCrops.map((crop, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {crop}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image Quality Assessment */}
                {!result.imageQuality.suitable && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p className="font-medium">Image Quality Issues:</p>
                        <ul className="text-sm space-y-1">
                          {result.imageQuality.issues.map((issue, index) => (
                            <li key={index}>• {issue}</li>
                          ))}
                        </ul>
                        <p className="font-medium mt-2">Recommendations:</p>
                        <ul className="text-sm space-y-1">
                          {result.imageQuality.recommendations.map((rec, index) => (
                            <li key={index}>• {rec}</li>
                          ))}
                        </ul>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
