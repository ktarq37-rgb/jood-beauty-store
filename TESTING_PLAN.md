# Comprehensive Data Persistence Testing Plan - Jood Beauty E-Commerce

## Overview
This document outlines a complete testing and verification strategy to ensure all product updates and promotional banner changes are permanently saved in Supabase and persist across sessions.

---

## PHASE 1: Database Integrity Verification

### 1.1 Check Current Database State
**Objective:** Verify database connectivity and structure

**Test Procedure:**
```sql
-- Check products table structure
SELECT COUNT(*) as total_products FROM products;

-- Verify site_settings table exists and has banner data
SELECT * FROM site_settings LIMIT 1;

-- Check coupons table status
SELECT COUNT(*) as total_coupons FROM coupons;
```

**Success Criteria:**
- Products table returns count > 0
- Site_settings table accessible with banner_text and banner_visible columns
- No schema errors

---

## PHASE 2: Product Update Persistence Testing

### 2.1 Single Product Update Test

**Test Scenario:** Edit product price and discount

**Steps:**
1. Navigate to Admin Panel (/admin)
2. Locate a test product (e.g., first in list)
3. Click Edit button
4. Change:
   - Price: from X → X + 1000
   - Discount: from Y → Y + 5%
5. Click Save
6. Verify toast message appears: "تم الحفظ بنجاح"

**Verification Queries:**
```sql
-- Verify update in database (replace PRODUCT_ID with actual ID)
SELECT id, name_ar, price, discount_percentage, updated_at 
FROM products 
WHERE id = 'PRODUCT_ID';

-- Confirm timestamp is recent (within last 5 seconds)
SELECT 
  id, name_ar, price, discount_percentage,
  EXTRACT(EPOCH FROM (NOW() - updated_at)) as seconds_ago
FROM products 
WHERE id = 'PRODUCT_ID';
```

**Success Criteria:**
- Price reflects new value in database
- Discount_percentage reflects new value in database
- Updated_at timestamp is recent (< 5 seconds)

### 2.2 Cross-Session Persistence Test

**Test Scenario:** Verify changes persist after page reload

**Steps:**
1. Complete 2.1 test
2. Note the updated price value
3. Close browser tab or refresh page (Ctrl+R)
4. Log back in to admin panel
5. Search for same product
6. Verify price still shows the updated value

**Success Criteria:**
- Product price matches value from 2.1
- No rollback to original price
- Product data loads from Supabase on page reload

### 2.3 Batch Product Updates Test

**Test Scenario:** Update multiple products in sequence

**Steps:**
1. Edit 3 different products (change different fields: price, name, description)
2. Save each one and verify toast message
3. Reload admin page
4. Verify all 3 changes persisted

**Verification Query:**
```sql
-- Check multiple products for recent updates
SELECT id, name_ar, price, updated_at 
FROM products 
WHERE id IN ('ID1', 'ID2', 'ID3')
ORDER BY updated_at DESC;
```

**Success Criteria:**
- All 3 products show updated values
- All have recent updated_at timestamps
- No data loss or corruption

### 2.4 Product Image Update Test

**Test Scenario:** Upload new product image

**Steps:**
1. Edit a product
2. Upload a new image
3. Click Save
4. Reload page and verify image displays correctly
5. Check database image URL

**Verification Query:**
```sql
SELECT id, name_ar, image, updated_at 
FROM products 
WHERE id = 'PRODUCT_ID';
```

**Success Criteria:**
- Image column stores new image URL
- Image displays on page reload
- No broken image links

---

## PHASE 3: Product Creation Persistence Testing

### 3.1 New Product Creation Test

**Test Scenario:** Create entirely new product

**Steps:**
1. Click "إضافة منتج جديد" button
2. Fill form with:
   - Name (AR & EN)
   - Description (AR & EN)
   - Price: 100,000
   - Category, Subcategory, Brand
   - Upload image
3. Click Save
4. Verify toast message
5. Reload page and search for new product

**Verification Query:**
```sql
-- Find newest product
SELECT id, name_ar, name_en, price, created_at 
FROM products 
ORDER BY created_at DESC 
LIMIT 1;

-- Verify all fields populated
SELECT * FROM products 
WHERE id = 'NEW_PRODUCT_ID';
```

**Success Criteria:**
- New product appears in admin list after save
- All fields persist in database
- Product appears after page reload
- created_at timestamp matches test time

---

## PHASE 4: Banner Updates Persistence Testing

### 4.1 Banner Text Update Test

**Test Scenario:** Change promotional banner text

**Steps:**
1. Go to Admin Panel → "الشريط الإعلاني" tab
2. Clear current text
3. Enter new text: "تجربة اختبار الحفظ - هذا نص جديد"
4. Click Save
5. Reload admin page
6. Verify text still shows new value

**Verification Queries:**
```sql
-- Check banner settings
SELECT banner_text, banner_visible, updated_at 
FROM site_settings 
LIMIT 1;

-- Verify update timestamp
SELECT 
  banner_text,
  EXTRACT(EPOCH FROM (NOW() - updated_at)) as seconds_ago
FROM site_settings;
```

**Success Criteria:**
- Banner text changes in site_settings table
- updated_at timestamp is recent
- Text persists after page reload
- Text appears on homepage banner

### 4.2 Banner Visibility Toggle Test

**Test Scenario:** Toggle banner on/off

**Steps:**
1. Go to Admin Panel → "الشريط الإعلاني" tab
2. Click toggle to hide banner (banner_visible = false)
3. Save
4. Verify banner disappears from homepage
5. Toggle back on
6. Verify banner reappears
7. Reload page and verify toggle state persisted

