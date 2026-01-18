"use client"

import { useState } from "react"
import { runSyncAction } from "./sync-actions"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { toast } from "sonner"

export default function SyncButton() {
  const [isSyncing, setIsSyncing] = useState(false)

  async function handleSync() {
    setIsSyncing(true)
    try {
      const result = await runSyncAction()
      if (result.success) {
        toast.success(`تمت مزامنة ${result.count} منتج بنجاح`)
        window.location.reload()
      } else {
        toast.error("فشلت المزامنة: " + result.error)
      }
    } catch (error: any) {
      toast.error("خطأ غير متوقع")
    }
    setIsSyncing(false)
  }

  return (
    <Button 
      variant="outline" 
      onClick={handleSync} 
      disabled={isSyncing}
      className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
    >
      <RefreshCw className={`w-4 h-4 ml-2 ${isSyncing ? 'animate-spin' : ''}`} />
      {isSyncing ? "جاري المزامنة..." : "سحب المنتجات من Shopify"}
    </Button>
  )
}
