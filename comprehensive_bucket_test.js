const { chromium } = require('playwright');

async function comprehensiveBucketTest() {
    console.log('🚀 COMPREHENSIVE BUCKET TEST - Kiểm tra toàn diện sau optimization...');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 800
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Capture all events
    const errors = [];
    const warnings = [];
    const networkRequests = [];
    
    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push(msg.text());
        } else if (msg.type() === 'warn') {
            warnings.push(msg.text());
        }
    });
    
    page.on('request', request => {
        if (request.url().includes('supabase')) {
            networkRequests.push({
                method: request.method(),
                url: request.url(),
                timestamp: new Date().toLocaleTimeString()
            });
        }
    });
    
    try {
        await page.goto('file://' + __dirname + '/create_bucket.html');
        await page.waitForLoadState('networkidle');
        
        console.log('✅ Trang đã load thành công');
        
        // Test 1: List buckets (kiểm tra buckets có tồn tại)
        console.log('\n🧪 TEST 1: List existing buckets...');
        await page.click('button:has-text("List Existing Buckets")');
        await page.waitForTimeout(3000);
        
        const logAfterList = await page.locator('#log').textContent();
        const bucketLines = logAfterList.split('\n').filter(line => 
            line.includes('public: true') || line.includes('Found') || line.includes('buckets')
        );
        
        console.log('📋 Buckets found:');
        bucketLines.forEach(line => console.log('  ', line.trim()));
        
        // Test 2: Create bucket (should show "already exists")
        console.log('\n🧪 TEST 2: Attempt bucket creation...');
        await page.click('button:has-text("Create Bucket")');
        await page.waitForTimeout(5000);
        
        const logAfterCreate = await page.locator('#log').textContent();
        const createResults = logAfterCreate.split('\n').slice(-10).filter(line => 
            line.includes('Failed to create') || line.includes('Successfully') || line.includes('already exists')
        );
        
        console.log('📋 Creation results:');
        createResults.forEach(line => console.log('  ', line.trim()));
        
        // Phân tích kết quả creation
        const hasRLSError = logAfterCreate.includes('row-level security policy');
        const hasExistsError = logAfterCreate.includes('already exists');
        const hasSuccess = logAfterCreate.includes('Successfully created');
        
        if (hasRLSError) {
            console.log('❌ VẪN CÒN LỖI RLS POLICY - cần chạy lại SQL script');
        } else if (hasExistsError || hasSuccess) {
            console.log('✅ BUCKET CREATION HOẠT ĐỘNG BÌNH THƯỜNG');
        }
        
        // Test 3: Upload test (kiểm tra mime type support)
        console.log('\n🧪 TEST 3: Upload functionality test...');
        await page.click('button:has-text("Test Upload")');
        await page.waitForTimeout(4000);
        
        const finalLog = await page.locator('#log').textContent();
        const uploadLines = finalLog.split('\n').slice(-8).filter(line => 
            line.includes('Upload') || line.includes('mime') || line.includes('Testing')
        );
        
        console.log('📋 Upload test results:');
        uploadLines.forEach(line => console.log('  ', line.trim()));
        
        // Phân tích upload results
        const hasMimeError = finalLog.includes('mime type') && finalLog.includes('not supported');
        const hasUploadSuccess = finalLog.includes('Upload successful') || finalLog.includes('uploaded successfully');
        
        if (hasMimeError) {
            console.log('⚠️  MIME TYPE VẪN CÒN VẤN ĐỀ - cần chạy optimize script');
        } else if (hasUploadSuccess) {
            console.log('✅ UPLOAD HOẠT ĐỘNG HOÀN HẢO');
        } else {
            console.log('ℹ️  Upload test không có lỗi mime type');
        }
        
        // Test 4: Performance analysis
        console.log('\n📊 PERFORMANCE ANALYSIS:');
        console.log('- Total network requests:', networkRequests.length);
        console.log('- Console errors:', errors.length);
        console.log('- Console warnings:', warnings.length);
        
        if (networkRequests.length > 0) {
            console.log('\n🌐 Network requests timeline:');
            networkRequests.forEach(req => {
                console.log(`  [${req.timestamp}] ${req.method} ${req.url.split('/').pop()}`);
            });
        }
        
        if (errors.length > 0) {
            console.log('\n❌ Console errors:');
            errors.slice(0, 3).forEach(error => console.log('  ', error));
            if (errors.length > 3) console.log(`  ... và ${errors.length - 3} lỗi khác`);
        }
        
        // Test 5: Status check
        const statusElement = await page.locator('#status');
        const statusText = await statusElement.textContent();
        const statusClass = await statusElement.getAttribute('class');
        
        console.log('\n📋 Final status:');
        console.log('  Text:', statusText);
        console.log('  Class:', statusClass);
        
        // Screenshot final state
        await page.screenshot({ 
            path: 'test_screenshots/comprehensive_test_result.png', 
            fullPage: true 
        });
        
        // Overall assessment
        console.log('\n🎯 TỔNG KẾT ĐÁNH GIÁ:');
        
        let score = 0;
        if (!hasRLSError) score += 30; // RLS fixed
        if (hasExistsError || hasSuccess) score += 25; // Bucket creation works
        if (!hasMimeError) score += 25; // Mime type fixed
        if (errors.length < 3) score += 10; // Low error count
        if (networkRequests.length > 0 && networkRequests.length < 15) score += 10; // Reasonable network usage
        
        console.log(`📊 Điểm số: ${score}/100`);
        
        if (score >= 90) {
            console.log('🎉 XUẤT SẮC - Hệ thống hoạt động hoàn hảo!');
        } else if (score >= 70) {
            console.log('✅ TỐT - Hệ thống hoạt động ổn định');
        } else if (score >= 50) {
            console.log('⚠️  TRUNG BÌNH - Cần một số cải thiện');
        } else {
            console.log('❌ CẦN SỬA - Nhiều vấn đề cần giải quyết');
        }
        
    } catch (error) {
        console.error('❌ Lỗi trong quá trình test:', error.message);
        await page.screenshot({ path: 'test_screenshots/test_error.png', fullPage: true });
    } finally {
        await browser.close();
        console.log('\n🎭 Test hoàn thành - Browser đã đóng');
    }
}

// Tạo thư mục screenshots nếu chưa có
const fs = require('fs');
if (!fs.existsSync('test_screenshots')) {
    fs.mkdirSync('test_screenshots');
}

comprehensiveBucketTest().catch(console.error);
