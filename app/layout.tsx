import type React from "react"
import type { Metadata } from "next"
import { Tajawal, Cairo } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/lib/cart-context"
import { LanguageProvider } from "@/lib/i18n/language-context"
import "./globals.css"

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
})

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cairo",
})

export const metadata: Metadata = {
  title: "Jood Beauty | متجر جود بيوتي للتجميل",
  description:
    "متجر الجمال الأول في السودان - منتجات تجميل عالمية أصلية 100% بأسعار مناسبة. عناية بالبشرة، الشعر، الجسم ومستحضرات التجميل.",
  keywords: [
    "جود بيوتي",
    "Jood Beauty",
    "متجر تجميل السودان",
    "منتجات كورية",
    "عناية بالبشرة",
    "مكياج",
    "العناية بالشعر",
  ],
  authors: [{ name: "Jood Beauty" }],
  creator: "Jood Beauty",
  publisher: "Jood Beauty",
  metadataBase: new URL("https://jood-beauty.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ar_SD",
    url: "/",
    title: "Jood Beauty | متجر جود بيوتي للتجميل 💄",
    description: "🌸 منتجات تجميل أصلية 100% | عناية بالبشرة والشعر | توصيل لجميع أنحاء السودان 📦",
    siteName: "Jood Beauty",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Jood Beauty - متجر التجميل الأول في السودان",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jood Beauty | متجر جود بيوتي للتجميل 💄",
    description: "🌸 منتجات تجميل أصلية 100% | عناية بالبشرة والشعر | توصيل لجميع أنحاء السودان 📦",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${tajawal.variable} ${cairo.variable} font-sans antialiased`}>
        <LanguageProvider>
          <CartProvider>{children}</CartProvider>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
