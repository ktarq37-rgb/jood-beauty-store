import { getProductsAction } from "./actions"
import ProductsTable from "./products-table"
import LoginPage from "./login-page"
import SyncButton from "./sync-button"
import { cookies } from "next/headers"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Package, Plus, LayoutDashboard, LogOut } from "lucide-react"
import { logoutAction } from "./auth-actions"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const cookieStore = await cookies()
  const isAuthenticated = cookieStore.get("admin_auth")?.value === "true"

  if (!isAuthenticated) {
    return <LoginPage />
  }

  const products = await getProductsAction()

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold">لوحة التحكم</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="outline">العودة للموقع</Button>
            </Link>
            <form action={logoutAction}>
              <Button variant="ghost" size="icon" className="text-destructive">
                <LogOut className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
      {/* ... rest of the page ... */}

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
