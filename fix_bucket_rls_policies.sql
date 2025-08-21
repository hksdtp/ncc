-- =====================================================
-- FIX BUCKET RLS POLICIES - Sửa lỗi "row-level security policy violation"
-- =====================================================
-- Copy và paste script này vào SQL Editor trong Supabase Dashboard

-- 🔍 KIỂM TRA HIỆN TRẠNG
-- =====================================================
SELECT 'Current buckets:' as info;
SELECT id, name, public, created_at FROM storage.buckets;

SELECT 'Current bucket policies:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'buckets';

-- 🧹 XÓA CÁC POLICIES CŨ CHO BUCKETS (nếu có)
-- =====================================================
DROP POLICY IF EXISTS "Public read buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Public create buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Public update buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Public delete buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Allow public bucket access" ON storage.buckets;
DROP POLICY IF EXISTS "Allow authenticated bucket access" ON storage.buckets;

-- 🔓 TẠO RLS POLICIES MỚI CHO STORAGE.BUCKETS
-- =====================================================

-- Cho phép public đọc danh sách buckets
CREATE POLICY "Allow public read buckets" ON storage.buckets
FOR SELECT USING (true);

-- Cho phép public tạo buckets
CREATE POLICY "Allow public create buckets" ON storage.buckets
FOR INSERT WITH CHECK (true);

-- Cho phép public update buckets
CREATE POLICY "Allow public update buckets" ON storage.buckets
FOR UPDATE USING (true) WITH CHECK (true);

-- Cho phép public delete buckets (optional, có thể bỏ nếu không cần)
CREATE POLICY "Allow public delete buckets" ON storage.buckets
FOR DELETE USING (true);

-- 🔓 KIỂM TRA VÀ SỬA RLS POLICIES CHO STORAGE.OBJECTS
-- =====================================================

-- Xóa policies cũ cho objects
DROP POLICY IF EXISTS "Public read access for supplier-media" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload for supplier-media" ON storage.objects;
DROP POLICY IF EXISTS "Public upload for supplier-media" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete access" ON storage.objects;

-- Tạo policies mới cho objects (cho tất cả buckets)
CREATE POLICY "Allow public read all objects" ON storage.objects
FOR SELECT USING (true);

CREATE POLICY "Allow public insert all objects" ON storage.objects
FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update all objects" ON storage.objects
FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete all objects" ON storage.objects
FOR DELETE USING (true);

-- 🪣 TẠO BUCKET SUPPLIER-MEDIA (nếu chưa có)
-- =====================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'supplier-media',
    'supplier-media', 
    true,
    52428800, -- 50MB limit
    ARRAY['image/*', 'video/*', 'application/*']
)
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY['image/*', 'video/*', 'application/*'];

-- 🪣 TẠO THÊM MỘT SỐ BUCKETS KHÁC ĐỂ TEST
-- =====================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES 
    ('media', 'media', true, 52428800),
    ('uploads', 'uploads', true, 52428800),
    ('files', 'files', true, 52428800),
    ('storage', 'storage', true, 52428800)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 🔍 KIỂM TRA KẾT QUẢ
-- =====================================================
SELECT 'Buckets after fix:' as info;
SELECT id, name, public, created_at FROM storage.buckets ORDER BY created_at;

SELECT 'Bucket policies after fix:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'buckets';

SELECT 'Object policies after fix:' as info;
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'objects';

-- 🧪 TEST QUERIES
-- =====================================================
SELECT 'Test bucket access:' as info;
-- Simulate what the app does
SELECT id, name, public FROM storage.buckets WHERE public = true;

SELECT 'Ready for testing!' as status;
