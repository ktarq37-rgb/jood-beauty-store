"use client"

import { Sparkles } from "lucide-react"
import { useState, useEffect } from "react"
import { getSettingsAction } from "@/app/admin-dashboard/actions"

export function TopBar() {
  const [announcementText, setAnnouncementText] = useState("تخفيضات كبرى بمناسبة الافتتاح - متوفر الدفع عبر تطبيق بنكك")
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    async function fetchSettings() {
      try {
        const settings = await getSettingsAction()
        if (settings) {
          setAnnouncementText(settings.announcement_text)
          setIsVisible(settings.show_announcement)
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error)
      }
    }
    fetchSettings()
  }, [])

  if (!isVisible) return null

  return (
    <div className="bg-secondary text-secondary-foreground py-2.5 px-4 text-center">
      <div className="container mx-auto flex items-center justify-center gap-2 text-sm font-medium">
        <Sparkles className="h-4 w-4" />
        <span>{announcementText}</span>
        <Sparkles className="h-4 w-4" />
      </div>
    </div>
  )
}
