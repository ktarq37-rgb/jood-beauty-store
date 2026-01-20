"use client"

import { useCart } from "@/lib/cart-context"
import { formatPrice } from "@/lib/products-data"
import { Button } from "@/components/ui/button"
import { X, Plus, Minus, ShoppingBag, Trash2, Tag } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"
import { useState, useEffect } from "react"
import type { Coupon } from "@/lib/products-data"

export function SideCart() {
  const { items, removeFromCart, updateQuantity, totalPrice, isCartOpen, setIsCartOpen, clearCart } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [couponError, setCouponError] = useState("")

  // Load coupons from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCoupons = localStorage.getItem("jood_coupons")
      if (savedCoupons) {
        setCoupons(JSON.parse(savedCoupons))
      }
    }
  }, [])

  const applyCoupon = () => {
    setCouponError("")
    const coupon = coupons.find((c) => c.code.toUpperCase() === couponCode.toUpperCase() && c.isActive)
    if (coupon) {
      setAppliedCoupon(coupon)
      setCouponCode("")
    } else {
      setCouponError("كود الخصم غير صحيح أو منتهي الصلاحية")
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponError("")
  }

  const discountAmount = appliedCoupon ? (totalPrice * appliedCoupon.discount) / 100 : 0
  const finalPrice = totalPrice - discountAmount

  const handleCheckout = () => {
    if (items.length === 0) return

    const productsList = items
      .map((item) => `• ${item.nameAr} (${item.quantity}x) - ${formatPrice(item.price * item.quantity)}`)
      .join("\n")

    let message =
      `🛒 *طلب جديد من Jood Beauty*\n\n` +
      `📦 *المنتجات:*\n${productsList}\n\n` +
      `💰 *المجموع:* ${formatPrice(totalPrice)}\n`

    if (appliedCoupon) {
      message += `🎫 *كود الخصم:* ${appliedCoupon.code} (${appliedCoupon.discount}%)\n`
      message += `💵 *الخصم:* -${formatPrice(discountAmount)}\n`
    }

    message +=
      `✨ *المجموع النهائي:* ${formatPrice(finalPrice)}\n\n` +
      `💳 *يرجى إرسال صورة تحويل بنكك للتأكيد*\n\n` +
      `شكراً لتسوقك معنا! 💕`

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/249960964967?text=${encodedMessage}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <>
      {/* Overlay with smooth blur */}
      <div
        className={`fixed inset-0 bg-foreground/50 backdrop-blur-md z-50 transition-all duration-300 ease-out ${
          isCartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsCartOpen(false)}
      />

      {/* Side Cart Panel with smooth slide */}
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-md bg-card z-50 shadow-2xl transition-all duration-300 ease-out ${
          isCartOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "Tajawal, sans-serif" }}>
                سلة التسوق
              </h2>
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-bold">
                {items.length}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsCartOpen(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                </div>
                <p className="text-lg font-bold text-foreground mb-2">سلتك فارغة</p>
                <p className="text-muted-foreground text-sm">أضيفي منتجات للبدء بالتسوق</p>
                <Button
                  className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                  onClick={() => setIsCartOpen(false)}
                >
                  تسوقي الآن
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex gap-3 bg-muted/50 rounded-xl p-3 hover:bg-muted/80 transition-colors duration-200 fade-in-up">
                  <div className="w-20 h-20 bg-background rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.nameAr}
                      className="w-full h-full object-cover img-smooth"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-foreground line-clamp-2 mb-1">{item.nameAr}</h3>
                    <p className="text-primary font-bold text-sm mb-2">{formatPrice(item.price)}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-background rounded-full p-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-full"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-full"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:bg-destructive/10"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 border-t border-border space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  كود الخصم
                </label>
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="أدخل الكود"
                      className="flex-1 px-3 py-2 border-2 border-border rounded-lg focus:outline-none focus:border-primary text-sm"
                    />
                    <Button
                      onClick={applyCoupon}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-4"
                    >
                      تطبيق
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-green-100 border-2 border-green-500 rounded-lg p-3">
                    <div>
                      <p className="font-bold text-green-700">{appliedCoupon.code}</p>
                      <p className="text-sm text-green-600">خصم {appliedCoupon.discount}%</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={removeCoupon}
                      className="text-green-700 hover:bg-green-200"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {couponError && <p className="text-xs text-destructive">{couponError}</p>}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">المجموع</span>
                  <span className="font-bold text-foreground">{formatPrice(totalPrice)}</span>
                </div>
                {appliedCoupon && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-600">الخصم ({appliedCoupon.discount}%)</span>
                    <span className="font-bold text-green-600">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="font-bold text-foreground">المجموع النهائي</span>
                  <span className="text-2xl font-bold text-secondary">{formatPrice(finalPrice)}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-bold rounded-full flex items-center justify-center gap-2 btn-smooth active:scale-95 transition-all duration-200"
              >
                <FaWhatsapp className="h-6 w-6" />
                إتمام الطلب عبر واتساب
              </Button>

              <Button
                variant="outline"
                className="w-full border-destructive/30 text-destructive hover:bg-destructive/10 rounded-full bg-transparent"
                onClick={clearCart}
              >
                <Trash2 className="h-4 w-4 ml-2" />
                إفراغ السلة
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
