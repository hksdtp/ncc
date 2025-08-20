const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');

const app = express();
const PORT = process.env.PORT || 8080;

// SMB Storage Configuration
const SMB_CONFIG = {
    host: '222.252.23.248',
    share: 'script',
    username: process.env.SMB_USERNAME || 'haininh',
    password: process.env.SMB_PASSWORD || 'Villad24@',
    mountPoint: process.env.SMB_MOUNT || '/mnt/smb-storage', // Linux/macOS
    // Windows: 'Z:\\' hoặc '\\\\222.252.23.248\\script'

    // Network configuration for cross-device access
    serverHost: process.env.SERVER_HOST || '0.0.0.0', // Listen on all interfaces
    serverPort: process.env.PORT || 8080
};

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    },
    fileFilter: (req, file, cb) => {
        // Accept images and videos
        if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images and videos are allowed!'), false);
        }
    }
});

// Ensure SMB mount directory exists
async function ensureSMBMount() {
    try {
        await fs.ensureDir(SMB_CONFIG.mountPoint);
        console.log(`✅ SMB mount point ready: ${SMB_CONFIG.mountPoint}`);
        return true;
    } catch (error) {
        console.error('❌ SMB mount point error:', error);
        return false;
    }
}

// Health check endpoint
app.get('/ping', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        smb_config: {
            host: SMB_CONFIG.host,
            share: SMB_CONFIG.share,
            mountPoint: SMB_CONFIG.mountPoint
        }
    });
});

// Upload endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        console.log('📤 Upload request received');
        
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const { supplierId, fileName } = req.body;
        const file = req.file;
        
        console.log('📁 File info:', {
            originalName: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
            supplierId,
            customFileName: fileName
        });

        // Generate unique filename
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substr(2, 9);
        const fileExtension = path.extname(file.originalname);
        const uniqueFileName = fileName || `${timestamp}_${randomId}${fileExtension}`;
        
        // Create supplier directory path
        const supplierDir = path.join(SMB_CONFIG.mountPoint, 'supplier-media', supplierId || 'default');
        const filePath = path.join(supplierDir, uniqueFileName);
        
        // Ensure supplier directory exists
        await fs.ensureDir(supplierDir);
        
        // Optimize image if it's an image
        let fileBuffer = file.buffer;
        if (file.mimetype.startsWith('image/')) {
            try {
                fileBuffer = await sharp(file.buffer)
                    .resize(1920, 1920, { 
                        fit: 'inside',
                        withoutEnlargement: true 
                    })
                    .jpeg({ quality: 85 })
                    .toBuffer();
                console.log('🖼️ Image optimized');
            } catch (optimizeError) {
                console.warn('⚠️ Image optimization failed, using original:', optimizeError.message);
                fileBuffer = file.buffer;
            }
        }
        
        // Write file to SMB storage
        await fs.writeFile(filePath, fileBuffer);
        
        // Generate public URL - Use actual server IP for cross-device access
        const serverIP = getServerIP();
        const publicUrl = `http://${serverIP}:${SMB_CONFIG.serverPort}/files/supplier-media/${supplierId || 'default'}/${uniqueFileName}`;
        
        console.log('✅ File uploaded successfully:', filePath);
        
        res.json({
            success: true,
            url: publicUrl,
            path: `supplier-media/${supplierId || 'default'}/${uniqueFileName}`,
            filename: uniqueFileName,
            size: fileBuffer.length,
            originalName: file.originalname
        });
        
    } catch (error) {
        console.error('❌ Upload error:', error);
        res.status(500).json({
            error: 'Upload failed',
            message: error.message
        });
    }
});

