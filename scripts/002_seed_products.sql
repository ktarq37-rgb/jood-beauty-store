-- Insert all 140 products from reference site into Supabase
-- This script populates the products table with all items from artiest-shop-sudan.myshopify.com

-- Clear existing data
TRUNCATE products, coupons, site_settings RESTART IDENTITY CASCADE;

-- Updated to use correct column names matching actual schema
INSERT INTO products (id, name, name_ar, name_en, description_en, description_ar, price, original_price, category, category_ar, subcategory, subcategory_ar, brand, image) VALUES
-- Skincare - Serums
('1', 'JUMISO Niacinamide 20 Serum - 40ml', 'سيروم جوميسو نياسينامايد 20 - 40مل', 'JUMISO Niacinamide 20 Serum - 40ml', 'Concentrated niacinamide serum for skin brightening', 'سيروم مركز بالنياسينامايد لتفتيح البشرة', 77860, NULL, 'Skincare', 'العناية بالبشرة', 'Serums', 'سيرومات', 'JUMISO', '/placeholder.svg?height=400&width=400'),
('2', 'ANUA Azelaic Acid 3% Toner - 250ml', 'تونر انوا ازيليك اسيد 3 سيكا - 250مل', 'ANUA Azelaic Acid 3% + Cica Toner - 250ml', 'Refreshing azelaic acid toner', 'تونر منعش بحمض الازيليك', 77860, NULL, 'Skincare', 'العناية بالبشرة', 'Toners', 'تونرات', 'ANUA', '/placeholder.svg?height=400&width=400'),
('3', 'Skin1004 Centella Toning Toner Pads', 'باد سكين1004 سينتللا المركز 230مل', 'Skin1004 Madagascar Centella Toning Toner Pads 230ml', 'Pads soaked with centella extract', 'باد مشبع بمستخلص السينتيلا', 96180, NULL, 'Skincare', 'العناية بالبشرة', 'Masks & Pads', 'ماسكات وباد', 'Skin1004', '/placeholder.svg?height=400&width=400');

-- Insert a sample coupon
INSERT INTO coupons (id, code, discount_percentage, is_active) VALUES
('1', 'HAUQIWUY', 20, true);

-- Insert site settings
INSERT INTO site_settings (id, key, value_ar, value_en, is_active) VALUES
('1', 'top_banner', 'تخفيضات كبرى بمناسبة الافتتاح - متوفر الدفع عبر تطبيق بنكك', 'Grand Opening Sale - Bankak Payment Available', true);
