import { getProductsAction } from "./actions"
import ProductsTable from "./products-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Package, Plus, LayoutDashboard } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const products = await getProductsAction()

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
        <div className="flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">إدارة المنتجات</h2>
                <p className="text-muted-foreground text-sm">عرض وتعديل كافة المنتجات في المتجر</p>
              </div>
            </div>
          </div>

          <ProductsTable initialProducts={products} />
        </div>
      </main>
    </div>
  )
}
