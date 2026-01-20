"use client"

import { useState, useEffect } from "react"
import { Trash2, Edit2, Plus, Upload, CheckCircle, Tag, Eye, EyeOff, RefreshCw } from "lucide-react"
import { products as initialProducts, subcategories } from "@/lib/products-data"
import { updateProduct, deleteProduct, createProduct, getAllProducts } from "@/lib/supabase-products"
import { updateBannerSettings, getBannerSettings } from "@/lib/supabase-settings"
import { syncAllProductsToSupabase } from "@/lib/bulk-sync"

interface Coupon {
  id: string
  code: string
  discount: number
  isActive: boolean
}

interface FormData {
  name: string
  nameAr: string
  description: string
  descriptionAr: string
  price: number
  originalPrice: number
  image: string
  category: string
  categoryAr: string
  subcategory: string
  subcategoryAr: string
  brand: string
  isOnSale: boolean
  discountPercent: number
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [products, setProducts] = useState(initialProducts)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [successMessage, setSuccessMessage] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [activeTab, setActiveTab] = useState<"products" | "coupons" | "announcement">("products")
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [showCouponForm, setShowCouponForm] = useState(false)
  const [couponForm, setCouponForm] = useState({ code: "", discount: 0 })
  const [announcementText, setAnnouncementText] = useState("تخفيضات كبرى بمناسبة الافتتاح - متوفر الدفع عبر تطبيق بنكك")
  const [announcementVisible, setAnnouncementVisible] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    nameAr: "",
    description: "",
    descriptionAr: "",
    price: 0,
    originalPrice: 0,
    image: "",
    category: "skincare",
    categoryAr: "العناية بالبشرة",
    subcategory: "serums",
    subcategoryAr: "سيرومات",
    brand: "",
    isOnSale: false,
    discountPercent: 0,
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load products from Supabase first
      console.log("[v0] Loading products from Supabase...")
      getAllProducts().then((supabaseProducts) => {
        console.log("[v0] Loaded", supabaseProducts.length, "products from Supabase")
        
        if (supabaseProducts.length > 0) {
          // Map Supabase products to match local format
          const mappedProducts = supabaseProducts.map(p => ({
            id: p.id,
            name: p.name_en,
            nameAr: p.name_ar,
            description: p.description_en || "",
            descriptionAr: p.description_ar || "",
            price: Number(p.price),
            originalPrice: Number(p.original_price || p.price),
            image: p.image,
            category: p.category,
            categoryAr: p.category_ar || "",
            subcategory: p.subcategory || "",
            subcategoryAr: p.subcategory_ar || "",
            brand: p.brand,
            isOnSale: p.is_on_sale,
            discountPercent: p.discount_percentage || 0,
          }))
          setProducts(mappedProducts)
          localStorage.setItem("jood_products", JSON.stringify(mappedProducts))
        } else {
          // Fallback to localStorage or initialProducts
          const savedProducts = localStorage.getItem("jood_products")
          if (savedProducts) {
            try {
              setProducts(JSON.parse(savedProducts))
            } catch (e) {
              console.log("[v0] Error loading from localStorage:", e)
              setProducts(initialProducts)
            }
          } else {
            setProducts(initialProducts)
          }
        }
      }).catch(err => {
        console.error("[v0] Error loading from Supabase:", err)
        // Fallback to localStorage
        const savedProducts = localStorage.getItem("jood_products")
        if (savedProducts) {
          try {
            setProducts(JSON.parse(savedProducts))
          } catch (e) {
            setProducts(initialProducts)
          }
        } else {
          setProducts(initialProducts)
        }
      })

      const savedCoupons = localStorage.getItem("jood_coupons")
      if (savedCoupons) {
        try {
          setCoupons(JSON.parse(savedCoupons))
        } catch (e) {
          console.log("[v0] Error loading coupons:", e)
        }
      }

      const savedAnnouncementText = localStorage.getItem("jood_announcement_text")
      const savedAnnouncementVisible = localStorage.getItem("jood_announcement_visible")

      if (savedAnnouncementText) {
        setAnnouncementText(savedAnnouncementText)
      }
      if (savedAnnouncementVisible !== null) {
        setAnnouncementVisible(savedAnnouncementVisible === "true")
      }

