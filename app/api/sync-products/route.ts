import { NextResponse } from 'next/server'
import { products as allProducts } from '@/lib/products-data'
import { createClient } from '@supabase/supabase-js'

export async function POST() {
  try {
    console.log('[v0] Starting sync of all products to Supabase...')
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Map all 140 products to Supabase schema
    const productsToInsert = allProducts.map(p => ({
      name_ar: p.nameAr || p.name,
      name_en: p.name,
      description_ar: p.descriptionAr || 'منتج أصلي 100% من أفضل الماركات العالمية',
      description_en: p.description || '100% Original Product from the Best International Brands',
      price: p.price,
      original_price: p.originalPrice || p.price,
      category: p.category,
      category_ar: p.categoryAr,
      subcategory: p.subcategory || '',
      subcategory_ar: p.subcategoryAr || '',
      brand: p.brand,
      image: p.image,
      is_on_sale: p.isOnSale || false,
      discount_percentage: p.discountPercent || null,
    }))

    console.log(`[v0] Inserting ${productsToInsert.length} products...`)

    // Insert in batches of 50 to avoid timeout
    const batchSize = 50
    let insertedCount = 0

    for (let i = 0; i < productsToInsert.length; i += batchSize) {
      const batch = productsToInsert.slice(i, i + batchSize)
      const { data, error } = await supabase
        .from('products')
        .insert(batch)

      if (error) {
        console.error(`[v0] Error inserting batch ${i / batchSize + 1}:`, error)
        throw error
      }

      insertedCount += batch.length
      console.log(`[v0] Inserted ${insertedCount}/${productsToInsert.length} products`)
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${productsToInsert.length} products to Supabase`,
      count: productsToInsert.length,
    })
  } catch (error) {
    console.error('[v0] Error in sync-products:', error)
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    )
  }
}
