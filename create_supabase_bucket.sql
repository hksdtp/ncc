-- 🪣 CREATE SUPABASE BUCKET FOR MEDIA UPLOADS
-- Run this in your Supabase SQL Editor

-- 1. Create the bucket (if not exists)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'supplier-media',
    'supplier-media', 
    true,
    52428800, -- 50MB limit
    ARRAY['image/*', 'video/*']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Set up RLS policies for the bucket
-- Allow public read access
CREATE POLICY "Public read access for supplier-media" ON storage.objects
FOR SELECT USING (bucket_id = 'supplier-media');

-- Allow authenticated uploads
CREATE POLICY "Authenticated upload for supplier-media" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'supplier-media');

-- Allow public uploads (if you want anonymous uploads)
CREATE POLICY "Public upload for supplier-media" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'supplier-media');

-- 3. Alternative: If you want to use an existing bucket, just update the app
-- Change the bucket name in your app to match an existing bucket

-- 4. Verify bucket creation
SELECT * FROM storage.buckets WHERE name = 'supplier-media';

-- 5. Test bucket permissions
-- You should see the bucket listed when you run:
-- SELECT * FROM storage.buckets;
