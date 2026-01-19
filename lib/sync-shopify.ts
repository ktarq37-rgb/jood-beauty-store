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
      .map((p: any) => {
        const title = p.title.toLowerCase();
        let category = "other";
        let subcategory = "other";

        if (title.includes("serum") || title.includes("سيروم")) {
          category = "skincare";
          subcategory = "serums";
        } else if (title.includes("cream") || title.includes("كريم") || title.includes("moisturizer")) {
          category = "skincare";
          subcategory = "creams";
        } else if (title.includes("toner") || title.includes("تونر")) {
          category = "skincare";
          subcategory = "toners";
        } else if (title.includes("mask") || title.includes("ماسك") || title.includes("pad")) {
          category = "skincare";
          subcategory = "masks";
        } else if (title.includes("sun") || title.includes("شمس")) {
          category = "skincare";
          subcategory = "sunscreen";
        } else if (title.includes("hair") || title.includes("شعر")) {
          category = "hair";
          subcategory = title.includes("mask") ? "masks" : "other";
        } else if (p.product_type === "Skin Care") {
          category = "skincare";
        } else if (p.product_type === "Hair Care") {
          category = "hair";
        }

        return {
          external_id: p.id.toString(),
          name_en: p.title,
          name_ar: p.title,
          description_en: p.body_html,
          description_ar: p.body_html,
          price: parseFloat(p.variants[0]?.price || "0") * 1000,
          category: category,
          subcategory: subcategory,
          brand: p.vendor,
          image: p.images[0]?.src || "",
          is_on_sale: !!p.variants[0]?.compare_at_price,
          discount_percentage: p.variants[0]?.compare_at_price 
            ? Math.round(((parseFloat(p.variants[0].compare_at_price) - parseFloat(p.variants[0].price)) / parseFloat(p.variants[0].compare_at_price)) * 100)
            : null
        };
      })

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
