# 🔧 SỬA LỖI SUPABASE BUCKET PERMISSIONS

## ❌ **LỖI HIỆN TẠI**
```
Error: Failed to create bucket: new row violates row-level security policy
```

## 🎯 **NGUYÊN NHÂN**
- App cố tạo bucket mới nhưng Supabase có Row Level Security (RLS) policy
- Không có quyền tạo bucket từ client-side
- Cần tạo bucket từ Supabase Dashboard

## ✅ **GIẢI PHÁP ĐÃ TRIỂN KHAI**

### **1. Đã sửa code:**
- ✅ **Không tạo bucket mới** từ client
- ✅ **Sử dụng bucket có sẵn** 
- ✅ **Fallback** to first available bucket
- ✅ **Error handling** rõ ràng

### **2. Code changes:**
- Loại bỏ `createBucket()` calls
- Thêm bucket detection logic
- Sử dụng `finalBucketName` thay vì hardcoded

## 🛠️ **CÁCH SỬA HOÀN TOÀN**

### **Option 1: Tạo bucket trong Supabase Dashboard**

#### **Bước 1: Vào Supabase Dashboard**
1. Mở https://supabase.com/dashboard
2. Chọn project của bạn
3. Vào **Storage** → **Buckets**

#### **Bước 2: Tạo bucket mới**
1. Click **"New bucket"**
2. **Name:** `supplier-media`
3. **Public:** ✅ Enabled
4. **File size limit:** 50MB
5. **Allowed MIME types:** `image/*,video/*`
6. Click **"Create bucket"**

### **Option 2: Chạy SQL script**

#### **Bước 1: Mở SQL Editor**
1. Vào Supabase Dashboard
2. Chọn **SQL Editor**

#### **Bước 2: Chạy script**
```sql
-- Copy và paste nội dung từ create_supabase_bucket.sql
```

### **Option 3: Sử dụng bucket có sẵn**

#### **Nếu đã có bucket:**
1. Kiểm tra tên bucket hiện tại
2. App sẽ tự động detect và sử dụng
3. Không cần làm gì thêm

## 🧪 **KIỂM TRA SAU KHI SỬA**

### **Bước 1: Reload web app**
```
http://localhost:8081
```

### **Bước 2: Test upload**
1. Chọn nhà cung cấp
2. Upload ảnh
3. Xem console logs:
   - `📊 Available buckets: [...]`
   - `✅ Using target bucket: supplier-media`

### **Bước 3: Kiểm tra kết quả**
- Không còn error "Failed to create bucket"
- Upload thành công
- Hiển thị "Cloud" badge

## 🔍 **DEBUG COMMANDS**

### **Kiểm tra buckets có sẵn:**
```javascript
// Trong browser console
const { data: buckets } = await supabase.storage.listBuckets();
console.log('Available buckets:', buckets);
```

### **Test upload manual:**
```javascript
// Test upload một file nhỏ
const testFile = new Blob(['test'], { type: 'text/plain' });
const result = await supabase.storage
  .from('supplier-media')
  .upload('test.txt', testFile);
console.log('Upload result:', result);
```

## 📊 **TRẠNG THÁI HIỆN TẠI**

### **✅ Đã sửa:**
- ✅ Loại bỏ bucket creation từ client
- ✅ Thêm bucket detection
- ✅ Fallback logic
- ✅ Better error messages

### **🎯 Cần làm:**
- 🔧 Tạo bucket trong Supabase Dashboard
- 🧪 Test upload sau khi tạo bucket

## 💡 **BEST PRACTICES**

### **1. Bucket Management:**
- Luôn tạo bucket từ Dashboard/SQL
- Không tạo bucket từ client-side
- Set up proper RLS policies

### **2. Error Handling:**
- Check bucket availability trước upload
- Provide clear error messages
- Fallback to available buckets

### **3. Security:**
- Use RLS policies đúng cách
- Limit file types và sizes
- Monitor bucket usage

---

**🎯 Sau khi tạo bucket trong Supabase Dashboard, app sẽ hoạt động bình thường! 🚀**
