#!/bin/bash

# SMB Storage Setup Script for Linux/macOS
# Cấu hình kết nối SMB storage cho file server

echo "🔧 Setting up SMB Storage Connection..."

# Configuration
SMB_HOST="222.252.23.248"
SMB_SHARE="script"
MOUNT_POINT="/mnt/smb-storage"

# Prompt for credentials
echo "📝 Enter SMB credentials:"
read -p "Username: " SMB_USERNAME
read -s -p "Password: " SMB_PASSWORD
echo

# Create mount point
echo "📁 Creating mount point: $MOUNT_POINT"
sudo mkdir -p "$MOUNT_POINT"

# Install required packages
echo "📦 Installing required packages..."

# For Ubuntu/Debian
if command -v apt-get &> /dev/null; then
    sudo apt-get update
    sudo apt-get install -y cifs-utils
fi

# For CentOS/RHEL
if command -v yum &> /dev/null; then
    sudo yum install -y cifs-utils
fi

# For macOS (requires Homebrew)
if [[ "$OSTYPE" == "darwin"* ]]; then
    if command -v brew &> /dev/null; then
        echo "ℹ️ macOS detected. SMB mounting is built-in."
    else
        echo "⚠️ Please install Homebrew first: https://brew.sh"
    fi
fi

# Create credentials file
CREDS_FILE="/tmp/smb-credentials"
echo "username=$SMB_USERNAME" > "$CREDS_FILE"
echo "password=$SMB_PASSWORD" >> "$CREDS_FILE"
chmod 600 "$CREDS_FILE"

# Mount SMB share
echo "🔗 Mounting SMB share..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS mount command
    sudo mount -t smbfs "//$SMB_USERNAME:$SMB_PASSWORD@$SMB_HOST/$SMB_SHARE" "$MOUNT_POINT"
else
    # Linux mount command
    sudo mount -t cifs "//$SMB_HOST/$SMB_SHARE" "$MOUNT_POINT" -o credentials="$CREDS_FILE",uid=$(id -u),gid=$(id -g),iocharset=utf8
fi

# Check if mount was successful
if mountpoint -q "$MOUNT_POINT"; then
    echo "✅ SMB share mounted successfully at $MOUNT_POINT"
    
    # Test write access
    TEST_FILE="$MOUNT_POINT/test-write-$(date +%s).txt"
    if echo "Test write access" > "$TEST_FILE" 2>/dev/null; then
        echo "✅ Write access confirmed"
        rm -f "$TEST_FILE"
    else
        echo "⚠️ Write access failed - check permissions"
    fi
    
    # Show mount info
    echo "📊 Mount information:"
    df -h "$MOUNT_POINT"
    
else
    echo "❌ Failed to mount SMB share"
    echo "🔍 Troubleshooting tips:"
    echo "  1. Check network connectivity: ping $SMB_HOST"
    echo "  2. Verify credentials"
    echo "  3. Check firewall settings"
    echo "  4. Ensure SMB service is running on $SMB_HOST"
fi

# Clean up credentials file
rm -f "$CREDS_FILE"

# Create environment file for Node.js
ENV_FILE="$(dirname "$0")/.env"
echo "📝 Creating environment file: $ENV_FILE"
cat > "$ENV_FILE" << EOF
# SMB Storage Configuration
SMB_USERNAME=$SMB_USERNAME
SMB_PASSWORD=$SMB_PASSWORD
SMB_MOUNT=$MOUNT_POINT
PORT=8080
EOF

echo "🎉 Setup complete!"
echo "📋 Next steps:"
echo "  1. cd file-server"
echo "  2. npm install"
echo "  3. npm start"
echo "  4. Test: curl http://localhost:8080/ping"
