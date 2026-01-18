"use server"

import { cookies } from "next/headers"

export async function loginAction(formData: FormData) {
  const username = formData.get("username")
  const password = formData.get("password")

  if (username === "JOOD" && password === "tyfgaszxM2") {
    const cookieStore = await cookies()
    cookieStore.set("admin_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    })
    return { success: true }
  }

  return { success: false, error: "بيانات الدخول غير صحيحة" }
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_auth")
}
