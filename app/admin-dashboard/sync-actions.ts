"use server"

import { syncShopifyProducts } from "@/lib/sync-shopify"
import { revalidatePath } from "next/cache"

export async function runSyncAction() {
  const result = await syncShopifyProducts()
  if (result.success) {
    revalidatePath("/")
    revalidatePath("/admin-dashboard")
  }
  return result
}
