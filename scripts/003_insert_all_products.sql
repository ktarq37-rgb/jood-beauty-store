-- Clear existing test data first
DELETE FROM products;

-- Insert first 5 products as test (we'll add more after verification)
INSERT INTO products (name_ar, name_en, description_ar, description_en, price, original_price, category, subcategory, brand, image, is_on_sale, discount_percentage) VALUES
('سيروم جومسو نياسيناميد 20 - 30مل', 'JUMISO Niacinamide 20 Serum - 30ml', 'سيروم مركز بنسبة 20% نياسيناميد لتفتيح البشرة وتوحيد لونها', 'Concentrated serum with 20% Niacinamide for brightening and evening skin tone', 77860, 77860, 'Skin Care', 'serums', 'JUMISO', '/jumiso-niacinamide-serum-bottle-30ml-korean-skincare.jpg', false, 0),
('تونر اي يو كيه أسيد 3 في 1 - 250مل', 'Im From AHA BHA PHA 30 Days Miracle Toner - 250ml', 'تونر تقشير كيميائي لطيف ينظف المسام ويزيل الشوائب', 'Gentle chemical exfoliating toner that cleanses pores and removes impurities', 77860, 77860, 'Skin Care', 'toners', 'Im From', '/imfrom-aha-bha-pha-toner-green-bottle-korean.jpg', false, 0),
('بأد سكين%100 سينتيلا للتنظيف الداخلة 60 قطعة', 'PAD SKIN 100% Centella Cleansing Pads - 60pcs', 'باد منظف بخلاصة السنتيلا الطبيعية لبشرة هادئة ونظيفة', 'Cleansing pads with pure Centella extract for calm and clean skin', 77860, 77860, 'Skin Care', 'cleansers', 'PAD SKIN', '/padskin-centella-cleansing-pads-jar-60pcs.jpg', false, 0),
('جمجوسو أوبا سيروم ميدي روبو - 30مل', 'JUMISO Awe-Sun Aura-Bright Vitalizing Serum - 30ml', 'سيروم مجدد ومضيء للبشرة بتركيبة غنية بالفيتامينات', 'Revitalizing and brightening serum with vitamin-rich formula', 96180, 96180, 'Skin Care', 'serums', 'JUMISO', '/jumiso-awe-sun-serum-bottle-orange-korean.jpg', false, 0),
('كريم مايدوكا تالين برايميرس 50مل', 'MEDICUBE Age-R Deep Derma Cleansing Foam - 50ml', 'رغوة تنظيف عميقة لإزالة الشوائب والزيوت الزائدة', 'Deep cleansing foam to remove impurities and excess oils', 75112, 75112, 'Skin Care', 'cleansers', 'MEDICUBE', '/medicube-deep-derma-foam-tube-white-korean.jpg', false, 0);
