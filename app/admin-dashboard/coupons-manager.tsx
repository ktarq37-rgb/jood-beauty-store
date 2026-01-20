import { useState } from "react"
import { deleteCouponAction, upsertCouponAction } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { Plus, Trash2, Ticket } from "lucide-react"

export default function CouponsManager({ initialCoupons }: { initialCoupons: any[] }) {
  const [coupons, setCoupons] = useState(initialCoupons)
  const [newCoupon, setNewCoupon] = useState({ code: "", discount: "" })

  const handleAdd = async () => {
    if (!newCoupon.code || !newCoupon.discount) {
      toast.error("الرجاء إدخال الكود ونسبة الخصم")
      return
    }
    try {
      await upsertCouponAction({ 
        code: newCoupon.code, 
        discount: parseInt(newCoupon.discount as string) 
      })
      toast.success("تم إضافة الكوبون بنجاح")
      window.location.reload()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الكوبون؟")) return
    try {
      await deleteCouponAction(id)
      toast.success("تم حذف الكوبون")
      window.location.reload()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border shadow-sm max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Ticket className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-right">إدارة كوبونات الخصم</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input 
            placeholder="كود الخصم (مثال: SAVE10)" 
            value={newCoupon.code} 
            onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
            className="text-center font-mono uppercase"
          />
          <Input 
            type="number" 
            placeholder="نسبة الخصم %" 
            value={newCoupon.discount} 
            onChange={e => setNewCoupon({...newCoupon, discount: e.target.value})}
            className="text-center"
          />
          <Button onClick={handleAdd} className="w-full">
            <Plus className="w-4 h-4 ml-2" />
            إضافة الكوبون
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="text-center">كود الخصم</TableHead>
              <TableHead className="text-center">نسبة الخصم</TableHead>
              <TableHead className="text-center">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  لا توجد كوبونات حالياً
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="text-center font-bold font-mono">{coupon.code}</TableCell>
                  <TableCell className="text-center">{coupon.discount_percent || coupon.discount}%</TableCell>
                  <TableCell className="text-center">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(coupon.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
