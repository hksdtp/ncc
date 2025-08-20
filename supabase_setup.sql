-- =====================================================
-- SHANGHAI SUPPLIER CATALOG - SUPABASE SETUP SCRIPT
-- =====================================================
-- Copy và paste script này vào SQL Editor trong Supabase Dashboard

-- 1. TẠO BẢNG SUPPLIERS
-- =====================================================
CREATE TABLE IF NOT EXISTS suppliers (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  category TEXT NOT NULL,
  wechat TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  contact_person TEXT,
  status TEXT DEFAULT 'not-contacted',
  priority TEXT DEFAULT 'medium',
  notes TEXT,
  internal_notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TẠO BẢNG SUPPLIER_MEDIA
-- =====================================================
CREATE TABLE IF NOT EXISTS supplier_media (
  id SERIAL PRIMARY KEY,
  supplier_id INTEGER REFERENCES suppliers(id) ON DELETE CASCADE,
  media_items JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TẠO INDEX ĐỂ TỐI ƯU HIỆU SUẤT
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_suppliers_id ON suppliers(id);
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON suppliers(status);
CREATE INDEX IF NOT EXISTS idx_supplier_media_supplier_id ON supplier_media(supplier_id);

-- 4. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_media ENABLE ROW LEVEL SECURITY;

-- 5. TẠO POLICIES CHO SUPPLIERS TABLE
-- =====================================================
-- Xóa policies cũ nếu có
DROP POLICY IF EXISTS "Enable read access for all users" ON suppliers;
DROP POLICY IF EXISTS "Enable insert access for all users" ON suppliers;
DROP POLICY IF EXISTS "Enable update access for all users" ON suppliers;
DROP POLICY IF EXISTS "Enable delete access for all users" ON suppliers;

-- Tạo policies mới
CREATE POLICY "Enable read access for all users" ON suppliers 
FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON suppliers 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON suppliers 
FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON suppliers 
FOR DELETE USING (true);

-- 6. TẠO POLICIES CHO SUPPLIER_MEDIA TABLE
-- =====================================================
-- Xóa policies cũ nếu có
DROP POLICY IF EXISTS "Enable read access for all users" ON supplier_media;
DROP POLICY IF EXISTS "Enable insert access for all users" ON supplier_media;
DROP POLICY IF EXISTS "Enable update access for all users" ON supplier_media;
DROP POLICY IF EXISTS "Enable delete access for all users" ON supplier_media;

-- Tạo policies mới
CREATE POLICY "Enable read access for all users" ON supplier_media 
FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON supplier_media 
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON supplier_media 
FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON supplier_media 
FOR DELETE USING (true);

-- 7. TẠO STORAGE BUCKET (Chạy riêng nếu chưa có)
-- =====================================================
-- Lưu ý: Phần này có thể cần chạy riêng nếu gặp lỗi
INSERT INTO storage.buckets (id, name, public) 
VALUES ('supplier-media', 'supplier-media', true)
ON CONFLICT (id) DO NOTHING;

-- 8. TẠO STORAGE POLICIES
-- =====================================================
-- Xóa policies cũ nếu có
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Public upload access" ON storage.objects;
DROP POLICY IF EXISTS "Public update access" ON storage.objects;
DROP POLICY IF EXISTS "Public delete access" ON storage.objects;

-- Tạo policies mới cho storage
CREATE POLICY "Public read access" ON storage.objects 
FOR SELECT USING (bucket_id = 'supplier-media');

CREATE POLICY "Public upload access" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'supplier-media');

CREATE POLICY "Public update access" ON storage.objects 
FOR UPDATE USING (bucket_id = 'supplier-media');

CREATE POLICY "Public delete access" ON storage.objects 
FOR DELETE USING (bucket_id = 'supplier-media');

-- 9. TẠO FUNCTION ĐỂ TỰ ĐỘNG CẬP NHẬT UPDATED_AT
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. TẠO TRIGGER CHO AUTO UPDATE TIMESTAMP
-- =====================================================
DROP TRIGGER IF EXISTS update_suppliers_updated_at ON suppliers;
CREATE TRIGGER update_suppliers_updated_at 
    BEFORE UPDATE ON suppliers 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_supplier_media_updated_at ON supplier_media;
CREATE TRIGGER update_supplier_media_updated_at 
    BEFORE UPDATE ON supplier_media 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- HOÀN THÀNH SETUP!
-- =====================================================
-- Sau khi chạy script này thành công:
-- 1. Kiểm tra Tables đã được tạo trong Database
-- 2. Kiểm tra Storage bucket 'supplier-media' đã được tạo
-- 3. Kết nối ứng dụng với Supabase URL và Anon Key
-- 4. Test upload ảnh để đảm bảo mọi thứ hoạt động

SELECT 'Setup completed successfully! 🎉' as status;
