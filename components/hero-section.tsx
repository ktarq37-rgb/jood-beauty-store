"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Star } from "lucide-react"

export function HeroSection() {
  const scrollToProducts = () => {
    const productsSection = document.getElementById("products-section")
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const scrollToOffers = () => {
    const offersSection = document.getElementById("skincare")
    if (offersSection) {
      offersSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-bl from-accent via-background to-muted py-16 md:py-24">
      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="text-center md:text-right space-y-6">
            <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/30">
              <Star className="h-4 w-4 text-secondary fill-secondary" />
              <span className="text-sm font-medium text-foreground">متجر الجمال الأول في السودان</span>
            </div>

            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              style={{ fontFamily: "Tajawal, sans-serif" }}
            >
              <span className="text-foreground">اكتشفي</span> <span className="text-primary">جمالك</span>
              <br />
              <span className="text-secondary">الطبيعي</span>
            </h1>

            <p className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto md:mx-0">
              منتجات تجميل عالمية أصلية 100% بأسعار مناسبة. شحن لجميع ولايات السودان.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button
                size="lg"
                onClick={scrollToProducts}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-bold rounded-full"
              >
                تسوقي الآن
                <ArrowLeft className="mr-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={scrollToOffers}
                className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground px-8 py-6 text-lg font-bold rounded-full bg-transparent"
              >
                العروض الحصرية
              </Button>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-8 pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">+500</p>
                <p className="text-sm text-muted-foreground">منتج متوفر</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">+1000</p>
                <p className="text-sm text-muted-foreground">عميلة سعيدة</p>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">100%</p>
                <p className="text-sm text-muted-foreground">أصلي</p>
              </div>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-2xl" />
              <img
                src="/luxury-korean-beauty-cosmetics-products-collection.jpg"
                alt="مجموعة منتجات التجميل"
                className="relative z-10 w-full h-full object-contain drop-shadow-2xl"
              />
            </div>

            {/* Floating Product Cards */}
            <div className="absolute top-10 left-0 bg-card p-3 rounded-2xl shadow-xl animate-bounce">
              <div className="flex items-center gap-2">
                <img src="/vitamin-c-serum-bottle-gold-dropper-pink.jpg" alt="سيروم" className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <p className="text-xs font-bold">سيروم فيتامين C</p>
                  <p className="text-xs text-primary font-bold">87,020 ج.س</p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-10 right-0 bg-card p-3 rounded-2xl shadow-xl animate-bounce delay-150">
              <div className="flex items-center gap-2">
                <img src="/japanese-hair-mask-jar-red-gold-shiseido-fino-luxu.jpg" alt="ماسك شعر" className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <p className="text-xs font-bold">ماسك الشعر</p>
                  <p className="text-xs text-primary font-bold">77,860 ج.س</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
