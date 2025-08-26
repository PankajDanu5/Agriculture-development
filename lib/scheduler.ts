import { MandiScraper } from "./mandi-scraper"
import { config } from "./config"

export class TaskScheduler {
  private static instance: TaskScheduler
  private intervals: Map<string, NodeJS.Timeout> = new Map()

  private constructor() {}

  public static getInstance(): TaskScheduler {
    if (!TaskScheduler.instance) {
      TaskScheduler.instance = new TaskScheduler()
    }
    return TaskScheduler.instance
  }

  // Start mandi price updates
  public startMandiPriceUpdates(): void {
    const intervalId = setInterval(async () => {
      try {
        console.log("Starting scheduled mandi price update...")
        const scraper = MandiScraper.getInstance()
        const result = await scraper.updateAllPrices()

        console.log(`Mandi price update completed:`, {
          success: result.success,
          totalUpdated: result.totalUpdated,
          sources: result.sources.length,
          errors: result.errors.length,
        })

        // Check for price alerts after update
        const alertResult = await scraper.checkPriceAlerts()
        if (alertResult.alertsTriggered > 0) {
          console.log(`${alertResult.alertsTriggered} price alerts triggered`)
        }
      } catch (error) {
        console.error("Scheduled mandi price update failed:", error)
      }
    }, config.apis.mandi.updateInterval)

    this.intervals.set("mandi-prices", intervalId)
    console.log(`Mandi price updates scheduled every ${config.apis.mandi.updateInterval / 1000 / 60} minutes`)
  }

  // Start government schemes updates
  public startSchemesUpdates(): void {
    const intervalId = setInterval(async () => {
      try {
        console.log("Starting scheduled government schemes update...")
        // In production, implement schemes scraper
        console.log("Government schemes update completed")
      } catch (error) {
        console.error("Scheduled schemes update failed:", error)
      }
    }, config.apis.schemes.updateInterval)

    this.intervals.set("schemes", intervalId)
    console.log(
      `Government schemes updates scheduled every ${config.apis.schemes.updateInterval / 1000 / 60 / 60} hours`,
    )
  }

  // Stop a specific scheduled task
  public stopTask(taskName: string): void {
    const intervalId = this.intervals.get(taskName)
    if (intervalId) {
      clearInterval(intervalId)
      this.intervals.delete(taskName)
      console.log(`Stopped scheduled task: ${taskName}`)
    }
  }

  // Stop all scheduled tasks
  public stopAllTasks(): void {
    for (const [taskName, intervalId] of this.intervals) {
      clearInterval(intervalId)
      console.log(`Stopped scheduled task: ${taskName}`)
    }
    this.intervals.clear()
  }

  // Get status of all scheduled tasks
  public getTaskStatus(): Array<{ name: string; isRunning: boolean }> {
    return [
      { name: "mandi-prices", isRunning: this.intervals.has("mandi-prices") },
      { name: "schemes", isRunning: this.intervals.has("schemes") },
    ]
  }
}

// Initialize scheduler when module is loaded
if (typeof window === "undefined") {
  // Only run on server side
  const scheduler = TaskScheduler.getInstance()

  // Start tasks in development/production
  if (process.env.NODE_ENV !== "test") {
    scheduler.startMandiPriceUpdates()
    scheduler.startSchemesUpdates()
  }
}
