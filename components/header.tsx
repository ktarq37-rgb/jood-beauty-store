"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingBag, Menu, X, Search, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { useLanguage } from "@/lib/i18n/language-context"
import { LanguageSwitcher } from "./language-switcher"
import { categories } from "@/lib/products-data"

export function Header() {
  const { totalItems, setIsCartOpen } = useCart()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { language, t } = useLanguage()

  return (
    <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative">
              <span
                className="text-2xl md:text-3xl font-bold text-primary"
                style={{ fontFamily: "Tajawal, sans-serif" }}
              >
                Jood
              </span>
              <span
                className="text-2xl md:text-3xl font-light text-foreground"
                style={{ fontFamily: "Tajawal, sans-serif" }}
              >
                Beauty
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors font-medium">
              {t("home")}
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`#${category.id}`}
                className="text-foreground hover:text-primary transition-colors font-medium"
              >
                {language === "ar" ? category.nameAr : category.nameEn}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            <Link href="/admin-dashboard" title="لوحة التحكم">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Lock className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-foreground hover:text-primary transition-colors font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("home")}
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`#${category.id}`}
                  className="text-foreground hover:text-primary transition-colors font-medium py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {language === "ar" ? category.nameAr : category.nameEn}
                </Link>
              ))}
              <Link
                href="/admin-dashboard"
                className="text-foreground hover:text-primary transition-colors font-medium py-2 flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Lock className="h-4 w-4" />
                لوحة التحكم
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
