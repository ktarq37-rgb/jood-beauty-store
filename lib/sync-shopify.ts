import axios from "axios"
import { createClient } from "./supabase/server"

export async function syncShopifyProducts() {
  try {
    const shopUrl = "https://artiest-shop-sudan.myshopify.com"
    const response = await axios.get(`${shopUrl}/products.json?limit=250`)
    const shopifyProducts = response.data.products

    const supabase = await createClient()
    
    // Get existing product IDs to prevent duplicates
    const { data: existingProducts } = await supabase.from("products").select("external_id")
    const existingIds = new Set(existingProducts?.map(p => p.external_id) || [])

    const productsToInsert = shopifyProducts
      .filter((p: any) => !existingIds.has(p.id.toString()))
      .map((p: any) => ({
        external_id: p.id.toString(),
        name_en: p.title,
        name_ar: p.title,
        description_en: p.body_html,
        description_ar: p.body_html,
        price: parseFloat(p.variants[0]?.price || "0") * 1000,
        category: p.product_type || "General",
        brand: p.vendor,
        image: p.images[0]?.src || "",
        is_on_sale: !!p.variants[0]?.compare_at_price,
        discount_percentage: p.variants[0]?.compare_at_price 
          ? Math.round(((parseFloat(p.variants[0].compare_at_price) - parseFloat(p.variants[0].price)) / parseFloat(p.variants[0].compare_at_price)) * 100)
          : null
      }))

    if (productsToInsert.length === 0) {
      return { success: true, count: 0, message: "تمت مزامنة كافة المنتجات مسبقاً" }
    }

    const { error } = await supabase.from("products").insert(productsToInsert)
    
    if (error) throw error
    return { success: true, count: productsToInsert.length }
  } catch (error: any) {
    console.error("Sync Error:", error.message)
    return { success: false, error: error.message }
  }
}
