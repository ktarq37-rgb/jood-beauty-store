-- Add dual-language support columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS name_ar TEXT,
ADD COLUMN IF NOT EXISTS name_en TEXT,
ADD COLUMN IF NOT EXISTS description_ar TEXT,
ADD COLUMN IF NOT EXISTS description_en TEXT;

-- Migrate existing 'name' and 'description' to Arabic columns
UPDATE products SET name_ar = name WHERE name_ar IS NULL;
UPDATE products SET description_ar = description WHERE description_ar IS NULL;

-- Drop old single-language columns (optional - keep if you want backward compatibility)
-- ALTER TABLE products DROP COLUMN IF EXISTS name;
-- ALTER TABLE products DROP COLUMN IF EXISTS description;
