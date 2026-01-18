export const translations = {
  ar: {
    // Navigation
    home: "الرئيسية",
    shop: "المتجر",
    categories: "الأقسام",
    cart: "السلة",

    // Hero
    heroTitle: "جود بيوتي",
    heroSubtitle: "عالمك للجمال الكوري",
    shopNow: "تسوقي الآن",
    exclusiveOffers: "العروض الحصرية",

    // Categories
    shopByCategory: "تسوقي حسب الفئة",
    skincare: "العناية بالبشرة",
    haircare: "العناية بالشعر",
    bodycare: "العناية بالجسم",
    personalcare: "العناية الشخصية",

    // Subcategories
    serums: "سيرومات",
    toners: "تونرات",
    cleansers: "غسولات",
    moisturizers: "كريمات ومرطبات",
    masks: "ماسكات وباد",
    sunscreen: "واقي شمس",
    eyeCream: "كريمات العين",
    lipBalm: "مرطب شفاه",
    treatments: "علاجات",
    scrubs: "مقشرات",
    lotions: "لوشن ومرطبات",
    deodorant: "مزيل عرق",
    toothpaste: "معجون أسنان",

    // Product
    addToCart: "أضيفي",
    outOfStock: "غير متوفر",
    sale: "خصم",
    currency: "ج.س",

    // Cart
    myCart: "سلتي",
    emptyCart: "السلة فارغة",
    total: "المجموع",
    promoCode: "كود الخصم",
    apply: "تطبيق",
    discount: "الخصم",
    checkout: "إتمام الطلب",

    // Admin
    adminPanel: "لوحة التحكم",
    products: "المنتجات",
    coupons: "الكوبونات",
    topBanner: "الشريط الإعلاني",
    logout: "خروج",
    backToStore: "رجوع للمتجر",
  },
  en: {
    // Navigation
    home: "Home",
    shop: "Shop",
    categories: "Categories",
    cart: "Cart",

    // Hero
    heroTitle: "Jood Beauty",
    heroSubtitle: "Your Korean Beauty World",
    shopNow: "Shop Now",
    exclusiveOffers: "Exclusive Offers",

    // Categories
    shopByCategory: "Shop by Category",
    skincare: "Skincare",
    haircare: "Haircare",
    bodycare: "Body Care",
    personalcare: "Personal Care",

    // Subcategories
    serums: "Serums",
    toners: "Toners",
    cleansers: "Cleansers",
    moisturizers: "Moisturizers",
    masks: "Masks & Pads",
    sunscreen: "Sunscreen",
    eyeCream: "Eye Cream",
    lipBalm: "Lip Balm",
    treatments: "Treatments",
    scrubs: "Scrubs",
    lotions: "Lotions",
    deodorant: "Deodorant",
    toothpaste: "Toothpaste",

    // Product
    addToCart: "ADD TO CART",
    outOfStock: "Out of Stock",
    sale: "SALE",
    currency: "SDG",

    // Cart
    myCart: "My Cart",
    emptyCart: "Cart is Empty",
    total: "Total",
    promoCode: "Promo Code",
    apply: "Apply",
    discount: "Discount",
    checkout: "Checkout",

    // Admin
    adminPanel: "Admin Panel",
    products: "Products",
    coupons: "Coupons",
    topBanner: "Top Banner",
    logout: "Logout",
    backToStore: "Back to Store",
  },
}

export type Language = "ar" | "en"
export type TranslationKey = keyof typeof translations.ar
