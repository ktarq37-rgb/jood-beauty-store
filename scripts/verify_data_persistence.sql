-- ============================================================================
-- JOOD BEAUTY E-COMMERCE: DATA PERSISTENCE VERIFICATION SCRIPT
-- ============================================================================
-- Run this script to comprehensively verify all data persistence features
-- ============================================================================

-- SECTION 1: DATABASE CONNECTIVITY & STRUCTURE
-- ============================================================================
-- Verify database is accessible and tables exist
SELECT 'DATABASE_CONNECTIVITY_CHECK' as test_name;
SELECT COUNT(*) as table_count FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check products table
SELECT 'PRODUCTS_TABLE_CHECK' as test_name;
SELECT 
  COUNT(*) as product_count,
  COUNT(DISTINCT id) as unique_ids,
  COUNT(CASE WHEN price IS NULL THEN 1 END) as null_prices,
  COUNT(CASE WHEN name_ar IS NULL THEN 1 END) as null_names_ar,
  COUNT(CASE WHEN name_en IS NULL THEN 1 END) as null_names_en
FROM products;

-- Check site_settings table
SELECT 'SITE_SETTINGS_CHECK' as test_name;
SELECT * FROM site_settings LIMIT 1;

-- Check coupons table
SELECT 'COUPONS_TABLE_CHECK' as test_name;
SELECT COUNT(*) as coupon_count FROM coupons;

-- ============================================================================
-- SECTION 2: PRODUCT DATA INTEGRITY
-- ============================================================================
-- Verify no duplicate product IDs
SELECT 'DUPLICATE_ID_CHECK' as test_name;
SELECT id, COUNT(*) as count 
FROM products 
GROUP BY id 
HAVING COUNT(*) > 1;

-- Verify required fields are populated
SELECT 'REQUIRED_FIELDS_CHECK' as test_name;
SELECT 
  SUM(CASE WHEN id IS NULL THEN 1 ELSE 0 END) as missing_id,
  SUM(CASE WHEN name_ar IS NULL THEN 1 ELSE 0 END) as missing_name_ar,
  SUM(CASE WHEN name_en IS NULL THEN 1 ELSE 0 END) as missing_name_en,
  SUM(CASE WHEN price IS NULL THEN 1 ELSE 0 END) as missing_price,
  SUM(CASE WHEN category IS NULL THEN 1 ELSE 0 END) as missing_category,
  SUM(CASE WHEN brand IS NULL THEN 1 ELSE 0 END) as missing_brand
FROM products;

-- Verify price constraints (should be positive)
SELECT 'PRICE_CONSTRAINT_CHECK' as test_name;
SELECT COUNT(*) as invalid_prices 
FROM products 
WHERE price < 0 OR price IS NULL;

-- Verify discount constraints (0-100%)
SELECT 'DISCOUNT_CONSTRAINT_CHECK' as test_name;
SELECT COUNT(*) as invalid_discounts 
FROM products 
WHERE discount_percentage < 0 OR discount_percentage > 100;

-- ============================================================================
-- SECTION 3: RECENT UPDATE VERIFICATION
-- ============================================================================
-- Check products updated in last 1 hour
SELECT 'RECENT_UPDATES_CHECK' as test_name;
SELECT 
  id, name_ar, name_en, price, discount_percentage,
  updated_at,
  EXTRACT(EPOCH FROM (NOW() - updated_at)) as seconds_since_update
FROM products 
WHERE updated_at > NOW() - INTERVAL '1 hour'
ORDER BY updated_at DESC
LIMIT 10;

-- Check for timestamp consistency
SELECT 'TIMESTAMP_CONSISTENCY_CHECK' as test_name;
SELECT 
  COUNT(*) as total_products,
  COUNT(CASE WHEN created_at IS NULL THEN 1 END) as missing_created_at,
  COUNT(CASE WHEN updated_at IS NULL THEN 1 END) as missing_updated_at,
  COUNT(CASE WHEN updated_at < created_at THEN 1 END) as invalid_updated_at
FROM products;

