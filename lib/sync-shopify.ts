import axios from "axios"
import { createClient } from "./supabase/server"

export async function syncShopifyProducts() {
  try {
    const shopUrl = "https://artiest-shop-sudan.myshopify.com"
    const response = await axios.get(`${shopUrl}/products.json`)
    const shopifyProducts = response.data.products

    const supabase = await createClient()
    
    const productsToInsert = shopifyProducts.map((p: any) => ({
      name_en: p.title,
      name_ar: p.title, // Shopify products usually in one language, will need manual translation later or AI
      description_en: p.body_html,
      description_ar: p.body_html,
      price: parseFloat(p.variants[0]?.price || "0") * 1000, // Dummy conversion to IQD or similar
      category: p.product_type || "General",
      brand: p.vendor,
      image: p.images[0]?.src || "",
      is_on_sale: !!p.variants[0]?.compare_at_price,
      discount_percentage: p.variants[0]?.compare_at_price 
        ? Math.round(((p.variants[0].compare_at_price - p.variants[0].price) / p.variants[0].compare_at_price) * 100)
        : null
    }))

    // Delete old products and insert new ones or upsert
    // For simplicity in this turn, we'll insert them
    const { error } = await supabase.from("products").insert(productsToInsert)
    
    if (error) throw error
    return { success: true, count: productsToInsert.length }
  } catch (error: any) {
    console.error("Sync Error:", error.message)
    return { success: false, error: error.message }
  }
}
