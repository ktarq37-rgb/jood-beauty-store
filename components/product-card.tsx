"use client"

import type React from "react"
import { useState } from "react"
import { type Product, formatPrice } from "@/lib/products-data"
import { useCart } from "@/lib/cart-context"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Eye, X, Minus, Plus } from "lucide-react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { language, t } = useLanguage()
  const [showDetails, setShowDetails] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const handleAddToCart = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    setQuantity(1)
  }

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0

  const productName = language === "ar" ? product.nameAr : product.name
  const categoryName = language === "ar" ? product.categoryAr : product.category
  const productDescription = language === "ar" ? product.descriptionAr : product.description

  return (
    <>
      <div className="group bg-card rounded-xl overflow-hidden border-2 border-primary/20 hover:border-primary hover:shadow-lg transition-all duration-300 product-card-glow hover-lift">
        {/* Image Section */}
        <div
          className="relative aspect-square overflow-hidden bg-gradient-to-br from-pink-50 to-pink-100 cursor-pointer"
          onClick={() => setShowDetails(true)}
        >
          <img
            src={product.image || "/placeholder.svg"}
            alt={productName}
            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500 ease-out img-smooth"
          />

          {product.isOnSale && discountPercent > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              {t("sale")} {discountPercent}%
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowDetails(true)
            }}
            className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-white"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>

        <div className="p-3 bg-gradient-to-b from-pink-50/50 to-card border-t-2 border-primary/10">
          <p className="text-[10px] text-primary font-semibold mb-1 truncate">{product.brand}</p>

          <h3 className="font-bold text-foreground text-xs leading-tight line-clamp-2 mb-2 min-h-[2rem]">
            {productName}
          </h3>

          <div className="flex items-center justify-between gap-2 pt-2 border-t border-primary/10">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-secondary leading-tight">
                {formatPrice(product.price, language)}
              </span>
              {product.originalPrice && discountPercent > 0 && (
                <span className="text-[10px] text-muted-foreground line-through">
                  {formatPrice(product.originalPrice, language)}
                </span>
              )}
            </div>

            <Button
              onClick={handleAddToCart}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground text-[11px] px-3 py-1 h-8 rounded-full gap-1 btn-smooth active:scale-95"
            >
              <ShoppingBag className="h-3 w-3" />
              {language === "ar" ? "أضيفي" : "Add"}
            </Button>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      {showDetails && (
        <>
          <div className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50" onClick={() => setShowDetails(false)} />
          <div className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-lg md:w-full bg-card rounded-2xl z-50 overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="relative">
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm rounded-full hover:bg-primary hover:text-white"
                onClick={() => setShowDetails(false)}
              >
                <X className="h-5 w-5" />
              </Button>

              {/* Product Image */}
              <div className="aspect-square bg-gradient-to-br from-pink-50 to-pink-100">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={productName}
                  className="w-full h-full object-contain p-8"
                />
              </div>

              {/* Product Info */}
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-xs text-primary font-semibold mb-1">
                    {product.brand} • {categoryName}
                  </p>
                  <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "Tajawal, sans-serif" }}>
                    {productName}
                  </h2>
                </div>

                <p className="text-muted-foreground text-sm">
                  {productDescription ||
                    (language === "ar"
                      ? "منتج أصلي 100% من أفضل الماركات العالمية. مناسب لجميع أنواع البشرة. يمنحك نتائج مذهلة من أول استخدام."
                      : "100% authentic product from the best international brands. Suitable for all skin types. Gives amazing results from first use.")}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-bold text-secondary">{formatPrice(product.price, language)}</span>
                  {product.originalPrice && discountPercent > 0 && (
                    <span className="text-base text-muted-foreground line-through">
                      {formatPrice(product.originalPrice, language)}
                    </span>
                  )}
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-foreground">الكمية:</span>
                  <div className="flex items-center gap-2 bg-muted rounded-full p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 rounded-full bg-card flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-bold">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-8 h-8 rounded-full bg-card flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                  onClick={() => {
                    handleAddToCart()
                    setShowDetails(false)
                  }}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-5 text-base font-bold rounded-full"
                >
                  <ShoppingBag className="h-5 w-5 ml-2" />
                  {language === "ar" ? "أضيفي للسلة" : "Add to Cart"}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