-- ============================================================================
-- SECTION 4: BANNER SETTINGS PERSISTENCE
-- ============================================================================
-- Verify banner settings exist and are valid
SELECT 'BANNER_SETTINGS_VALIDATION' as test_name;
SELECT 
  id,
  LENGTH(banner_text) as text_length,
  banner_visible,
  updated_at,
  EXTRACT(EPOCH FROM (NOW() - updated_at)) as seconds_since_update
FROM site_settings;

-- Check if banner is properly configured
SELECT 'BANNER_CONFIGURATION_CHECK' as test_name;
SELECT 
  CASE WHEN banner_text IS NOT NULL AND LENGTH(banner_text) > 0 THEN 'CONFIGURED' 
       ELSE 'NOT_CONFIGURED' END as status,
  banner_visible,
  COUNT(*) as count
FROM site_settings
GROUP BY status, banner_visible;

-- ============================================================================
-- SECTION 5: COUPON DATA VERIFICATION
-- ============================================================================
-- Check coupons integrity
SELECT 'COUPONS_INTEGRITY_CHECK' as test_name;
SELECT 
  COUNT(*) as total_coupons,
  COUNT(CASE WHEN code IS NULL THEN 1 END) as missing_codes,
  COUNT(CASE WHEN discount_percentage IS NULL THEN 1 END) as missing_discounts,
  COUNT(CASE WHEN is_active IS NULL THEN 1 END) as missing_active_status,
  SUM(CASE WHEN is_active = true THEN 1 ELSE 0 END) as active_coupons
FROM coupons;

-- Verify coupon discount ranges
SELECT 'COUPON_DISCOUNT_CHECK' as test_name;
SELECT 
  COUNT(*) as invalid_discounts
FROM coupons
WHERE discount_percentage < 0 OR discount_percentage > 100;

-- ============================================================================
-- SECTION 6: PRODUCT CATEGORY DISTRIBUTION
-- ============================================================================
-- Verify product distribution across categories
SELECT 'CATEGORY_DISTRIBUTION' as test_name;
SELECT 
  category,
  COUNT(*) as count,
  AVG(price)::numeric(10,2) as avg_price,
  MIN(price) as min_price,
  MAX(price) as max_price
FROM products
GROUP BY category
ORDER BY count DESC;

-- ============================================================================
-- SECTION 7: DATA CONSISTENCY CROSS-CHECKS
-- ============================================================================
-- Verify no products have conflicting data
SELECT 'DATA_CONSISTENCY_CHECK' as test_name;
SELECT 
  COUNT(*) as issues
FROM products
WHERE 
  (is_on_sale = true AND discount_percentage = 0) OR
  (is_on_sale = false AND discount_percentage > 0);

-- ============================================================================
-- SECTION 8: PERFORMANCE METRICS
-- ============================================================================
-- Check query performance (should complete in < 1 second)
SELECT 'PERFORMANCE_CHECK' as test_name;
SELECT 
  COUNT(*) as product_count,
  COUNT(DISTINCT category) as category_count,
  COUNT(DISTINCT brand) as brand_count
FROM products;

-- Check database size
SELECT 'DATABASE_SIZE_CHECK' as test_name;
SELECT 
  pg_size_pretty(pg_total_relation_size('products')) as products_table_size,
  pg_size_pretty(pg_total_relation_size('coupons')) as coupons_table_size,
  pg_size_pretty(pg_total_relation_size('site_settings')) as site_settings_table_size;

-- ============================================================================
-- FINAL VERIFICATION SUMMARY
-- ============================================================================
SELECT 'FINAL_SUMMARY' as test_name;
SELECT
  (SELECT COUNT(*) FROM products) as total_products,
  (SELECT COUNT(*) FROM coupons) as total_coupons,
  (SELECT COUNT(*) FROM site_settings) as site_settings_count,
  (SELECT COUNT(*) FROM products WHERE updated_at > NOW() - INTERVAL '24 hours') as updated_last_24h,
  NOW() as check_timestamp;

-- ============================================================================
-- SUCCESS: All checks completed. Review results above.
-- ============================================================================
