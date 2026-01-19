"use client"

import { useState } from "react"
import { upsertCouponAction } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { Plus, Trash2 } from "lucide-react"

export default function CouponsManager({ initialCoupons }: { initialCoupons: any[] }) {
  const [coupons, setCoupons] = useState(initialCoupons)
  const [newCoupon, setNewCoupon] = useState({ code: "", discount: 0 })

  const handleAdd = async () => {
    try {
      await upsertCouponAction(newCoupon)
      toast.success("تم إضافة الكوبون")
      window.location.reload()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border shadow-sm max-w-2xl">
        <h2 className="text-xl font-bold mb-6 text-right">إضافة كوبون جديد</h2>
        <div className="flex gap-4">
          <Input 
            placeholder="الرمز (CODE)" 
            value={newCoupon.code} 
            onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
          />
          <Input 
            type="number" 
            placeholder="نسبة الخصم %" 
            value={newCoupon.discount} 
            onChange={e => setNewCoupon({...newCoupon, discount: parseInt(e.target.value)})}
          />
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 ml-2" />
            إضافة
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">الكود</TableHead>
              <TableHead className="text-right">نسبة الخصم</TableHead>
              <TableHead className="text-left">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell className="text-right font-bold">{coupon.code}</TableCell>
                <TableCell className="text-right">{coupon.discount}%</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
