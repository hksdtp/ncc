const { chromium } = require('playwright');

async function testWebAppFix() {
    console.log('🚀 TESTING WEB APP FIX - localhost:8080...');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 1000
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Capture all console messages
    const consoleMessages = [];
    page.on('console', msg => {
        const message = `[${msg.type().toUpperCase()}] ${msg.text()}`;
        consoleMessages.push(message);
        console.log(message);
    });
    
    // Capture errors
    const errors = [];
    page.on('pageerror', error => {
        errors.push(error.message);
        console.log('🚨 Page Error:', error.message);
    });
    
    try {
        // Navigate to web app
        console.log('📱 Navigating to localhost:8080...');
        await page.goto('http://localhost:8080');
        await page.waitForLoadState('networkidle');
        
        console.log('✅ Page loaded successfully');
        
        // Wait for Supabase initialization
        await page.waitForTimeout(3000);
        
        // Check if notification elements exist
        const notificationExists = await page.locator('#notification').count() > 0;
        const notificationTextExists = await page.locator('#notificationText').count() > 0;
        
        console.log('\n🔍 DOM Elements Check:');
        console.log('- Notification element:', notificationExists ? '✅' : '❌');
        console.log('- NotificationText element:', notificationTextExists ? '✅' : '❌');
        
        // Test showNotification function
        console.log('\n🧪 Testing showNotification function...');
        try {
            await page.evaluate(() => {
                if (typeof showNotification === 'function') {
                    showNotification('Test notification from Playwright', 'success');
                    return true;
                } else {
                    throw new Error('showNotification function not found');
                }
            });
            console.log('✅ showNotification function works');
        } catch (error) {
            console.log('❌ showNotification function error:', error.message);
        }
        
        // Check Supabase connection
        console.log('\n🔗 Testing Supabase connection...');
        const supabaseConnected = await page.evaluate(() => {
            return window.isSupabaseConnected || false;
        });
        console.log('- Supabase connected:', supabaseConnected ? '✅' : '❌');
        
        // Test file upload area
        console.log('\n📁 Testing file upload area...');
        const uploadAreaExists = await page.locator('.upload-area').count() > 0;
        const fileInputExists = await page.locator('#mediaUpload').count() > 0;
        
        console.log('- Upload area exists:', uploadAreaExists ? '✅' : '❌');
        console.log('- File input exists:', fileInputExists ? '✅' : '❌');
        
        // Test supplier selection
        console.log('\n👥 Testing supplier functionality...');
        const supplierCards = await page.locator('.supplier-card').count();
        console.log('- Supplier cards found:', supplierCards);
        
        if (supplierCards > 0) {
            console.log('🎯 Clicking first supplier...');
            await page.locator('.supplier-card').first().click();
            await page.waitForTimeout(1000);
            
            // Check if supplier is selected
            const selectedSupplier = await page.evaluate(() => {
                return window.currentSupplierId || null;
            });
            console.log('- Selected supplier ID:', selectedSupplier || 'None');
        }
        
        // Screenshot current state
        await page.screenshot({ 
            path: 'test_screenshots/webapp_after_fix.png', 
            fullPage: true 
        });
        
        // Summary
        console.log('\n📊 TEST SUMMARY:');
        console.log('- Total console messages:', consoleMessages.length);
        console.log('- Page errors:', errors.length);
        console.log('- Notification elements:', notificationExists && notificationTextExists ? 'Fixed ✅' : 'Still broken ❌');
        console.log('- Supabase connection:', supabaseConnected ? 'Working ✅' : 'Not connected ❌');
        
        if (errors.length > 0) {
            console.log('\n❌ Page Errors:');
            errors.forEach(error => console.log('  ', error));
        }
        
        // Filter relevant console messages
        const relevantMessages = consoleMessages.filter(msg => 
            msg.includes('Supabase') || 
            msg.includes('notification') || 
            msg.includes('ERROR') ||
            msg.includes('null is not an object')
        );
        
        if (relevantMessages.length > 0) {
            console.log('\n📋 Relevant Console Messages:');
            relevantMessages.forEach(msg => console.log('  ', msg));
        }
        
        // Overall assessment
        const isFixed = notificationExists && notificationTextExists && errors.length === 0;
        console.log('\n🎯 OVERALL RESULT:');
        if (isFixed) {
            console.log('🎉 WEB APP FIXED SUCCESSFULLY!');
        } else {
            console.log('⚠️  Still has issues - need more fixes');
        }
        
    } catch (error) {
        console.error('❌ Test error:', error.message);
        await page.screenshot({ path: 'test_screenshots/webapp_test_error.png', fullPage: true });
    } finally {
        await browser.close();
        console.log('\n🎭 Test completed - Browser closed');
    }
}

testWebAppFix().catch(console.error);
