"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { Globe } from "lucide-react"

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage()

  return (
    <button
      onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 transition-all shadow-md"
      aria-label="Switch language"
    >
      <Globe className="w-4 h-4" />
      <span className="font-semibold text-sm">{language === "ar" ? "EN" : "AR"}</span>
    </button>
  )
}
