"use client"

import { Sparkles } from "lucide-react"
import { useState, useEffect } from "react"

export function TopBar() {
  const [announcementText, setAnnouncementText] = useState("تخفيضات كبرى بمناسبة الافتتاح - متوفر الدفع عبر تطبيق بنكك")
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedText = localStorage.getItem("jood_announcement_text")
      const savedVisibility = localStorage.getItem("jood_announcement_visible")

      if (savedText) {
        setAnnouncementText(savedText)
      }
      if (savedVisibility !== null) {
        setIsVisible(savedVisibility === "true")
      }

      const handleUpdate = () => {
        const text = localStorage.getItem("jood_announcement_text")
        const visible = localStorage.getItem("jood_announcement_visible")
        if (text) setAnnouncementText(text)
        if (visible !== null) setIsVisible(visible === "true")
      }

      window.addEventListener("announcementUpdated", handleUpdate)
      return () => window.removeEventListener("announcementUpdated", handleUpdate)
    }
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
