"use client"

import { useState } from "react"
import { updateSettingsAction } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

export default function SettingsForm({ initialSettings }: { initialSettings: any }) {
  const [settings, setSettings] = useState(initialSettings)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateSettingsAction(settings)
      toast.success("تم حفظ الإعدادات")
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm max-w-2xl">
      <h2 className="text-xl font-bold mb-6 text-right">إعدادات شريط الإعلانات</h2>
      <form onSubmit={handleSubmit} className="space-y-6 text-right">
        <div className="space-y-2">
          <label className="text-sm font-medium">نص الإعلان</label>
          <Input 
            value={settings.announcement_text} 
            onChange={e => setSettings({...settings, announcement_text: e.target.value})}
            dir="rtl"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">لون الشريط</label>
          <Input 
            type="color" 
            value={settings.announcement_color} 
            onChange={e => setSettings({...settings, announcement_color: e.target.value})}
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">إظهار الشريط</label>
          <Switch 
            checked={settings.announcement_visible} 
            onCheckedChange={checked => setSettings({...settings, announcement_visible: checked})}
          />
        </div>
        <Button type="submit" className="w-full">حفظ التغييرات</Button>
      </form>
    </div>
  )
}
