import { createClient } from '@/lib/supabase/client'
import { products } from '@/lib/products-data'

export async function syncAllProductsToSupabase() {
  const supabase = createClient()
  
  try {
    // Delete existing products
    await supabase.from('products').delete().neq('id', '')
    
    // Transform products to match database schema
    const productsToInsert = products.map(p => ({
      name_ar: p.nameAr || p.name,
      name_en: p.name,
      description_ar: p.descriptionAr || 'منتج أصلي من أفضل الماركات العالمية',
      description_en: p.description || '100% Original Product',
      price: p.price,
      original_price: p.originalPrice || p.price,
      category: p.category,
      category_ar: p.categoryAr || '',
      subcategory: p.subcategory || '',
      subcategory_ar: p.subcategoryAr || '',
      brand: p.brand,
      image: p.image,
      is_on_sale: p.isOnSale || false,
      discount_percentage: p.discountPercent || null,
    }))
    
    // Insert all products in batches to avoid size limits
    const batchSize = 50
    for (let i = 0; i < productsToInsert.length; i += batchSize) {
      const batch = productsToInsert.slice(i, i + batchSize)
      const { error } = await supabase.from('products').insert(batch)
      
      if (error) {
        console.error(`[v0] Error inserting batch ${i / batchSize + 1}:`, error)
        return { success: false, error: error.message }
      }
      
      console.log(`[v0] Inserted batch ${i / batchSize + 1}/${Math.ceil(productsToInsert.length / batchSize)}`)
    }
    
    console.log(`[v0] Successfully synced ${productsToInsert.length} products to Supabase`)
    return { success: true, count: productsToInsert.length }
  } catch (err) {
    console.error('[v0] Error in syncAllProductsToSupabase:', err)
    return { success: false, error: String(err) }
  }
}