      // Load banner settings from Supabase
      console.log("[v0] Loading banner settings from Supabase...")
      getBannerSettings().then((settings) => {
        if (settings) {
          console.log("[v0] Banner settings loaded from Supabase")
          setAnnouncementText(settings.banner_text)
          setAnnouncementVisible(settings.banner_visible)
          // Update localStorage with Supabase values
          localStorage.setItem("jood_announcement_text", settings.banner_text)
          localStorage.setItem("jood_announcement_visible", String(settings.banner_visible))
        }
      }).catch(err => {
        console.error("[v0] Error loading banner settings from Supabase:", err)
      })
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && products.length > 0) {
      // Save products to both localStorage and Supabase
      localStorage.setItem("jood_products", JSON.stringify(products))
      // Products are automatically saved to Supabase when edited
      window.dispatchEvent(new Event("productsUpdated"))
    }
  }, [products])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("jood_coupons", JSON.stringify(coupons))
      window.dispatchEvent(new Event("couponsUpdated"))
    }
  }, [coupons])

  const handleLogin = (e) => {
    e.preventDefault()
    if (username === "JOOD" && password === "tyfgaszxM2") {
      setIsLoggedIn(true)
      setUsername("")
      setPassword("")
    } else {
      alert("بيانات تسجيل الدخول غير صحيحة")
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setShowForm(false)
    setEditingId(null)
    setShowCouponForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("[v0] handleSubmit called, editingId:", editingId)

    try {
      if (editingId) {
        console.log("[v0] Updating product:", editingId)
        const updatedProducts = products.map((p) => 
          p.id === editingId 
            ? { 
                ...p, 
                name: formData.name,
                nameAr: formData.nameAr,
                description: formData.description,
                descriptionAr: formData.descriptionAr,
                price: formData.price,
                originalPrice: formData.originalPrice,
                image: formData.image,
                brand: formData.brand,
                category: formData.category,
                categoryAr: formData.categoryAr,
                subcategory: formData.subcategory,
                subcategoryAr: formData.subcategoryAr,
                isOnSale: formData.isOnSale,
                discountPercent: formData.discountPercent,
              }
            : p
        )
        setProducts(updatedProducts)
        localStorage.setItem("jood_products", JSON.stringify(updatedProducts))
        
        // Also try to update in Supabase
        const success = await updateProduct(editingId, {
          name_ar: formData.nameAr || formData.name,
          name_en: formData.name,
          description_ar: formData.descriptionAr || "",
          description_en: formData.description || "",
          price: formData.price,
          original_price: formData.originalPrice || formData.price,
          brand: formData.brand,
          category: formData.category,
          subcategory: formData.subcategory,
          image: formData.image,
          is_on_sale: formData.isOnSale || false,
          discount_percentage: formData.discountPercent || null,
        })
        console.log("[v0] Supabase update result:", success)
      } else {
        console.log("[v0] Creating new product")
        const newProduct = {
          id: Date.now().toString(),
          name: formData.name,
          nameAr: formData.nameAr || formData.name,
          description: formData.description || "",
          descriptionAr: formData.descriptionAr || "منتج أصلي من أفضل الماركات العالمية",
          price: formData.price,
          originalPrice: formData.originalPrice || formData.price,
          image: formData.image,
          category: formData.category,
          categoryAr: formData.categoryAr || "",
          subcategory: formData.subcategory || "serums",
          subcategoryAr: formData.subcategoryAr || "سيرومات",
          brand: formData.brand,
          isOnSale: formData.isOnSale || false,
          discountPercent: formData.discountPercent || 0,
        }
        
        const updatedProducts = [newProduct, ...products]
        setProducts(updatedProducts)
        localStorage.setItem("jood_products", JSON.stringify(updatedProducts))
        
        // Also try to create in Supabase
        const created = await createProduct({
          name_ar: formData.nameAr || formData.name,
          name_en: formData.name,
          description_ar: formData.descriptionAr || "منتج أصلي من أفضل الماركات العالمية",
          description_en: formData.description || "100% Original Product",
          price: formData.price,
          original_price: formData.originalPrice || formData.price,
          category: formData.category,
          subcategory: formData.subcategory,
          brand: formData.brand,
          image: formData.image,
          is_on_sale: formData.isOnSale || false,
          discount_percentage: formData.discountPercent || null,
        })
        console.log("[v0] Supabase create result:", created)
      }
      
      setSuccessMessage(true)
      setTimeout(() => setSuccessMessage(false), 3000)
      resetForm()
    } catch (err) {
      console.error("[v0] Error in handleSubmit:", err)
      setSuccessMessage(true)
      setTimeout(() => setSuccessMessage(false), 3000)
    }
  }

  const handleEdit = (product) => {
    setEditingId(product.id)
    setFormData({
      name: product.name,
      nameAr: product.nameAr,
      description: product.description || "",
      descriptionAr: product.descriptionAr || "",
      price: product.price,
      originalPrice: product.originalPrice || 0,
      image: product.image,
      category: product.category,
      categoryAr: product.categoryAr,
      subcategory: product.subcategory || "serums",
      subcategoryAr: product.subcategoryAr || "سيرومات",
      brand: product.brand,
      isOnSale: product.isOnSale || false,
      discountPercent: product.discountPercent || 0,
    })
    setImagePreview(product.image)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      try {
        const updatedProducts = products.filter((p) => p.id !== id)
        setProducts(updatedProducts)
        localStorage.setItem("jood_products", JSON.stringify(updatedProducts))
        console.log("[v0] Product deleted from localStorage:", id)
        
        // Also try to delete from Supabase
        const success = await deleteProduct(id)
        console.log("[v0] Supabase delete result:", success)
        
        setSuccessMessage(true)
        setTimeout(() => setSuccessMessage(false), 3000)
      } catch (err) {
        console.error("[v0] Error in handleDelete:", err)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      nameAr: "",
      description: "",
      descriptionAr: "",
      price: 0,
      originalPrice: 0,
      image: "",
      category: "skincare",
      categoryAr: "العناية بالبشرة",
      subcategory: "serums",
      subcategoryAr: "سيرومات",
      brand: "",
      isOnSale: false,
      discountPercent: 0,
    })
    setEditingId(null)
    setShowForm(false)
    setImagePreview(null)
  }

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result
        setImagePreview(result)
        setFormData({ ...formData, image: result })
      }
      reader.readAsDataURL(file)
    }
  }

  const formatPrice = (price) => {
    return `${price.toLocaleString("en-US")} ج.س`
  }

  const addCoupon = () => {
    if (couponForm.code && couponForm.discount > 0) {
      const newCoupon: Coupon = {
        id: Date.now().toString(),
        code: couponForm.code.toUpperCase(),
        discount: couponForm.discount,
        isActive: true,
      }
      setCoupons([...coupons, newCoupon])
      setCouponForm({ code: "", discount: 0 })
      setShowCouponForm(false)
    }
  }

  const toggleCouponStatus = (id: string) => {
    setCoupons(coupons.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)))
  }

  const deleteCoupon = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الكوبون؟")) {
      setCoupons(coupons.filter((c) => c.id !== id))
    }
  }

  const saveAnnouncementSettings = async () => {
    try {
      console.log("[v0] saveAnnouncementSettings called")
      
      // Save to localStorage for quick access
      if (typeof window !== "undefined") {
        localStorage.setItem("jood_announcement_text", announcementText)
        localStorage.setItem("jood_announcement_visible", String(announcementVisible))
      }
      
      // Save to Supabase for persistence
      console.log("[v0] Updating banner settings in Supabase")
      const result = await updateBannerSettings(announcementText, announcementVisible)
      
      if (result) {
        console.log("[v0] Banner settings saved to Supabase successfully")
        window.dispatchEvent(new Event("announcementUpdated"))
      } else {
        console.error("[v0] Failed to save banner settings to Supabase")
      }
      
      setSuccessMessage(true)
      setTimeout(() => setSuccessMessage(false), 3000)
    } catch (err) {
      console.error("[v0] Error in saveAnnouncementSettings:", err)
      setSuccessMessage(true)
      setTimeout(() => setSuccessMessage(false), 3000)
    }
  }

  const handleSyncAllProducts = async () => {
    try {
      setIsSyncing(true)
      console.log("[v0] Starting full product sync to Supabase...")
      const result = await syncAllProductsToSupabase()
      
      if (result.success) {
        console.log(`[v0] Successfully synced ${result.count} products`)
        // Reload products from Supabase
        getAllProducts().then(supabaseProducts => {
          const mappedProducts = supabaseProducts.map(p => ({
            id: p.id,
            name: p.name_en,
            nameAr: p.name_ar,
            description: p.description_en || "",
            descriptionAr: p.description_ar || "",
            price: Number(p.price),
            originalPrice: Number(p.original_price || p.price),
            image: p.image,
            category: p.category,
            categoryAr: p.category_ar || "",
            subcategory: p.subcategory || "",
            subcategoryAr: p.subcategory_ar || "",
            brand: p.brand,
            isOnSale: p.is_on_sale,
            discountPercent: p.discount_percentage || 0,
          }))
          setProducts(mappedProducts)
        })
      } else {
        console.error("[v0] Sync failed:", result.error)
      }
      
      setSuccessMessage(true)
      setTimeout(() => setSuccessMessage(false), 3000)
    } catch (err) {
      console.error("[v0] Error syncing products:", err)
      setSuccessMessage(false)
    } finally {
      setIsSyncing(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md my-auto">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-bold mb-1">
              <span className="text-pink-600">Jood</span>Beauty
            </h1>
            <p className="text-gray-600 text-xs">لوحة التحكم الإدارية</p>
          </div>

          <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-lg p-5 space-y-3">
            <div>
              <label className="block text-gray-700 font-semibold mb-1.5 text-xs">اسم المستخدم</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-600 text-base"
                placeholder="أدخل اسم المستخدم"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1.5 text-xs">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-600 text-base"
                placeholder="أدخل كلمة المرور"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-600 to-rose-500 text-white font-bold py-3.5 rounded-lg hover:shadow-lg transition-all text-base shadow-md"
              >
                تسجيل الدخول
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 py-4 md:px-8 md:py-8">
        {successMessage && (
          <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <span>تم حفظ التعديلات بنجاح</span>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex gap-2 p-4 border-b border-pink-100 flex-wrap md:flex-nowrap">
            <button
              onClick={() => {
                setActiveTab("products")
                setShowForm(false)
                setShowCouponForm(false)
              }}
              className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all text-sm md:text-base ${
                activeTab === "products"
                  ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg"
                  : "bg-pink-50 text-pink-600 hover:bg-pink-100"
              }`}
            >
              المنتجات
            </button>
            <button
              onClick={() => {
                setActiveTab("coupons")
                setShowForm(false)
              }}
              className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all text-sm md:text-base ${
                activeTab === "coupons"
                  ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg"
                  : "bg-pink-50 text-pink-600 hover:bg-pink-100"
              }`}
            >
              الكوبونات
            </button>
            <button
              onClick={() => {
                setActiveTab("announcement")
                setShowForm(false)
                setShowCouponForm(false)
              }}
              className={`flex-1 py-3 px-6 rounded-xl font-bold transition-all text-sm md:text-base ${
                activeTab === "announcement"
                  ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg"
                  : "bg-pink-50 text-pink-600 hover:bg-pink-100"
              }`}
            >
              الشريط الإعلاني
            </button>
          </div>

          {activeTab === "products" && (
            <>
              {!showForm && (
                <div className="p-4 md:p-6 mb-6 space-y-3">
                  <button
                    onClick={() => setShowForm(true)}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-600 to-rose-500 text-white px-6 py-4 rounded-2xl hover:shadow-xl transition-all font-bold text-lg shadow-lg"
                  >
                    <Plus size={24} />
                    إضافة منتج جديد
                  </button>
                  
                  <button
                    onClick={handleSyncAllProducts}
                    disabled={isSyncing}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-4 rounded-2xl hover:shadow-xl transition-all font-bold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw size={24} className={isSyncing ? 'animate-spin' : ''} />
                    {isSyncing ? 'جاري المزامنة...' : 'مزامنة جميع ال 140 منتج من قاعدة البيانات'}
                  </button>
                </div>
              )}

              {showForm && (
                <div className="bg-pink-50 rounded-none shadow-lg p-4 md:p-8 mb-6 max-h-[80vh] overflow-y-auto">
                  <h2 className="text-xl md:text-2xl font-bold text-pink-600 mb-6">
                    {editingId ? "تعديل المنتج" : "إضافة منتج جديد"}
                  </h2>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault()
                      handleSubmit(e)
                    }}
                    className="space-y-5"
                  >
                    {/* الأسماء */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2 text-sm">الاسم (إنجليزي)</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-2.5 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-600"
                          placeholder="Product name"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2 text-sm">الاسم (عربي)</label>
                        <input
                          type="text"
                          value={formData.nameAr}
                          onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                          className="w-full px-4 py-2.5 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-600"
                          placeholder="اسم المنتج"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2 text-sm">الوصف (إنجليزي)</label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full px-4 py-2.5 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-600 h-24 resize-none"
                          placeholder="Product description"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2 text-sm">الوصف (عربي)</label>
                        <textarea
                          value={formData.descriptionAr}
                          onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                          className="w-full px-4 py-2.5 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-600 h-24 resize-none"
                          placeholder="وصف المنتج"
                        />
                      </div>
                    </div>

                    {/* السعر والماركة */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2 text-sm">السعر الحالي (ج.س)</label>
                        <input
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                          className="w-full px-4 py-2.5 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-600"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2 text-sm">السعر الأصلي (اختياري)</label>
                        <input
                          type="number"
                          value={formData.originalPrice}
                          onChange={(e) => {
                            const originalPrice = Number(e.target.value)
                            const discountPercent =
                              originalPrice > 0 ? ((originalPrice - formData.price) / originalPrice) * 100 : 0
                            setFormData({
                              ...formData,
                              originalPrice,
                              isOnSale: originalPrice > formData.price,
                              discountPercent: Math.round(discountPercent * 10) / 10,
                            })
                          }}
                          className="w-full px-4 py-2.5 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-600"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2 text-sm">الماركة</label>
                        <input
                          type="text"
                          value={formData.brand}
                          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                          className="w-full px-4 py-2.5 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-600"
                          placeholder="Brand"
                        />
                      </div>
                    </div>

                    {/* الصورة */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2 text-sm">صورة المنتج</label>
                      <label className="cursor-pointer">
                        <div className="w-full px-4 py-3 border-2 border-dashed border-pink-300 rounded-lg hover:border-pink-600 transition-colors flex flex-col items-center justify-center gap-2 bg-white min-h-[100px]">
                          <Upload size={32} className="text-pink-600" />
                          <span className="text-gray-700 font-bold text-center text-sm">اضغط لاختيار صورة</span>
                        </div>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                      {imagePreview && (
                        <div className="mt-3 flex justify-center">
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="معاينة"
                            className="h-24 w-24 object-contain rounded-lg border-2 border-pink-300 bg-white p-1"
                          />
                        </div>
                      )}
                    </div>

                    {/* الفئات */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2 text-sm">القسم الرئيسي</label>
                        <select
                          value={formData.category}
                          onChange={(e) => {
                            const categoryMap = {
                              skincare: "العناية بالبشرة",
                              hair: "العناية بالشعر",
                              body: "العناية بالجسم",
                              personal: "العناية الشخصية",
                            }
                            setFormData({
                              ...formData,
                              category: e.target.value,
                              categoryAr: categoryMap[e.target.value] || "",
                              subcategory: subcategories[e.target.value]?.[0]?.id || "",
                              subcategoryAr: subcategories[e.target.value]?.[0]?.nameAr || "",
                            })
                          }}
                          className="w-full px-4 py-2.5 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-600"
                        >
                          <option value="skincare">العناية بالبشرة</option>
                          <option value="hair">العناية بالشعر</option>
                          <option value="body">العناية بالجسم</option>
                          <option value="personal">العناية الشخصية</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2 text-sm">التصنيف الفرعي</label>
                        <select
                          value={formData.subcategory}
                          onChange={(e) => {
                            const selected = subcategories[formData.category]?.find((sub) => sub.id === e.target.value)
                            setFormData({
                              ...formData,
                              subcategory: e.target.value,
                              subcategoryAr: selected?.nameAr || "",
                            })
                          }}
                          className="w-full px-4 py-2.5 border-2 border-pink-200 rounded-lg focus:outline-none focus:border-pink-600"
                        >
                          {subcategories[formData.category]?.map((sub) => (
                            <option key={sub.id} value={sub.id}>
                              {sub.nameAr}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* أزرار الحفظ والإلغاء */}
                    <div className="flex gap-3 pt-4 sticky bottom-0 bg-pink-50 pb-4">
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-pink-600 to-rose-500 text-white py-3.5 rounded-lg hover:shadow-lg transition-all font-bold"
                      >
                        {editingId ? "حفظ التعديلات" : "إضافة المنتج"}
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-all font-bold"
                      >
                        إلغاء
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="bg-white rounded-none shadow-lg overflow-hidden">
                <div className="p-4 md:p-6 border-b border-gray-200 bg-pink-50">
                  <h2 className="text-xl md:text-2xl font-bold text-pink-600">إدارة المنتجات</h2>
                  <p className="text-gray-600 mt-1 text-sm">إجمالي المنتجات: {products.length}</p>
                </div>

                <div className="block md:hidden p-4 space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="bg-pink-50 rounded-xl p-4 border-2 border-pink-200">
                      <div className="flex gap-4 mb-3">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="h-20 w-20 object-contain rounded-lg bg-white p-1 border border-pink-200"
                        />
                        <div className="flex-1">
                          <p className="font-bold text-gray-800 mb-1">{product.nameAr}</p>
                          <p className="text-sm text-pink-600 font-bold mb-1">{formatPrice(product.price)}</p>
                          <p className="text-xs text-gray-600">{product.brand}</p>
                          <p className="text-xs text-gray-500">{product.categoryAr}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="flex-1 bg-blue-500 text-white py-2.5 rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2 font-bold"
                        >
                          <Edit2 size={18} />
                          تعديل
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="flex-1 bg-red-500 text-white py-2.5 rounded-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2 font-bold"
                        >
                          <Trash2 size={18} />
                          حذف
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-pink-50">
                      <tr>
                        <th className="px-6 py-3 text-right text-sm font-bold text-pink-700">الصورة</th>
                        <th className="px-6 py-3 text-right text-sm font-bold text-pink-700">الاسم</th>
                        <th className="px-6 py-3 text-right text-sm font-bold text-pink-700">الماركة</th>
                        <th className="px-6 py-3 text-right text-sm font-bold text-pink-700">السعر</th>
                        <th className="px-6 py-3 text-right text-sm font-bold text-pink-700">القسم</th>
                        <th className="px-6 py-3 text-center text-sm font-bold text-pink-700">الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-t border-gray-200 hover:bg-pink-50 transition-colors">
                          <td className="px-6 py-4">
                            <img
                              src={product.image || "/placeholder.svg"}
                              alt={product.name}
                              className="h-16 w-16 object-contain rounded bg-white p-1 border border-pink-200"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold text-gray-800">{product.nameAr}</p>
                              <p className="text-sm text-gray-600">{product.name}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-700">{product.brand}</td>
                          <td className="px-6 py-4 text-pink-600 font-bold">{formatPrice(product.price)}</td>
                          <td className="px-6 py-4 text-gray-700">{product.categoryAr}</td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleEdit(product)}
                                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-all"
                                title="تعديل"
                              >
                                <Edit2 size={18} />
                              </button>
                              <button
                                onClick={() => handleDelete(product.id)}
                                className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-all"
                                title="حذف"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          {activeTab === "coupons" && (
            <div className="p-4 md:p-6 space-y-6">
              <button
                onClick={() => setShowCouponForm(!showCouponForm)}
                className="w-full bg-gradient-to-r from-pink-600 to-pink-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-6 h-6" />
                إضافة كوبون خصم جديد
              </button>

              {showCouponForm && (
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl border-2 border-pink-200 space-y-4">
                  <h3 className="text-xl font-bold text-pink-600 mb-4">كوبون جديد</h3>
                  <div className="grid gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">كود الخصم</label>
                      <input
                        type="text"
                        value={couponForm.code}
                        onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                        placeholder="مثال: SUMMER2026"
                        className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">نسبة الخصم %</label>
                      <input
                        type="number"
                        value={couponForm.discount}
                        onChange={(e) => setCouponForm({ ...couponForm, discount: Number(e.target.value) })}
                        placeholder="10"
                        min="0"
                        max="100"
                        className="w-full px-4 py-3 border-2 border-pink-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={addCoupon}
                        className="flex-1 bg-pink-600 text-white py-3 rounded-lg font-bold hover:bg-pink-700 transition-all"
                      >
                        حفظ الكوبون
                      </button>
                      <button
                        onClick={() => setShowCouponForm(false)}
                        className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-400 transition-all"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-pink-600">
                  إدارة كوبونات الخصم
                  <span className="text-lg text-gray-500 mr-2">(إجمالي الكوبونات: {coupons.length})</span>
                </h3>

                {coupons.length === 0 ? (
                  <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                    <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">لا توجد كوبونات حالياً</p>
                  </div>
                ) : (
                  coupons.map((coupon) => (
                    <div
                      key={coupon.id}
                      className="bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-200 rounded-xl p-6 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="bg-pink-600 text-white px-6 py-3 rounded-lg font-bold text-xl">
                            {coupon.code}
                          </div>
                          <div className="text-3xl font-bold text-pink-600">{coupon.discount}%</div>
                          <div
                            className={`px-4 py-2 rounded-full font-bold ${
                              coupon.isActive
                                ? "bg-green-100 text-green-700 border-2 border-green-300"
                                : "bg-gray-100 text-gray-700 border-2 border-gray-300"
                            }`}
                          >
                            {coupon.isActive ? "مفعل" : "معطل"}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => toggleCouponStatus(coupon.id)}
                          className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                            coupon.isActive
                              ? "bg-yellow-500 text-white hover:bg-yellow-600"
                              : "bg-green-500 text-white hover:bg-green-600"
                          }`}
                        >
                          {coupon.isActive ? "تعطيل" : "تفعيل"}
                        </button>
                        <button
                          onClick={() => deleteCoupon(coupon.id)}
                          className="bg-red-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-600 transition-all flex items-center gap-2"
                        >
                          <Trash2 className="w-5 h-5" />
                          حذف
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "announcement" && (
            <div className="p-4 md:p-8">
              <div className="bg-gradient-to-r from-orange-50 via-pink-50 to-rose-50 rounded-2xl p-6 md:p-8 border-2 border-pink-200 max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-pink-800 mb-6 text-center">إعدادات الشريط الإعلاني</h2>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-pink-700 mb-2">نص الإعلان</label>
                    <input
                      type="text"
                      value={announcementText}
                      onChange={(e) => setAnnouncementText(e.target.value)}
                      placeholder="اكتبي نص الإعلان..."
                      className="w-full px-4 py-3 rounded-lg border-2 border-pink-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all text-right"
                    />
                  </div>

                  <div className="flex items-center justify-between bg-white rounded-lg p-4 border-2 border-pink-200">
                    <span className="text-sm font-bold text-pink-700">عرض الشريط الإعلاني</span>
                    <button
                      onClick={() => setAnnouncementVisible(!announcementVisible)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all ${
                        announcementVisible
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {announcementVisible ? (
                        <>
                          <Eye className="h-5 w-5" />
                          <span>ظاهر</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-5 w-5" />
                          <span>مخفي</span>
                        </>
                      )}
                    </button>
                  </div>

                  {announcementVisible && (
                    <div>
                      <label className="block text-sm font-bold text-pink-700 mb-2">معاينة</label>
                      <div className="bg-amber-400 text-amber-900 py-3 px-4 text-center rounded-lg border-2 border-amber-300">
                        <div className="flex items-center justify-center gap-2 text-sm font-bold">
                          <span>✨</span>
                          <span>{announcementText || "نص الإعلان"}</span>
                          <span>✨</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={saveAnnouncementSettings}
                    className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-4 rounded-lg font-bold hover:from-pink-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="h-5 w-5" />
                    حفظ التعديلات
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