// Serve files endpoint
app.get('/files/*', async (req, res) => {
    try {
        const filePath = path.join(SMB_CONFIG.mountPoint, req.params[0]);
        
        // Check if file exists
        const exists = await fs.pathExists(filePath);
        if (!exists) {
            return res.status(404).json({ error: 'File not found' });
        }
        
        // Get file stats
        const stats = await fs.stat(filePath);
        const fileExtension = path.extname(filePath).toLowerCase();
        
        // Set appropriate content type
        let contentType = 'application/octet-stream';
        if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(fileExtension)) {
            contentType = `image/${fileExtension.slice(1)}`;
        } else if (['.mp4', '.webm', '.ogg'].includes(fileExtension)) {
            contentType = `video/${fileExtension.slice(1)}`;
        }
        
        // Set headers
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', stats.size);
        res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 year cache
        
        // Stream file
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
        
    } catch (error) {
        console.error('❌ File serve error:', error);
        res.status(500).json({
            error: 'Failed to serve file',
            message: error.message
        });
    }
});

// Delete file endpoint
app.delete('/files/*', async (req, res) => {
    try {
        const filePath = path.join(SMB_CONFIG.mountPoint, req.params[0]);
        
        // Check if file exists
        const exists = await fs.pathExists(filePath);
        if (!exists) {
            return res.status(404).json({ error: 'File not found' });
        }
        
        // Delete file
        await fs.remove(filePath);
        
        console.log('🗑️ File deleted:', filePath);
        
        res.json({
            success: true,
            message: 'File deleted successfully'
        });
        
    } catch (error) {
        console.error('❌ Delete error:', error);
        res.status(500).json({
            error: 'Failed to delete file',
            message: error.message
        });
    }
});

// List files endpoint
app.get('/list/:supplierId?', async (req, res) => {
    try {
        const supplierId = req.params.supplierId || 'default';
        const supplierDir = path.join(SMB_CONFIG.mountPoint, 'supplier-media', supplierId);
        
        const exists = await fs.pathExists(supplierDir);
        if (!exists) {
            return res.json({ files: [] });
        }
        
        const files = await fs.readdir(supplierDir);
        const fileList = [];
        
        for (const file of files) {
            const filePath = path.join(supplierDir, file);
            const stats = await fs.stat(filePath);
            
            if (stats.isFile()) {
                fileList.push({
                    name: file,
                    size: stats.size,
                    modified: stats.mtime,
                    url: `http://${getServerIP()}:${SMB_CONFIG.serverPort}/files/supplier-media/${supplierId}/${file}`
                });
            }
        }
        
        res.json({ files: fileList });
        
    } catch (error) {
        console.error('❌ List files error:', error);
        res.status(500).json({
            error: 'Failed to list files',
            message: error.message
        });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                error: 'File too large',
                message: 'File size must be less than 50MB'
            });
        }
    }
    
    console.error('❌ Server error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: error.message
    });
});

// Get server IP for cross-device access
function getServerIP() {
    const os = require('os');
    const interfaces = os.networkInterfaces();

    // Try to find the main network interface
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip internal and non-IPv4 addresses
            if (!iface.internal && iface.family === 'IPv4') {
                return iface.address;
            }
        }
    }

    return 'localhost'; // Fallback
}

// Start server
async function startServer() {
    // Check SMB mount
    const smbReady = await ensureSMBMount();
    if (!smbReady) {
        console.warn('⚠️ SMB mount not ready, but server will start anyway');
    }

    const serverIP = getServerIP();

    app.listen(SMB_CONFIG.serverPort, SMB_CONFIG.serverHost, () => {
        console.log(`🚀 SMB File Server running on ${SMB_CONFIG.serverHost}:${SMB_CONFIG.serverPort}`);
        console.log(`📁 SMB Storage: ${SMB_CONFIG.host}/${SMB_CONFIG.share}`);
        console.log(`📂 Mount Point: ${SMB_CONFIG.mountPoint}`);
        console.log(`🌐 Server IP: ${serverIP}`);
        console.log(`🔗 Access URLs:`);
        console.log(`   Local: http://localhost:${SMB_CONFIG.serverPort}/ping`);
        console.log(`   Network: http://${serverIP}:${SMB_CONFIG.serverPort}/ping`);
        console.log(`📤 Upload: POST http://${serverIP}:${SMB_CONFIG.serverPort}/upload`);
        console.log(`📥 Files: GET http://${serverIP}:${SMB_CONFIG.serverPort}/files/*`);
        console.log(`📱 Cross-device access enabled!`);
    });
}

startServer().catch(console.error);
