-- =====================================================
-- SIMPLE MIME TYPE FIX - Sửa nhanh mime type support
-- =====================================================

-- Kiểm tra hiện trạng
SELECT 'Current mime types for supplier-media:' as info;
SELECT id, name, allowed_mime_types FROM storage.buckets WHERE id = 'supplier-media';

-- Update mime types để hỗ trợ tất cả
UPDATE storage.buckets 
SET allowed_mime_types = NULL  -- NULL = allow all mime types
WHERE id = 'supplier-media';

-- Update các buckets khác cũng vậy
UPDATE storage.buckets 
SET allowed_mime_types = NULL
WHERE id IN ('media', 'uploads', 'files', 'storage', 'media-uploads');

-- Kiểm tra kết quả
SELECT 'After fix - mime types:' as info;
SELECT id, name, allowed_mime_types, 
       CASE 
         WHEN allowed_mime_types IS NULL THEN 'ALL TYPES ALLOWED' 
         ELSE array_to_string(allowed_mime_types, ', ')
       END as mime_support
FROM storage.buckets 
WHERE public = true
ORDER BY created_at;

SELECT 'Fix completed!' as status;
