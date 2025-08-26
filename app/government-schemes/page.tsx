"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  FileText,
  Search,
  Filter,
  IndianRupee,
  Shield,
  BookOpen,
  CreditCard,
  Sprout,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Star,
} from "lucide-react"

interface GovernmentScheme {
  id: string
  title: string
  description: string
  eligibility: string
  benefits: string
  applicationProcess: string
  deadline?: string
  status: string
  category: string
  targetStates?: string[]
  officialUrl?: string
}

interface SchemeCategory {
  name: string
  description: string
  icon: string
  schemes: GovernmentScheme[]
}

interface SchemeEligibility {
  isEligible: boolean
  reasons: string[]
  requirements: string[]
  documents: string[]
  applicationSteps: string[]
}

export default function GovernmentSchemesPage() {
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([])
  const [categories, setCategories] = useState<SchemeCategory[]>([])
  const [filteredSchemes, setFilteredSchemes] = useState<GovernmentScheme[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedState, setSelectedState] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedScheme, setSelectedScheme] = useState<GovernmentScheme | null>(null)
  const [eligibility, setEligibility] = useState<SchemeEligibility | null>(null)
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false)

  const categoryIcons: { [key: string]: any } = {
    "Financial Support": IndianRupee,
    Insurance: Shield,
    "Technical Support": BookOpen,
    "Credit Support": CreditCard,
    "Input Subsidy": Sprout,
    default: FileText,
  }

  // Fetch schemes and categories
  const fetchSchemes = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const [schemesResponse, categoriesResponse] = await Promise.all([
        fetch(`/api/government-schemes?query=${searchTerm}&category=${selectedCategory}&state=${selectedState}`),
        fetch("/api/government-schemes?action=categories"),
      ])

      const schemesData = await schemesResponse.json()
      const categoriesData = await categoriesResponse.json()

      if (schemesData.success) {
        setSchemes(schemesData.schemes)
        setFilteredSchemes(schemesData.schemes)
      } else {
        setError(schemesData.message || "Failed to fetch schemes")
      }

      if (categoriesData.success) {
        setCategories(categoriesData.categories)
      }
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Check eligibility for a scheme
  const checkEligibility = async (schemeId: string) => {
    try {
      setIsCheckingEligibility(true)
      const response = await fetch(`/api/government-schemes?action=eligibility&schemeId=${schemeId}&userId=user_001`)
      const data = await response.json()

      if (data.success) {
        setEligibility(data.eligibility)
      } else {
        setError(data.message || "Failed to check eligibility")
      }
    } catch (err) {
      setError("Failed to check eligibility")
    } finally {
      setIsCheckingEligibility(false)
    }
  }

  // Load schemes on component mount and filter changes
  useEffect(() => {
    fetchSchemes()
  }, [searchTerm, selectedCategory, selectedState])

  // Get category icon
  const getCategoryIcon = (categoryName: string) => {
    const IconComponent = categoryIcons[categoryName] || categoryIcons.default
    return <IconComponent className="h-5 w-5" />
  }

  // Format deadline
  const formatDeadline = (deadline?: string) => {
    if (!deadline) return "Ongoing"
    const date = new Date(deadline)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return "Expired"
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Tomorrow"
    if (diffDays <= 30) return `${diffDays} days left`
    return date.toLocaleDateString("en-IN")
  }

  // Get deadline color
  const getDeadlineColor = (deadline?: string) => {
    if (!deadline) return "text-muted-foreground"
    const date = new Date(deadline)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return "text-destructive"
    if (diffDays <= 7) return "text-destructive"
    if (diffDays <= 30) return "text-secondary"
    return "text-muted-foreground"
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Government Schemes</h1>
        <p className="text-muted-foreground">
          Discover and apply for government schemes and subsidies available for farmers
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Search Schemes</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by title, benefits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name}
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
                  <SelectItem value="punjab">Punjab</SelectItem>
                  <SelectItem value="haryana">Haryana</SelectItem>
                  <SelectItem value="uttar pradesh">Uttar Pradesh</SelectItem>
                  <SelectItem value="maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="gujarat">Gujarat</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Refresh Button */}
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button onClick={fetchSchemes} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
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
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Schemes</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
        </TabsList>

        {/* All Schemes */}
        <TabsContent value="all">
          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">Loading government schemes...</p>
            </div>
          ) : filteredSchemes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No schemes found for the selected filters</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredSchemes.map((scheme) => (
                <Card key={scheme.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2 mb-2">
                          {getCategoryIcon(scheme.category)}
                          {scheme.title}
                        </CardTitle>
                        <CardDescription className="text-base">{scheme.description}</CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="outline">{scheme.category}</Badge>
                        <span className={`text-sm ${getDeadlineColor(scheme.deadline)}`}>
                          <Clock className="inline h-3 w-3 mr-1" />
                          {formatDeadline(scheme.deadline)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Benefits</h4>
                        <p className="text-sm text-muted-foreground">{scheme.benefits}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2">Eligibility</h4>
                        <p className="text-sm text-muted-foreground">{scheme.eligibility}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-4">
                        {scheme.officialUrl && (
                          <Link href={scheme.officialUrl} target="_blank">
                            <Button variant="outline" size="sm">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Official Site
                            </Button>
                          </Link>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedScheme(scheme)
                                checkEligibility(scheme.id)
                              }}
                            >
                              Check Eligibility
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Eligibility Check: {selectedScheme?.title}</DialogTitle>
                              <DialogDescription>
                                Check if you are eligible for this scheme and get application guidance
                              </DialogDescription>
                            </DialogHeader>

                            {isCheckingEligibility ? (
                              <div className="text-center py-8">
                                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                                <p className="text-muted-foreground">Checking eligibility...</p>
                              </div>
                            ) : eligibility ? (
                              <div className="space-y-6">
                                {/* Eligibility Status */}
                                <div className="flex items-center gap-2">
                                  {eligibility.isEligible ? (
                                    <CheckCircle className="h-6 w-6 text-primary" />
                                  ) : (
                                    <XCircle className="h-6 w-6 text-destructive" />
                                  )}
                                  <span className="font-medium">
                                    {eligibility.isEligible ? "You are eligible!" : "Not eligible"}
                                  </span>
                                </div>

                                {/* Reasons */}
                                <div>
                                  <h4 className="font-medium mb-2">Eligibility Assessment</h4>
                                  <ul className="space-y-1">
                                    {eligibility.reasons.map((reason, index) => (
                                      <li key={index} className="flex items-start gap-2 text-sm">
                                        <span className="text-primary mt-1">•</span>
                                        <span>{reason}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Requirements */}
                                <div>
                                  <h4 className="font-medium mb-2">Requirements</h4>
                                  <ul className="space-y-1">
                                    {eligibility.requirements.map((req, index) => (
                                      <li key={index} className="flex items-start gap-2 text-sm">
                                        <span className="text-secondary mt-1">•</span>
                                        <span>{req}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {/* Documents */}
                                <div>
                                  <h4 className="font-medium mb-2">Required Documents</h4>
                                  <div className="grid grid-cols-2 gap-2">
                                    {eligibility.documents.map((doc, index) => (
                                      <Badge key={index} variant="outline" className="justify-start">
                                        {doc}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>

                                {/* Application Steps */}
                                <div>
                                  <h4 className="font-medium mb-2">Application Steps</h4>
                                  <ol className="space-y-2">
                                    {eligibility.applicationSteps.map((step, index) => (
                                      <li key={index} className="flex items-start gap-3 text-sm">
                                        <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                                          {index + 1}
                                        </span>
                                        <span>{step}</span>
                                      </li>
                                    ))}
                                  </ol>
                                </div>

                                {eligibility.isEligible && (
                                  <Button className="w-full">
                                    <Star className="mr-2 h-4 w-4" />
                                    Start Application
                                  </Button>
                                )}
                              </div>
                            ) : null}
                          </DialogContent>
                        </Dialog>
                        <Button size="sm">Apply Now</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* By Category */}
        <TabsContent value="categories">
          <div className="grid gap-6">
            {categories.map((category) => (
              <Card key={category.name}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getCategoryIcon(category.name)}
                    {category.name}
                  </CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {category.schemes.slice(0, 3).map((scheme) => (
                      <div key={scheme.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{scheme.title}</p>
                          <p className="text-sm text-muted-foreground">{scheme.benefits}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-sm ${getDeadlineColor(scheme.deadline)}`}>
                            {formatDeadline(scheme.deadline)}
                          </span>
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                    {category.schemes.length > 3 && (
                      <Button variant="outline" className="w-full bg-transparent">
                        View All {category.schemes.length} Schemes
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Recommended */}
        <TabsContent value="recommended">
          <div className="text-center py-8 text-muted-foreground">
            <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Personalized recommendations will be available after profile completion</p>
            <Button className="mt-4 bg-transparent" variant="outline">
              Complete Profile
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
