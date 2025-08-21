const { chromium } = require('playwright');

async function quickBucketTest() {
    console.log('🚀 QUICK TEST: Kiểm tra bucket creation sau khi fix RLS...');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 500
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Capture errors
    const errors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            errors.push(msg.text());
        }
    });
    
    try {
        await page.goto('file://' + __dirname + '/create_bucket.html');
        await page.waitForLoadState('networkidle');
        
        console.log('✅ Trang đã load');
        
        // Test 1: List buckets
        console.log('\n🧪 Test 1: List buckets...');
        await page.click('button:has-text("List Existing Buckets")');
        await page.waitForTimeout(3000);
        
        const logAfterList = await page.locator('#log').textContent();
        console.log('📋 Log:', logAfterList.split('\n').slice(-3).join('\n'));
        
        // Test 2: Create bucket
        console.log('\n🧪 Test 2: Create bucket...');
        await page.click('button:has-text("Create Bucket")');
        await page.waitForTimeout(5000);
        
        const logAfterCreate = await page.locator('#log').textContent();
        const lastLines = logAfterCreate.split('\n').slice(-10);
        console.log('📋 Log cuối:', lastLines.join('\n'));
        
        // Phân tích kết quả
        if (logAfterCreate.includes('row-level security policy')) {
            console.log('❌ VẪN CÒN LỖI RLS POLICY');
            console.log('🔧 Cần chạy lại script SQL hoặc kiểm tra permissions');
        } else if (logAfterCreate.includes('Successfully created') || logAfterCreate.includes('already exists')) {
            console.log('✅ BUCKET CREATION THÀNH CÔNG!');
        } else if (logAfterCreate.includes('Failed to create')) {
            console.log('⚠️  Có lỗi khác, không phải RLS policy');
        }
        
        // Test 3: Test upload
        console.log('\n🧪 Test 3: Test upload...');
        await page.click('button:has-text("Test Upload")');
        await page.waitForTimeout(3000);
        
        const finalLog = await page.locator('#log').textContent();
        const uploadResult = finalLog.split('\n').slice(-5);
        console.log('📋 Upload result:', uploadResult.join('\n'));
        
        console.log('\n📊 TỔNG KẾT:');
        console.log('- Console errors:', errors.length);
        if (errors.length > 0) {
            console.log('  Errors:', errors.slice(0, 3)); // Chỉ hiển thị 3 lỗi đầu
        }
        
        // Screenshot cuối
        await page.screenshot({ path: 'test_screenshots/after_fix.png', fullPage: true });
        console.log('📸 Screenshot saved: test_screenshots/after_fix.png');
        
    } catch (error) {
        console.error('❌ Lỗi test:', error.message);
    } finally {
        await browser.close();
    }
}

quickBucketTest().catch(console.error);
