"use client"

import Link from "next/link"
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa"
import { MapPin, Phone, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-3xl font-bold text-primary" style={{ fontFamily: "Tajawal, sans-serif" }}>
                Jood
              </span>
              <span className="text-3xl font-light text-background" style={{ fontFamily: "Tajawal, sans-serif" }}>
                Beauty
              </span>
            </Link>
            <p className="text-background/70 mb-6 max-w-sm">
              وجهتك الأولى لمنتجات التجميل العالمية الأصلية في السودان. نقدم لك أفضل العلامات التجارية بأسعار مناسبة.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/jood_beauty_shop"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-background/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors"
              >
                <FaInstagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61560314728792"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-background/10 hover:bg-primary rounded-full flex items-center justify-center transition-colors"
              >
                <FaFacebookF className="h-5 w-5" />
              </a>
              <a
                href="https://wa.me/249960964967"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-background/10 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors"
              >
                <FaWhatsapp className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-secondary" style={{ fontFamily: "Tajawal, sans-serif" }}>
              روابط سريعة
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="#skincare" className="text-background/70 hover:text-primary transition-colors">
                  العناية بالبشرة
                </Link>
              </li>
              <li>
                <Link href="#hair" className="text-background/70 hover:text-primary transition-colors">
                  العناية بالشعر
                </Link>
              </li>
              <li>
                <Link href="#body" className="text-background/70 hover:text-primary transition-colors">
                  العناية بالجسم
                </Link>
              </li>
              <li>
                <Link href="#personal" className="text-background/70 hover:text-primary transition-colors">
                  العناية الشخصية
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-secondary" style={{ fontFamily: "Tajawal, sans-serif" }}>
              تواصلي معنا
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-background/70">
                <Phone className="h-4 w-4 text-primary" />
                <span dir="ltr">+249 960 964 967</span>
              </li>
              <li className="flex items-center gap-3 text-background/70">
                <MapPin className="h-4 w-4 text-primary" />
                <span>السودان</span>
              </li>
              <li className="flex items-center gap-3 text-background/70">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@joodbeauty.sd</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-background/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-background/50">
            <p>© 2026 Jood Beauty. جميع الحقوق محفوظة</p>
            <div className="flex items-center gap-4">
              <span>الدفع عبر تطبيق بنكك</span>
              <div className="w-px h-4 bg-background/20" />
              <span>منتجات أصلية 100%</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
