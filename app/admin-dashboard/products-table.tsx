"use client"

import { useState, useRef } from "react"
import { deleteProductAction, upsertProductAction } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
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
import { Edit2, Trash2, Plus, Search, Upload, Link as LinkIcon } from "lucide-react"

export default function ProductsTable({ initialProducts }: { initialProducts: any[] }) {
  const [products, setProducts] = useState(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const supabase = createClient()
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `product-images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath)

      // Get the form element to update the image input
      const form = e.target.closest('form')
      if (form) {
        const imageInput = form.querySelector('input[name="image"]') as HTMLInputElement
        if (imageInput) {
          imageInput.value = publicUrl
          // Manually trigger change if needed, though form data will pick it up
        }
      }
      toast.success("تم رفع الصورة بنجاح")
    } catch (error: any) {
      toast.error("فشل رفع الصورة: " + error.message)
    } finally {
      setUploading(false)
    }
  }

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
      toast.success("تم الحذف بنجاح")
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
                <label className="text-sm font-medium">السعر (د.ع)</label>
                <Input type="number" name="price" defaultValue={editingProduct?.price} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">الفئة (Category)</label>
                <Input name="category" defaultValue={editingProduct?.category} required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">العلامة التجارية (Brand)</label>
                <Input name="brand" defaultValue={editingProduct?.brand} required />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium">الصورة</label>
                <div className="flex gap-2">
                  <Input name="image" defaultValue={editingProduct?.image} placeholder="رابط الصورة" required />
                  <div className="relative">
                    <input
                      type="file"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? "جاري الرفع..." : <Upload className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
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
