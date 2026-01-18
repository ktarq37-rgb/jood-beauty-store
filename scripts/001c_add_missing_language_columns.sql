-- Add missing language columns to products table

-- Add English name column (copy from existing name)
ALTER TABLE products ADD COLUMN IF NOT EXISTS name_en TEXT;
UPDATE products SET name_en = name WHERE name_en IS NULL;

-- Add description columns for both languages
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_en TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS description_ar TEXT;

-- Make name_en required
ALTER TABLE products ALTER COLUMN name_en SET NOT NULL;
