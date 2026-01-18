"use client"

import { Truck, ShieldCheck, CreditCard, Headphones } from "lucide-react"

const features = [
  {
    icon: Truck,
    title: "شحن سريع",
    description: "توصيل لجميع ولايات السودان خلال 1-5 أيام",
  },
  {
    icon: ShieldCheck,
    title: "منتجات أصلية",
    description: "جميع منتجاتنا أصلية 100% ومضمونة",
  },
  {
    icon: CreditCard,
    title: "دفع آمن",
    description: "ادفعي بأمان عبر تطبيق بنكك",
  },
  {
    icon: Headphones,
    title: "دعم متواصل",
    description: "تواصلي معنا عبر الواتساب في أي وقت",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 bg-card rounded-2xl border border-border hover:border-primary transition-colors"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-bold text-foreground mb-2" style={{ fontFamily: "Tajawal, sans-serif" }}>
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
