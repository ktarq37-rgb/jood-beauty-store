import { getProductsAction, getSettingsAction, getCouponsAction } from "./actions"
import ProductsTable from "./products-table"
import SettingsForm from "./settings-form"
import CouponsManager from "./coupons-manager"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Package, Plus, LayoutDashboard, Settings, Ticket } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const products = await getProductsAction()
  const settings = await getSettingsAction()
  const coupons = await getCouponsAction()

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">لوحة التحكم</h1>
          </div>
          <Link href="/">
            <Button variant="outline">العودة للموقع</Button>
          </Link>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              المنتجات
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              الإعدادات
            </TabsTrigger>
            <TabsTrigger value="coupons" className="flex items-center gap-2">
              <Ticket className="w-4 h-4" />
              الكوبونات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductsTable initialProducts={products} />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsForm initialSettings={settings} />
          </TabsContent>

          <TabsContent value="coupons">
            <CouponsManager initialCoupons={coupons} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
