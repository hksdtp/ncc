# 🚀 Hướng Dẫn Setup Supabase Storage

## Bước 1: Tạo Supabase Project

1. Truy cập [supabase.com](https://supabase.com)
2. Đăng ký/Đăng nhập tài khoản
3. Click **"New Project"**
4. Chọn Organization và nhập:
   - **Name**: `shanghai-supplier-catalog`
   - **Database Password**: Tạo password mạnh
   - **Region**: Chọn gần Việt Nam (Singapore)
5. Click **"Create new project"**
6. Đợi 2-3 phút để project được khởi tạo

## Bước 2: Lấy Thông Tin Kết Nối

1. Trong Supabase Dashboard, vào **Settings** → **API**
2. Copy 2 thông tin sau:
   - **Project URL** (dạng: `https://xxx.supabase.co`)
   - **anon public key** (dạng: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## Bước 3: Tạo Database Tables

1. Vào **SQL Editor** trong Supabase Dashboard
2. Copy và chạy script SQL sau:

```sql
-- Tạo bảng suppliers
CREATE TABLE suppliers (
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

-- Tạo bảng supplier_media
CREATE TABLE supplier_media (
  id SERIAL PRIMARY KEY,
  supplier_id INTEGER REFERENCES suppliers(id),
  media_items JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_media ENABLE ROW LEVEL SECURITY;

-- Policies cho public access (cho demo)
CREATE POLICY "Enable read access for all users" ON suppliers FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON suppliers FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON suppliers FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON supplier_media FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON supplier_media FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON supplier_media FOR UPDATE USING (true);
```

## Bước 4: Tạo Storage Bucket

1. Vào **Storage** trong Supabase Dashboard
2. Click **"Create a new bucket"**
3. Nhập:
   - **Name**: `supplier-media`
   - **Public bucket**: ✅ Bật (để ảnh có thể truy cập public)
4. Click **"Create bucket"**

## Bước 5: Cấu Hình Storage Policies

Vào **SQL Editor** và chạy:

```sql
-- Policy cho public read access
CREATE POLICY "Public read access" ON storage.objects 
FOR SELECT USING (bucket_id = 'supplier-media');

-- Policy cho public upload access  
CREATE POLICY "Public upload access" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'supplier-media');

-- Policy cho public update access
CREATE POLICY "Public update access" ON storage.objects 
FOR UPDATE USING (bucket_id = 'supplier-media');

-- Policy cho public delete access
CREATE POLICY "Public delete access" ON storage.objects 
FOR DELETE USING (bucket_id = 'supplier-media');
```

## Bước 6: Kết Nối Ứng Dụng

1. Mở ứng dụng web của bạn
2. Click vào icon **⚙️ Settings** (góc trên bên phải)
3. Trong phần **"Cấu Hình Supabase"**:
   - Nhập **Supabase URL** (từ bước 2)
   - Nhập **Anon Key** (từ bước 2)
4. Click **"Kết Nối Supabase"**
5. Thấy thông báo **"Đã kết nối Supabase thành công!"**

## Bước 7: Upload Ảnh Lên Cloud

### Cách 1: Upload ảnh mới (tự động lên cloud)
1. Click vào nút **📷** của bất kỳ nhà cung cấp nào
2. Kéo thả hoặc chọn ảnh để upload
3. Ảnh sẽ tự động upload lên Supabase Storage
4. Thấy badge **"Cloud"** màu xanh trên ảnh

### Cách 2: Upload ảnh cũ (đã lưu local)
1. Vào **⚙️ Settings**
2. Click **"Upload Tất Cả Ảnh"**
3. Đợi quá trình upload hoàn tất
4. Tất cả ảnh local sẽ được chuyển lên cloud

## ✅ Kiểm Tra Thành Công

- **Status**: Hiển thị "🟢 Đã kết nối" trong Settings
- **Upload Info**: Hiển thị "☁️ Ảnh sẽ được upload lên Supabase Cloud"
- **Badge**: Ảnh có badge "Cloud" màu xanh
- **Storage**: Kiểm tra trong Supabase Storage thấy có file ảnh

## 🔧 Troubleshooting

### Lỗi kết nối:
- Kiểm tra URL và Key có đúng không
- Đảm bảo project Supabase đã khởi tạo xong

### Lỗi upload:
- Kiểm tra Storage bucket đã tạo chưa
- Kiểm tra Storage policies đã setup chưa

### Lỗi database:
- Kiểm tra tables đã tạo chưa
- Kiểm tra RLS policies đã setup chưa
