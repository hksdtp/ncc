-- =====================================================
-- FIX SUPABASE RLS POLICIES - Sửa lỗi 405 và timeout
-- =====================================================
-- Copy và paste script này vào SQL Editor trong Supabase Dashboard

-- 1. DISABLE RLS tạm thời để test
-- =====================================================
ALTER TABLE suppliers DISABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_media DISABLE ROW LEVEL SECURITY;

-- 2. XÓA TẤT CẢ POLICIES CŨ
-- =====================================================
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload access" ON storage.objects;
DROP POLICY IF EXISTS "Public delete access" ON storage.objects;

-- 3. TẠO POLICIES MỚI CHO STORAGE
-- =====================================================
-- Allow public read access
CREATE POLICY "Allow public read access" ON storage.objects 
FOR SELECT USING (bucket_id = 'supplier-media');

-- Allow public upload
CREATE POLICY "Allow public upload access" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'supplier-media');

-- Allow public update
CREATE POLICY "Allow public update access" ON storage.objects 
FOR UPDATE USING (bucket_id = 'supplier-media');

-- Allow public delete
CREATE POLICY "Allow public delete access" ON storage.objects 
FOR DELETE USING (bucket_id = 'supplier-media');

-- 4. KIỂM TRA BUCKET TỒN TẠI
-- =====================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('supplier-media', 'supplier-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 5. TẠO INDEX ĐỂ TĂNG PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_suppliers_id ON suppliers(id);
CREATE INDEX IF NOT EXISTS idx_supplier_media_supplier_id ON supplier_media(supplier_id);
CREATE INDEX IF NOT EXISTS idx_storage_objects_bucket_id ON storage.objects(bucket_id);

-- 6. ENABLE RLS LẠI VỚI POLICIES MỚI
-- =====================================================
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_media ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (for testing)
CREATE POLICY "Allow all operations on suppliers" ON suppliers
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on supplier_media" ON supplier_media
FOR ALL USING (true) WITH CHECK (true);

-- 7. KIỂM TRA CONNECTION POOL SETTINGS
-- =====================================================
-- Chạy query này để kiểm tra connection pool
SELECT 
    datname,
    numbackends,
    xact_commit,
    xact_rollback,
    blks_read,
    blks_hit,
    tup_returned,
    tup_fetched,
    tup_inserted,
    tup_updated,
    tup_deleted
FROM pg_stat_database 
WHERE datname = current_database();

-- 8. OPTIMIZE DATABASE SETTINGS
-- =====================================================
-- Tăng timeout settings
SET statement_timeout = '30s';
SET lock_timeout = '10s';
SET idle_in_transaction_session_timeout = '60s';

-- 9. VACUUM TABLES ĐỂ OPTIMIZE PERFORMANCE
-- =====================================================
VACUUM ANALYZE suppliers;
VACUUM ANALYZE supplier_media;
VACUUM ANALYZE storage.objects;

-- 10. KIỂM TRA KẾT QUẢ
-- =====================================================
-- Test query để kiểm tra
SELECT 'Suppliers table' as table_name, count(*) as row_count FROM suppliers
UNION ALL
SELECT 'Supplier media table' as table_name, count(*) as row_count FROM supplier_media
UNION ALL
SELECT 'Storage objects' as table_name, count(*) as row_count FROM storage.objects WHERE bucket_id = 'supplier-media';

-- Kiểm tra policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('suppliers', 'supplier_media') 
   OR (schemaname = 'storage' AND tablename = 'objects');
