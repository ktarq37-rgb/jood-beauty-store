"use client"

import { useState } from "react"
import { deleteProductAction, upsertProductAction } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { Edit2, Trash2, Plus, Search } from "lucide-react"

export default function ProductsTable({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)

  const filteredProducts = products.filter(p => 
    p.name_ar?.includes(searchTerm) || p.name_en?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    try {
      await upsertProductAction(formData)
      toast.success("تم الحفظ بنجاح")
      setIsDialogOpen(false)
      window.location.reload()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return
    try {
      await deleteProductAction(id)
      toast.success("تم الحذف بنجax")
      window.location.reload()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="بحث عن منتج..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingProduct(null)}>
              <Plus className="w-4 h-4 ml-2" />
              إضافة منتج جديد
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'تعديل منتج' : 'إضافة منتج جديد'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 py-4">
              <input type="hidden" name="id" value={editingProduct?.id || ''} />
              <div className="space-y-2">
                <label className="text-sm font-medium">الاسم (عربي)</label>
                <Input name="name_ar" defaultValue={editingProduct?.name_ar} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">الاسم (English)</label>
                <Input name="name_en" defaultValue={editingProduct?.name_en} required />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium">الوصف (عربي)</label>
                <Input name="description_ar" defaultValue={editingProduct?.description_ar} />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium">Price (IQD)</label>
                <Input type="number" name="price" defaultValue={editingProduct?.price} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Input name="category" defaultValue={editingProduct?.category} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Brand</label>
                <Input name="brand" defaultValue={editingProduct?.brand} required />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium">Image URL</label>
                <Input name="image" defaultValue={editingProduct?.image} required />
              </div>
              <Button type="submit" className="col-span-2 mt-4">حفظ المنتج</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المنتج</TableHead>
              <TableHead>الفئة</TableHead>
              <TableHead>السعر</TableHead>
              <TableHead className="text-left">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={product.image} className="w-10 h-10 rounded-md object-cover border" alt="" />
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{product.name_ar}</span>
                      <span className="text-xs text-muted-foreground">{product.name_en}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{product.category}</TableCell>
                <TableCell className="text-sm font-mono">{product.price?.toLocaleString()} د.ع</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setEditingProduct(product)
                        setIsDialogOpen(true)
                      }}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
