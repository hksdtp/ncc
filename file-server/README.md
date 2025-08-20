# SMB File Server

HTTP API Server để tích hợp SMB storage với web application.

## 🚀 Tính năng

- **Upload files** lên SMB storage qua HTTP API
- **Serve files** từ SMB storage với caching
- **Delete files** từ SMB storage
- **List files** theo supplier ID
- **Image optimization** tự động (resize, compress)
- **CORS support** cho web applications

## 📋 Yêu cầu hệ thống

- **Node.js** 16+ 
- **SMB/CIFS** client tools
- **Network access** đến SMB server

### Linux/Ubuntu:
```bash
sudo apt-get install cifs-utils
```

### CentOS/RHEL:
```bash
sudo yum install cifs-utils
```

### macOS:
SMB support có sẵn trong macOS

### Windows:
SMB support có sẵn trong Windows

## 🛠️ Cài đặt

### 1. Clone và cài đặt dependencies:
```bash
cd file-server
npm install
```

### 2. Cấu hình SMB connection:

#### Linux/macOS:
```bash
chmod +x setup-smb.sh
./setup-smb.sh
```

#### Windows:
```cmd
setup-smb.bat
```

### 3. Chạy server:
```bash
npm start
```

## 🔧 Cấu hình

Tạo file `.env`:
```env
SMB_USERNAME=your_username
SMB_PASSWORD=your_password
SMB_MOUNT=/mnt/smb-storage  # Linux/macOS
# SMB_MOUNT=Z:\              # Windows
PORT=8080
```

## 📡 API Endpoints

### Health Check
```http
GET /ping
```

### Upload File
```http
POST /upload
Content-Type: multipart/form-data

file: [binary file]
supplierId: string (optional)
fileName: string (optional)
```

### Serve File
```http
GET /files/supplier-media/{supplierId}/{filename}
```

### Delete File
```http
DELETE /files/supplier-media/{supplierId}/{filename}
```

### List Files
```http
GET /list/{supplierId}
```

## 🧪 Test API

```bash
# Health check
curl http://localhost:8080/ping

# Upload file
curl -X POST \
  -F "file=@test-image.jpg" \
  -F "supplierId=supplier1" \
  http://localhost:8080/upload

# List files
curl http://localhost:8080/list/supplier1
```

## 🔒 Bảo mật

- Chỉ accept image/video files
- File size limit: 50MB
- Path traversal protection
- Input validation

## 📁 Cấu trúc thư mục

```
SMB Storage/
├── supplier-media/
│   ├── supplier1/
│   │   ├── image1.jpg
│   │   └── image2.png
│   └── supplier2/
│       └── video1.mp4
```

## 🚨 Troubleshooting

### SMB Mount Issues:
1. Check network: `ping 222.252.23.248`
2. Verify credentials
3. Check firewall
4. Try manual mount:
   ```bash
   sudo mount -t cifs //222.252.23.248/script /mnt/smb-storage -o username=your_user
   ```

### Permission Issues:
```bash
# Fix ownership
sudo chown -R $USER:$USER /mnt/smb-storage

# Fix permissions
sudo chmod -R 755 /mnt/smb-storage
```

### Windows Issues:
- Run Command Prompt as Administrator
- Check Windows Firewall
- Enable SMB client features

## 📊 Performance

- **Image optimization**: Auto-resize to max 1920px
- **Caching**: 1 year cache headers
- **Streaming**: Large files streamed efficiently
- **Compression**: JPEG quality 85%

## 🔄 Integration với Web App

Update web app để sử dụng file server:

```javascript
// Upload
const formData = new FormData();
formData.append('file', file);
formData.append('supplierId', supplierId);

const response = await fetch('http://localhost:8080/upload', {
    method: 'POST',
    body: formData
});

// Display
const imageUrl = 'http://localhost:8080/files/supplier-media/supplier1/image.jpg';
```
