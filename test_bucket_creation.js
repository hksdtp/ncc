const { chromium } = require('playwright');

async function testBucketCreation() {
    console.log('🎭 Bắt đầu Playwright test cho bucket creation...');
    
    const browser = await chromium.launch({ 
        headless: false,  // Hiển thị browser để debug
        slowMo: 1000     // Chậm lại để dễ theo dõi
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();

    // Capture console errors từ đầu
    const consoleErrors = [];
    page.on('console', msg => {
        if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
            console.log('🚨 Console error:', msg.text());
        }
    });

    // Capture network requests
    const networkRequests = [];
    page.on('request', request => {
        if (request.url().includes('supabase')) {
            networkRequests.push({
                url: request.url(),
                method: request.method()
            });
        }
    });

    try {
        // Mở trang create bucket
        console.log('📂 Đang mở trang create bucket...');
        await page.goto('file://' + __dirname + '/create_bucket.html');
        
        // Chờ trang load
        await page.waitForLoadState('networkidle');
        
        // Chụp screenshot ban đầu
        await page.screenshot({ path: 'test_screenshots/initial_page.png', fullPage: true });
        console.log('📸 Đã chụp screenshot ban đầu');
        
        // Kiểm tra các button có tồn tại không
        const createButton = await page.locator('button:has-text("Create Bucket")');
        const listButton = await page.locator('button:has-text("List Existing Buckets")');
        const testButton = await page.locator('button:has-text("Test Upload")');
        
        console.log('🔍 Kiểm tra các button...');
        console.log('- Create Bucket button:', await createButton.count() > 0 ? '✅' : '❌');
        console.log('- List Buckets button:', await listButton.count() > 0 ? '✅' : '❌');
        console.log('- Test Upload button:', await testButton.count() > 0 ? '✅' : '❌');
        
        // Test 1: List existing buckets
        console.log('\n🧪 TEST 1: List Existing Buckets');
        await listButton.click();
        await page.waitForTimeout(3000);
        
        // Chụp screenshot sau khi list buckets
        await page.screenshot({ path: 'test_screenshots/after_list_buckets.png', fullPage: true });
        
        // Kiểm tra log output
        const logOutput = await page.locator('#log').textContent();
        console.log('📋 Log output:', logOutput);

        // Test 2: Create bucket
        console.log('\n🧪 TEST 2: Create Bucket');
        await createButton.click();
        await page.waitForTimeout(5000);

        // Chụp screenshot sau khi create bucket
        await page.screenshot({ path: 'test_screenshots/after_create_bucket.png', fullPage: true });

        // Kiểm tra log output sau create
        const logOutputAfterCreate = await page.locator('#log').textContent();
        console.log('📋 Log sau create:', logOutputAfterCreate);
        
        // Phân tích lỗi
        if (logOutputAfterCreate.includes('row-level security policy')) {
            console.log('❌ PHÁT HIỆN LỖI: Row-level security policy violation');
            console.log('🔧 Cần sửa RLS policies trong Supabase');
        }
        
        if (logOutputAfterCreate.includes('Failed to create')) {
            console.log('❌ PHÁT HIỆN LỖI: Bucket creation failed');
        }
        
        // Test 3: Test upload
        console.log('\n🧪 TEST 3: Test Upload');
        await testButton.click();
        await page.waitForTimeout(3000);
        
        // Chụp screenshot cuối
        await page.screenshot({ path: 'test_screenshots/after_test_upload.png', fullPage: true });
        
        console.log('\n📊 KẾT QUẢ TEST:');
        console.log('- Console errors:', consoleErrors.length);
        if (consoleErrors.length > 0) {
            consoleErrors.forEach(error => console.log('  ❌', error));
        }

        console.log('- Supabase requests:', networkRequests.length);
        networkRequests.forEach(req => {
            console.log(`  🌐 ${req.method} ${req.url}`);
        });
        
    } catch (error) {
        console.error('❌ Lỗi trong quá trình test:', error);
        await page.screenshot({ path: 'test_screenshots/error.png', fullPage: true });
    } finally {
        await browser.close();
        console.log('🎭 Đã đóng browser');
    }
}

// Tạo thư mục screenshots nếu chưa có
const fs = require('fs');
if (!fs.existsSync('test_screenshots')) {
    fs.mkdirSync('test_screenshots');
}

// Chạy test
testBucketCreation().catch(console.error);
