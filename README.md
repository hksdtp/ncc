# 🏢 Shanghai Supplier Catalog - Ứng Dụng Quản Lý Nhà Cung Cấp

Ứng dụng web hiện đại để quản lý thông tin nhà cung cấp từ Hội chợ R&T Thượng Hải với tích hợp Supabase cloud storage.

## ✨ Tính Năng Chính

### 🎨 Giao Diện
- **Side-panel Gallery**: Xem ảnh sản phẩm với animation mượt mà
- **Responsive Design**: Tương thích mobile và desktop
- **Vietnamese UI**: Giao diện hoàn toàn tiếng Việt
- **Modern Styling**: Tailwind CSS với gradient và hover effects

### 📸 Quản Lý Media
- **Auto Upload**: Tự động upload ảnh lên Supabase Storage
- **Visual Status**: Badges hiển thị trạng thái Cloud/Local
- **Drag & Drop**: Kéo thả file để upload
- **Batch Operations**: Upload hàng loạt ảnh đã có
- **Fullscreen Viewer**: Xem ảnh toàn màn hình

### 🏪 Quản Lý Nhà Cung Cấp
- **5 Nhà Cung Cấp**: Từ Hội chợ R&T với thông tin chi tiết
- **WeChat Integration**: Click để mở WeChat trực tiếp
- **Contact Management**: Quản lý thông tin liên hệ
- **Status Tracking**: Theo dõi trạng thái đàm phán
- **Real-time Sync**: Đồng bộ dữ liệu tự động

### ☁️ Cloud Integration
- **Supabase Storage**: Lưu trữ ảnh trên cloud
- **Real-time Database**: Đồng bộ dữ liệu realtime
- **Offline Support**: Hoạt động khi không có internet
- **Auto Backup**: Tự động backup dữ liệu

## 🚀 Deployment

### Vercel (Recommended)
1. Fork repository này
2. Kết nối với Vercel
3. Deploy tự động từ GitHub

### GitHub Pages
```bash
# Enable GitHub Pages trong Settings
# Chọn source: Deploy from a branch
# Branch: main, folder: / (root)
```

### Local Development
```bash
# Clone repository
git clone https://github.com/hksdtp/ncc.git
cd ncc

# Mở file HTML trong browser
open index.html
```

## ⚙️ Cấu Hình Supabase

### 1. Tạo Supabase Project
1. Truy cập [supabase.com](https://supabase.com)
2. Tạo project mới
3. Copy URL và anon key

### 2. Setup Database
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
```

### 3. Setup Storage
```sql
-- Tạo bucket cho media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('supplier-media', 'supplier-media', true);

-- Policy cho public read
CREATE POLICY "Public read access" ON storage.objects 
FOR SELECT USING (bucket_id = 'supplier-media');

-- Policy cho authenticated upload
CREATE POLICY "Authenticated upload access" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'supplier-media');
```

### 4. Kết Nối Ứng Dụng
1. Mở ứng dụng → Click ⚙️ Settings
2. Nhập **Supabase URL** và **Anon Key**
3. Click **"Kết Nối Supabase"**
4. Upload ảnh sẽ tự động lưu lên cloud!

## 🏪 Nhà Cung Cấp

### 1. Haining Siqi Textile Co.,Ltd.
- **Loại**: Ncc Voan, đã lấy mẫu
- **Liên hệ**: Tina Song
- **WeChat**: syt0206
- **Địa chỉ**: Dongfeng 100 Tuanjiecun Xucun, Haining Zhejiang China 314409

### 2. 中艺遮阳
- **Loại**: Che Nắng & Ô Dù
- **WeChat**: psZYCS

### 3. 品红总经理助理
- **Công ty**: Công ty cổ phần truyền thông văn hóa Shaoxing Shushia
- **Liên hệ**: Cao / Tang
- **WeChat**: phqh2017
- **Điện thoại**: 1595 850 2458 / 15325751655
- **Địa chỉ**: Xinfeng Park, đường Biaojia, đường Keyan, quận Keqiao, Shaoxing, Chiết Giang

### 4. 难得糊涂
- **WeChat**: sjw0901w7

### 5. Michael
- **Liên hệ**: Michael
- **WeChat**: michael859
- **Ghi chú**: Đã có liên hệ trên Xưởng Vinh Quang

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS
- **Icons**: Font Awesome
- **Backend**: Supabase (PostgreSQL + Storage)
- **Deployment**: Vercel / GitHub Pages
- **Version Control**: Git + GitHub

## 📱 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Tạo Pull Request

## 📄 License

MIT License - xem file [LICENSE](LICENSE) để biết thêm chi tiết.

## 🎯 Roadmap

- [ ] Multi-language support (English, Chinese)
- [ ] Export to PDF/Excel
- [ ] Advanced search and filtering
- [ ] User authentication system
- [ ] Mobile app version
- [ ] Integration with more messaging platforms

## 🔗 Links

- **Live Demo**: [Vercel Deployment](https://ncc-hksdtp.vercel.app)
- **GitHub**: [Repository](https://github.com/hksdtp/ncc)
- **Issues**: [Bug Reports](https://github.com/hksdtp/ncc/issues)

---

🤖 **Generated with [Claude Code](https://claude.ai/code)**

Co-Authored-By: Claude <noreply@anthropic.com>