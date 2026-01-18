import { TopBar } from "@/components/top-bar"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { CategoriesSection } from "@/components/categories-section"
import { ProductsSection } from "@/components/products-section"
import { FeaturesSection } from "@/components/features-section"
import { Footer } from "@/components/footer"
import { SideCart } from "@/components/side-cart"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <Header />
      <SideCart />
      <main>
        <HeroSection />
        <CategoriesSection />
        <ProductsSection />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  )
}
