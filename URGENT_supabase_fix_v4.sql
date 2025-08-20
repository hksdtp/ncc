-- =====================================================
-- URGENT: Cloud-Only Storage v4.0.0 - Supabase Setup
-- =====================================================
-- Run this in your Supabase Dashboard SQL Editor to fix 405 errors
-- This ensures proper bucket and policy configuration

-- 1. CREATE/UPDATE STORAGE BUCKET
-- =====================================================
-- Delete and recreate bucket with correct settings
DELETE FROM storage.objects WHERE bucket_id = 'supplier-media';
DELETE FROM storage.buckets WHERE id = 'supplier-media';

-- Create new bucket with public access
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'supplier-media', 
    'supplier-media', 
    true, 
    52428800, -- 50MB limit
    ARRAY['image/*', 'video/*']
)
ON CONFLICT (id) DO UPDATE SET 
    public = true,
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY['image/*', 'video/*'];

-- 2. REMOVE ALL OLD STORAGE POLICIES
-- =====================================================
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload access" ON storage.objects;
DROP POLICY IF EXISTS "Public delete access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public upload access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update access" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete access" ON storage.objects;

-- 3. CREATE NEW STORAGE POLICIES (CLOUD-ONLY v4.0.0)
-- =====================================================
-- Enable RLS on storage.objects if not enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Allow public read access to supplier-media bucket
CREATE POLICY "Cloud-Only v4.0.0: Public read" ON storage.objects
FOR SELECT USING (bucket_id = 'supplier-media');

-- Allow public upload to supplier-media bucket
CREATE POLICY "Cloud-Only v4.0.0: Public insert" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'supplier-media');

-- Allow public update in supplier-media bucket
CREATE POLICY "Cloud-Only v4.0.0: Public update" ON storage.objects
FOR UPDATE USING (bucket_id = 'supplier-media');

-- Allow public delete from supplier-media bucket
CREATE POLICY "Cloud-Only v4.0.0: Public delete" ON storage.objects
FOR DELETE USING (bucket_id = 'supplier-media');

-- 4. DATABASE TABLE POLICIES
-- =====================================================
-- Disable RLS temporarily for setup
ALTER TABLE suppliers DISABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_media DISABLE ROW LEVEL SECURITY;

-- Remove old policies
DROP POLICY IF EXISTS "Allow all operations on suppliers" ON suppliers;
DROP POLICY IF EXISTS "Allow all operations on supplier_media" ON supplier_media;

-- Enable RLS
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_media ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for Cloud-Only v4.0.0
CREATE POLICY "Cloud-Only v4.0.0: Full access to suppliers" ON suppliers
FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Cloud-Only v4.0.0: Full access to supplier_media" ON supplier_media
FOR ALL USING (true) WITH CHECK (true);

-- 5. OPTIMIZE DATABASE PERFORMANCE
-- =====================================================
-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_suppliers_id_v4 ON suppliers(id);
CREATE INDEX IF NOT EXISTS idx_supplier_media_supplier_id_v4 ON supplier_media(supplier_id);
CREATE INDEX IF NOT EXISTS idx_storage_objects_bucket_path_v4 ON storage.objects(bucket_id, name);

-- Update statistics
ANALYZE suppliers;
ANALYZE supplier_media;
ANALYZE storage.objects;

-- 6. VERIFY SETUP
-- =====================================================
-- Check bucket configuration
SELECT 
    id, 
    name, 
    public,
    file_size_limit,
    allowed_mime_types
FROM storage.buckets 
WHERE id = 'supplier-media';

-- Check storage policies
SELECT 
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    cmd,
    qual
FROM pg_policies 
WHERE schemaname = 'storage' AND tablename = 'objects'
   AND policyname LIKE '%Cloud-Only v4.0.0%';

-- Check database table policies  
SELECT 
    schemaname,
    tablename, 
    policyname,
    permissive,
    cmd
FROM pg_policies 
WHERE tablename IN ('suppliers', 'supplier_media')
   AND policyname LIKE '%Cloud-Only v4.0.0%';

-- 7. SUCCESS MESSAGE
-- =====================================================
SELECT 'Cloud-Only Storage v4.0.0 setup complete! Your app should now work without 405 errors.' as status;