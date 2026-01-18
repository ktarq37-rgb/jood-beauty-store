-- Create products table for Jood Beauty e-commerce
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL,
  category_ar TEXT NOT NULL,
  subcategory TEXT,
  subcategory_ar TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  is_on_sale BOOLEAN DEFAULT false,
  discount_percentage INTEGER,
  image TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand ON public.products(brand);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON public.products(subcategory);

-- No RLS needed since this is admin-only data (no user authentication for products)
-- Admin dashboard will use server-side operations only
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;

-- Create coupons table
CREATE TABLE IF NOT EXISTS public.coupons (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_percentage INTEGER NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);
ALTER TABLE public.coupons DISABLE ROW LEVEL SECURITY;

-- Create promo banner settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'banner_settings',
  banner_text TEXT NOT NULL DEFAULT 'Big Opening Discounts - Bank Payment Available',
  banner_visible BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.site_settings DISABLE ROW LEVEL SECURITY;

-- Insert default banner settings
INSERT INTO public.site_settings (id, banner_text, banner_visible)
VALUES ('banner_settings', 'Big Opening Discounts - Bank Payment Available', true)
ON CONFLICT (id) DO NOTHING;

-- Create trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