**Verification Queries:**
```sql
-- Check banner visibility state
SELECT banner_visible, updated_at FROM site_settings LIMIT 1;

-- Verify toggle sequence
SELECT banner_visible, updated_at FROM site_settings 
ORDER BY updated_at DESC LIMIT 5;
```

**Success Criteria:**
- banner_visible correctly set to true/false
- Toggle state persists after reload
- Banner appears/disappears on homepage accordingly

---

## PHASE 5: Data Integrity & Validation Testing

### 5.1 Duplicate ID Prevention Test

**Test Scenario:** Ensure no product ID duplicates

**Steps:**
1. Create 5 new products
2. Monitor admin list for duplicates
3. Query database for duplicate IDs

**Verification Query:**
```sql
-- Check for duplicate IDs
SELECT id, COUNT(*) 
FROM products 
GROUP BY id 
HAVING COUNT(*) > 1;

-- Should return 0 rows
```

**Success Criteria:**
- Query returns no results
- All product IDs are unique

### 5.2 Constraint Validation Test

**Test Scenario:** Verify data type constraints

**Steps:**
1. Attempt to save product with:
   - Invalid price (empty or text)
   - Invalid discount (> 100%)
2. Verify error handling

**Verification Query:**
```sql
-- Check for NULL values in required fields
SELECT COUNT(*) 
FROM products 
WHERE name_ar IS NULL OR name_en IS NULL OR price IS NULL;

-- Should return 0
```

**Success Criteria:**
- No NULL values in required fields
- Proper validation on forms
- Error messages displayed to user

### 5.3 Concurrent Update Test

**Test Scenario:** Verify handling of simultaneous updates

**Steps:**
1. Open admin panel in 2 browser windows
2. Edit same product in both windows with different values
3. Save first window
4. Save second window
5. Check which value persisted

**Expected Behavior:**
- Last update wins (timestamp-based)
- No data corruption
- Consistent state in database

---

## PHASE 6: Application Code Verification

### 6.1 handleSubmit Function Verification

**Requirement:** Verify admin/page.tsx handleSubmit saves to Supabase

**Code Check:**
```typescript
// Should call updateProduct() or createProduct()
// Should log: "[v0] Update result:" or "[v0] Create result:"
// Should set localStorage backup
// Should show success toast
```

### 6.2 Banner Update Function Verification

**Requirement:** Verify banner save function exists and works

**Code Check:**
```typescript
// Should have function to update site_settings table
// Should update both banner_text and banner_visible
// Should persist to Supabase
// Should show success message
```

### 6.3 Supabase Client Initialization

**Requirement:** Verify Supabase client is properly initialized

**Check File:** `/lib/supabase/client.ts`
```typescript
// Should export createClient function
// Should use environment variables correctly
// Should handle connection errors gracefully
```

---

## PHASE 7: Monitoring & Observability

### 7.1 Console Logging Verification

**Expected Logs on Product Update:**
```
[v0] handleSubmit called, editingId: <product-id>
[v0] Updating product: <product-id>
[v0] updateProduct called with id: <product-id>
[v0] Supabase client created
[v0] Product updated successfully: <product-id>
[v0] Supabase update result: <updated-product>
```

### 7.2 Database Query Logs

**Monitor:** Check Supabase dashboard for recent queries
```sql
-- Query to check recent updates
SELECT * FROM pg_stat_statements 
WHERE query LIKE '%UPDATE%products%' 
ORDER BY calls DESC;
```

---

## PHASE 8: Automated Verification Script

**File:** `/scripts/verify_persistence.sql`

```sql
-- Run this script to verify complete data integrity
-- 1. Check product count
SELECT COUNT(*) as total_products FROM products;

-- 2. Check for orphaned data
SELECT id, name_ar FROM products WHERE price IS NULL;

-- 3. Check banner settings
SELECT * FROM site_settings;

-- 4. Check coupon data
SELECT * FROM coupons WHERE is_active = true;

-- 5. Check recent updates (last 24 hours)
SELECT COUNT(*) as recent_updates 
FROM products 
WHERE updated_at > NOW() - INTERVAL '24 hours';
```

---

## Testing Checklist

- [ ] Phase 1: Database structure verified
- [ ] Phase 2: Single product update persists
- [ ] Phase 2.2: Changes survive page reload
- [ ] Phase 2.3: Multiple updates don't conflict
- [ ] Phase 2.4: Images update correctly
- [ ] Phase 3: New products persist
- [ ] Phase 4.1: Banner text updates persist
- [ ] Phase 4.2: Banner visibility toggle persists
- [ ] Phase 5.1: No duplicate IDs
- [ ] Phase 5.2: Data constraints enforced
- [ ] Phase 5.3: Concurrent updates handled correctly
- [ ] Phase 6: Code uses Supabase correctly
- [ ] Phase 7: Console logs show correct flow
- [ ] Phase 8: Verification script passes all checks

---

## Known Issues & Resolutions

### Issue 1: Products Load from localStorage First
**Problem:** On page reload, products load from localStorage before Supabase
**Resolution:** Modified useEffect to load from Supabase first, fallback to localStorage

### Issue 2: Banner Settings Not Connected
**Problem:** Banner updates might not persist
**Resolution:** Need to verify site_settings table is being updated correctly

### Issue 3: Image URLs
**Problem:** Image paths need to be correct format
**Resolution:** Verify image column stores correct paths consistently

---

## Success Criteria for Full Release

✅ All tests in Phases 1-8 must pass
✅ No console errors in browser DevTools
✅ Data persists across browser sessions
✅ No data loss or corruption detected
✅ All Supabase queries complete within 2 seconds
✅ Toast notifications display correctly
✅ Database logs show successful INSERT/UPDATE operations
