import { NextResponse } from "next/server";
import { syncShopifyProducts } from "@/lib/sync-shopify";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const result = await syncShopifyProducts();
  return NextResponse.json(result);
}
