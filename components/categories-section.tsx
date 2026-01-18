"use client"

import type React from "react"
import { categories } from "@/lib/products-data"
import { Sparkles, Wind, Droplets, Heart } from "lucide-react"

const categoryImages: Record<string, string> = {
  skincare: "/luxury-skincare-products-korean-beauty-creams-seru.jpg",
  hair: "/luxury-hair-care-products-shampoo-mask-serum-pink-.jpg",
  body: "/luxury-body-lotion-cream-spa-products-pink-gold-el.jpg",
  personal: "/luxury-cosmetics-lipstick-makeup-beauty-products-p.jpg",
}

const categoryIcons: Record<string, React.ReactNode> = {
  skincare: <Sparkles className="w-5 h-5" />,
  hair: <Wind className="w-5 h-5" />,
  body: <Droplets className="w-5 h-5" />,
  personal: <Heart className="w-5 h-5" />,
}

export function CategoriesSection() {
  const scrollToCategory = (categoryId: string) => {
    const element = document.getElementById(categoryId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <section className="py-12 bg-gradient-to-b from-pink-50/50 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2
            className="text-2xl md:text-3xl font-bold text-foreground mb-3"
            style={{ fontFamily: "Tajawal, sans-serif" }}
          >
            تسوقي حسب <span className="text-primary">الفئة</span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            اختاري من بين مجموعتنا المتنوعة من منتجات العناية بالجمال
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => scrollToCategory(category.id)}
              className="group relative overflow-hidden rounded-2xl bg-card hover:shadow-xl transition-all duration-300 border-2 border-primary/20 hover:border-primary cursor-pointer text-right"
            >
              {/* Image */}
              <div className="relative w-full aspect-[4/3] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent z-10" />
                <img
                  src={categoryImages[category.id] || "/placeholder.svg"}
                  alt={category.nameAr}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Icon Badge */}
                <div className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur-sm p-2 rounded-full text-primary shadow-md">
                  {categoryIcons[category.id]}
                </div>

                {/* Category Name Overlay */}
                <div className="absolute bottom-3 right-3 left-3 z-20">
                  <h3
                    className="font-bold text-white text-base md:text-lg drop-shadow-lg"
                    style={{ fontFamily: "Tajawal, sans-serif" }}
                  >
                    {category.nameAr}
                  </h3>
                </div>
              </div>

              {/* Hover Effect Bar */}
              <div className="h-1 bg-gradient-to-l from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right" />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
