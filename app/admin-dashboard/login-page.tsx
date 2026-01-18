"use client"

import { useState } from "react"
import { loginAction } from "./auth-actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Lock } from "lucide-react"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    
    const formData = new FormData(e.currentTarget)
    const result = await loginAction(formData)
    
    if (result.success) {
      toast.success("تم تسجيل الدخول بنجاح")
      window.location.reload()
    } else {
      toast.error(result.error)
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl border">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">دخول الإدارة</h2>
          <p className="mt-2 text-sm text-gray-600">يرجى إدخال بيانات الاعتماد للمتابعة</p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">اسم المستخدم</label>
              <Input name="username" required placeholder="Username" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">كلمة المرور</label>
              <Input name="password" type="password" required placeholder="Password" />
            </div>
          </div>

          <Button type="submit" className="w-full py-6 text-lg" disabled={isLoading}>
            {isLoading ? "جاري التحقق..." : "تسجيل الدخول"}
          </Button>
        </form>
      </div>
    </div>
  )
}
