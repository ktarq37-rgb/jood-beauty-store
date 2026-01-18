import { createClient } from "@/lib/supabase/client"

export interface SupabaseProduct {
  id: string
  name_ar: string
  name_en: string
  description_ar: string
  description_en: string
  price: number
  original_price: number | null
  category: string
  subcategory: string
  brand: string
  image: string
  is_on_sale: boolean
  discount_percentage: number | null
  created_at: string
  updated_at: string
}

export async function getAllProducts(): Promise<SupabaseProduct[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("[v0] Error fetching products:", error)
    return []
  }

  return data || []
}

export async function getProductById(id: string): Promise<SupabaseProduct | null> {
  const supabase = createClient()
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error) {
    console.error("[v0] Error fetching product:", error)
    return null
  }

  return data
}

export async function createProduct(
  product: Omit<SupabaseProduct, "id" | "created_at" | "updated_at">,
): Promise<SupabaseProduct | null> {
  console.log("[v0] createProduct called with:", product)
  const supabase = createClient()
  console.log("[v0] Supabase client created")
  
  const { data, error } = await supabase.from("products").insert([product]).select().single()

  if (error) {
    console.error("[v0] Error creating product - Status:", error.code, "Message:", error.message, "Details:", error.details)
    return null
  }

  console.log("[v0] Product created successfully:", data?.id)
  return data
}

export async function updateProduct(id: string, updates: Partial<SupabaseProduct>): Promise<SupabaseProduct | null> {
  console.log("[v0] updateProduct called with id:", id, "updates:", updates)
  const supabase = createClient()
  console.log("[v0] Supabase client created")
  
  const { data, error } = await supabase.from("products").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("[v0] Error updating product - Status:", error.code, "Message:", error.message, "Details:", error.details)
    return null
  }

  console.log("[v0] Product updated successfully:", id)
  return data
}

export async function deleteProduct(id: string): Promise<boolean> {
  console.log("[v0] deleteProduct called with id:", id)
  const supabase = createClient()
  console.log("[v0] Supabase client created")
  
  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    console.error("[v0] Error deleting product - Status:", error.code, "Message:", error.message, "Details:", error.details)
    return false
  }

  console.log("[v0] Product deleted successfully:", id)
  return true
}
