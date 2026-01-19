"use client"

import { categories, subcategories } from "@/lib/products-data"
import { ProductCard } from "./product-card"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export function ProductsSection() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubcategory, setSelectedSubcategory] = useState<{ [key: string]: string }>({})
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null)

  useEffect(() => {
    async function loadProducts() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (!error && data) {
        setProducts(data)
      }
      setLoading(false)
    }

    loadProducts()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-pulse text-muted-foreground">جاري تحميل المنتجات...</div>
      </div>
    )
  }

  const allBrands = Array.from(new Set(products.map((p) => p.brand))).filter(Boolean).sort()

  return (
    <section id="products-section" className="py-16 scroll-mt-24">
      <div className="container mx-auto px-4">
        {/* Brands Section */}
        {!selectedBrand && (
          <div className="mb-12 bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 border-2 border-pink-200">
            <h3 className="text-xl font-bold text-pink-600 mb-4" style={{ fontFamily: "Tajawal, sans-serif" }}>
              تسوقي حسب الماركة
            </h3>
            <div className="flex flex-wrap gap-2">
              {allBrands.slice(0, 15).map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className="px-4 py-2 rounded-full font-bold transition-all bg-white text-gray-700 hover:bg-pink-100 border-2 border-pink-200"
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Brand Filter View */}
        {selectedBrand ? (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-2xl md:text-3xl font-bold text-foreground"
                style={{ fontFamily: "Tajawal, sans-serif" }}
              >
                منتجات {selectedBrand}
              </h2>
              <button
                onClick={() => setSelectedBrand(null)}
                className="bg-pink-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-pink-700 transition-all"
              >
                العودة لجميع المنتجات
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products
                .filter((p) => p.brand === selectedBrand)
                .map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
            </div>
          </div>
        ) : (
          <>
            {categories.map((category) => {
              // Get products for this category
              let categoryProducts = products.filter((p) => p.category === category.id)

              // Apply subcategory filter if selected for THIS category
              const activeSubcategory = selectedSubcategory[category.id]
              if (activeSubcategory) {
                categoryProducts = categoryProducts.filter((p) => p.subcategory === activeSubcategory)
              }

              // Don't render category if no products
              if (categoryProducts.length === 0) return null

              return (
                <div key={category.id} id={category.id} className="mb-16 last:mb-0 scroll-mt-24">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-8 bg-primary rounded-full" />
                      <h2
                        className="text-2xl md:text-3xl font-bold text-foreground"
                        style={{ fontFamily: "Tajawal, sans-serif" }}
                      >
                        {category.nameAr}
                      </h2>
                    </div>
                  </div>

                  {/* Subcategory Filter Buttons */}
                  {subcategories[category.id] && (
                    <div className="mb-6 flex flex-wrap gap-2">
                      <button
                        onClick={() =>
                          setSelectedSubcategory((prev) => {
                            const newState = { ...prev }
                            delete newState[category.id]
                            return newState
                          })
                        }
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                          !activeSubcategory
                            ? "bg-pink-600 text-white shadow-md"
                            : "bg-pink-100 text-pink-700 hover:bg-pink-200"
                        }`}
                      >
                        الكل ({products.filter((p) => p.category === category.id).length})
                      </button>
                      {subcategories[category.id].map((sub) => {
                        const count = products.filter(
                          (p) => p.category === category.id && p.subcategory === sub.id,
                        ).length
                        return (
                          <button
                            key={sub.id}
                            onClick={() =>
                              setSelectedSubcategory((prev) => ({
                                ...prev,
                                [category.id]: sub.id,
                              }))
                            }
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                              activeSubcategory === sub.id
                                ? "bg-pink-600 text-white shadow-md"
                                : "bg-pink-100 text-pink-700 hover:bg-pink-200"
                            }`}
                          >
                            {sub.nameAr} ({count})
                          </button>
                        )
                      })}
                    </div>
                  )}

                  {/* Products Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {categoryProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>
    </section>
  )
}
