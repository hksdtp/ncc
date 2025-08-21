-- =====================================================
-- OPTIMIZE BUCKET CONFIG - Tối ưu hóa cấu hình bucket
-- =====================================================
-- Fix mime type và cải thiện performance

-- 🔍 KIỂM TRA HIỆN TRẠNG
-- =====================================================
SELECT 'Current bucket configurations:' as info;
SELECT 
    id, 
    name, 
    public, 
    file_size_limit,
    allowed_mime_types,
    created_at 
FROM storage.buckets 
ORDER BY created_at;

-- 🔧 CẬP NHẬT BUCKET CONFIGURATIONS
-- =====================================================

-- Update supplier-media bucket với mime types đầy đủ
UPDATE storage.buckets 
SET 
    allowed_mime_types = ARRAY[
        'image/*',           -- Tất cả ảnh
        'video/*',           -- Tất cả video  
        'audio/*',           -- Tất cả audio
        'application/pdf',   -- PDF files
        'application/msword', -- Word docs
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', -- .docx
        'application/vnd.ms-excel', -- Excel
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', -- .xlsx
        'application/json',  -- JSON files
        'text/plain',        -- Text files
        'text/csv',          -- CSV files
        'application/zip',   -- ZIP files
        'application/x-rar-compressed', -- RAR files
        'application/octet-stream' -- Binary files
    ],
    file_size_limit = 104857600, -- 100MB limit (tăng từ 50MB)
    public = true
WHERE id = 'supplier-media';

-- Update các buckets khác
UPDATE storage.buckets 
SET 
    allowed_mime_types = ARRAY[
        'image/*', 'video/*', 'audio/*', 'application/*', 'text/*'
    ],
    file_size_limit = 104857600,
    public = true
WHERE id IN ('media', 'uploads', 'files', 'storage');

-- 🆕 TẠO BUCKET MỚI CHO TEST UPLOADS
-- =====================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'media-uploads',
    'media-uploads', 
    true,
    104857600, -- 100MB
    ARRAY['image/*', 'video/*', 'audio/*', 'application/*', 'text/*']
)
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 104857600,
    allowed_mime_types = ARRAY['image/*', 'video/*', 'audio/*', 'application/*', 'text/*'];

-- 🔧 TỐI ƯU HÓA RLS POLICIES
-- =====================================================

-- Xóa policies cũ nếu có
DROP POLICY IF EXISTS "Optimized public read buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Optimized public create buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Optimized public read objects" ON storage.objects;
DROP POLICY IF EXISTS "Optimized public insert objects" ON storage.objects;

-- Tạo policies tối ưu mới
CREATE POLICY "Optimized public read buckets" ON storage.buckets
FOR SELECT USING (public = true);

CREATE POLICY "Optimized public create buckets" ON storage.buckets
FOR INSERT WITH CHECK (public = true);

CREATE POLICY "Optimized public read objects" ON storage.objects
FOR SELECT USING (bucket_id IN (
    SELECT id FROM storage.buckets WHERE public = true
));

CREATE POLICY "Optimized public insert objects" ON storage.objects
FOR INSERT WITH CHECK (bucket_id IN (
    SELECT id FROM storage.buckets WHERE public = true
));

CREATE POLICY "Optimized public update objects" ON storage.objects
FOR UPDATE USING (bucket_id IN (
    SELECT id FROM storage.buckets WHERE public = true
));

CREATE POLICY "Optimized public delete objects" ON storage.objects
FOR DELETE USING (bucket_id IN (
    SELECT id FROM storage.buckets WHERE public = true
));

-- 📊 TẠO INDEXES ĐỂ TĂNG PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_storage_buckets_public ON storage.buckets(public) WHERE public = true;
CREATE INDEX IF NOT EXISTS idx_storage_objects_bucket_public ON storage.objects(bucket_id) 
WHERE bucket_id IN (SELECT id FROM storage.buckets WHERE public = true);

-- 🧹 DỌN DẸP POLICIES CŨ KHÔNG CẦN THIẾT
-- =====================================================
DROP POLICY IF EXISTS "Allow public read buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Allow public create buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Allow public update buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Allow public delete buckets" ON storage.buckets;
DROP POLICY IF EXISTS "Allow public read all objects" ON storage.objects;
DROP POLICY IF EXISTS "Allow public insert all objects" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update all objects" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete all objects" ON storage.objects;

-- 🔍 KIỂM TRA KẾT QUẢ SAU TỐI ƯU
-- =====================================================
SELECT 'Optimized bucket configurations:' as info;
SELECT 
    id, 
    name, 
    public, 
    file_size_limit/1024/1024 as size_limit_mb,
    array_length(allowed_mime_types, 1) as mime_types_count,
    allowed_mime_types
FROM storage.buckets 
WHERE public = true
ORDER BY created_at;

SELECT 'Active RLS policies:' as info;
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename IN ('buckets', 'objects')
  AND policyname LIKE 'Optimized%'
ORDER BY tablename, policyname;

-- 🧪 TEST FINAL
-- =====================================================
SELECT 'Test bucket access after optimization:' as info;
SELECT id, name, public FROM storage.buckets WHERE public = true;

SELECT 'Ready for optimized testing!' as status;
