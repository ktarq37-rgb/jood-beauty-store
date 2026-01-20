"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getProductsAction() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) throw new Error(error.message)
  return data
}

export async function upsertProductAction(formData: FormData) {
  const supabase = await createClient()
  
  const id = formData.get("id") as string
  const product = {
    name_ar: formData.get("name_ar"),
    name_en: formData.get("name_en"),
    description_ar: formData.get("description_ar"),
    description_en: formData.get("description_en"),
    price: parseFloat(formData.get("price") as string),
    original_price: formData.get("original_price") ? parseFloat(formData.get("original_price") as string) : null,
    category: formData.get("category"),
    subcategory: formData.get("subcategory"),
    brand: formData.get("brand"),
    image: formData.get("image"),
    is_on_sale: formData.get("is_on_sale") === "true",
    discount_percentage: formData.get("discount_percentage") ? parseFloat(formData.get("discount_percentage") as string) : null,
  }

  let error
  if (id) {
    const { error: updateError } = await supabase
      .from("products")
      .update(product)
      .eq("id", id)
    error = updateError
  } else {
    const { error: insertError } = await supabase
      .from("products")
      .insert([product])
    error = insertError
  }

  if (error) throw new Error(error.message)
  
  revalidatePath("/")
  revalidatePath("/admin-dashboard")
}

export async function deleteProductAction(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) throw new Error(error.message)
  
  revalidatePath("/")
  revalidatePath("/admin-dashboard")
}

export async function getSettingsAction() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("settings").select("*").single()
  if (error && error.code !== 'PGRST116') throw new Error(error.message)
  return data || { announcement_text: "تخفيضات بمناسبة الافتتاح", show_announcement: true }
}

export async function updateSettingsAction(settings: any) {
  const supabase = await createClient()
  const { data: existing } = await supabase.from("settings").select("id").single()
  const { error } = await supabase.from("settings").upsert({ 
    id: existing?.id || undefined, 
    ...settings 
  })
  if (error) throw new Error(error.message)
  revalidatePath("/")
}

export async function getCouponsAction() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("coupons").select("*")
  if (error) throw new Error(error.message)
  return data
}

export async function upsertCouponAction(coupon: any) {
  const supabase = await createClient()
  // Ensure we map the frontend 'discount' to DB 'discount_percent'
  const dbCoupon = {
    code: coupon.code,
    discount_percent: coupon.discount,
    is_active: true
  }
  const { error } = await supabase.from("coupons").upsert(dbCoupon, { onConflict: 'code' })
  if (error) throw new Error(error.message)
  revalidatePath("/")
}

export async function deleteCouponAction(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("coupons").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/")
}
