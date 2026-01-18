import { createClient } from "@/lib/supabase/client"

export interface SiteSetting {
  id: string
  banner_text: string
  banner_visible: boolean
  updated_at: string
}

export async function getBannerSettings(): Promise<SiteSetting | null> {
  console.log("[v0] getBannerSettings called")
  const supabase = createClient()

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .single()

  if (error) {
    console.error("[v0] Error fetching banner settings:", error.message)
    return null
  }

  console.log("[v0] Banner settings fetched:", data)
  return data
}

export async function updateBannerSettings(
  bannerText: string,
  bannerVisible: boolean,
): Promise<SiteSetting | null> {
  console.log("[v0] updateBannerSettings called with text:", bannerText, "visible:", bannerVisible)
  const supabase = createClient()

  const { data, error } = await supabase
    .from("site_settings")
    .update({
      banner_text: bannerText,
      banner_visible: bannerVisible,
      updated_at: new Date().toISOString(),
    })
    .eq("id", "default")
    .select()
    .single()

  if (error) {
    console.error("[v0] Error updating banner settings:", error.message, error.details)
    return null
  }

  console.log("[v0] Banner settings updated successfully")
  return data
}

export async function getCoupons(): Promise<any[]> {
  console.log("[v0] getCoupons called")
  const supabase = createClient()

  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching coupons:", error.message)
    return []
  }

  console.log("[v0] Coupons fetched:", data?.length || 0)
  return data || []
}

export async function createCoupon(code: string, discountPercentage: number): Promise<any | null> {
  console.log("[v0] createCoupon called with code:", code, "discount:", discountPercentage)
  const supabase = createClient()

  const { data, error } = await supabase
    .from("coupons")
    .insert([
      {
        code,
        discount_percentage: discountPercentage,
        is_active: true,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating coupon:", error.message, error.details)
    return null
  }

  console.log("[v0] Coupon created successfully:", data)
  return data
}

export async function updateCouponStatus(couponId: string, isActive: boolean): Promise<any | null> {
  console.log("[v0] updateCouponStatus called for:", couponId, "active:", isActive)
  const supabase = createClient()

  const { data, error } = await supabase
    .from("coupons")
    .update({ is_active: isActive })
    .eq("id", couponId)
    .select()
    .single()

  if (error) {
    console.error("[v0] Error updating coupon status:", error.message, error.details)
    return null
  }

  console.log("[v0] Coupon status updated successfully")
  return data
}

export async function deleteCoupon(couponId: string): Promise<boolean> {
  console.log("[v0] deleteCoupon called for:", couponId)
  const supabase = createClient()

  const { error } = await supabase
    .from("coupons")
    .delete()
    .eq("id", couponId)

  if (error) {
    console.error("[v0] Error deleting coupon:", error.message, error.details)
    return false
  }

  console.log("[v0] Coupon deleted successfully")
  return true
}
