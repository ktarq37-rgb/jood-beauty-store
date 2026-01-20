"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "JOOD" && password === "tyfgaszxM2") {
      // Set cookie with specific options
      document.cookie = "admin_session=authenticated; path=/; max-age=3600; samesite=lax";
      
      toast.success("تم تسجيل الدخول بنجاح");
      
      // Use window.location.href for a hard redirect to ensure middleware picks up the new cookie
      window.location.href = "/admin-dashboard";
    } else {
      toast.error("بيانات الدخول غير صحيحة");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg border">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">تسجيل دخول المسؤول</h2>
          <p className="mt-2 text-sm text-gray-600">يرجى إدخال بيانات الاعتماد للمتابعة</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">اسم المستخدم</label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="mt-1"
                placeholder="JOOD"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">كلمة المرور</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
                placeholder="••••••••"
              />
            </div>
          </div>
          <Button type="submit" className="w-full">دخول</Button>
        </form>
      </div>
    </div>
  );
}
