# ⚡ Quick Start - Chuyển Ảnh Lên Supabase Cloud

## 🎯 Mục tiêu
Chuyển tất cả ảnh từ lưu trữ cục bộ (local) lên Supabase Cloud Storage

## 📋 Checklist Setup (5 phút)

### ✅ Bước 1: Tạo Supabase Project
1. Vào [supabase.com](https://supabase.com) → Tạo project mới
2. Lấy **Project URL** và **Anon Key** từ Settings → API

### ✅ Bước 2: Setup Database
1. Vào **SQL Editor** trong Supabase
2. Copy toàn bộ nội dung file `supabase_setup.sql`
3. Paste và click **Run** 

### ✅ Bước 3: Tạo Storage Bucket
1. Vào **Storage** → Create bucket
2. Name: `supplier-media`
3. Public: ✅ Bật

### ✅ Bước 4: Kết Nối App
1. Mở web app → Click ⚙️ **Settings**
2. Nhập **Supabase URL** và **Anon Key**
3. Click **"Kết Nối Supabase"**

### ✅ Bước 5: Upload Ảnh
**Cách 1: Upload ảnh cũ**
- Click **"Upload Tất Cả Ảnh"** trong Settings
- Đợi upload hoàn tất

**Cách 2: Upload ảnh mới**
- Click 📷 của nhà cung cấp
- Kéo thả ảnh → Tự động lên cloud

## 🔍 Kiểm Tra Thành Công

### Visual Indicators:
- **Settings**: "🟢 Đã kết nối" 
- **Upload Area**: "☁️ Ảnh sẽ được upload lên Supabase Cloud"
- **Ảnh**: Badge "Cloud" màu xanh

### Technical Check:
- **Supabase Storage**: Thấy file ảnh trong bucket
- **Database**: Có data trong tables `suppliers` và `supplier_media`

## 🚨 Troubleshooting

| Vấn đề | Giải pháp |
|--------|-----------|
| Không kết nối được | Kiểm tra URL/Key, đảm bảo project đã khởi tạo |
| Lỗi upload | Kiểm tra bucket và storage policies |
| Lỗi database | Chạy lại script SQL setup |

## 💡 Lợi Ích Sau Khi Setup

1. **☁️ Cloud Storage**: Ảnh lưu trên Supabase, truy cập từ mọi nơi
2. **🔄 Auto Sync**: Dữ liệu tự động đồng bộ
3. **📱 Multi-device**: Truy cập từ nhiều thiết bị
4. **🔒 Backup**: Dữ liệu được backup tự động
5. **⚡ Performance**: Load ảnh nhanh hơn từ CDN

## 📞 Hỗ Trợ

Nếu gặp vấn đề, kiểm tra:
1. File `SUPABASE_SETUP.md` - Hướng dẫn chi tiết
2. File `supabase_setup.sql` - Script setup database
3. Console log trong browser (F12) để xem lỗi chi tiết
