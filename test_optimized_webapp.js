const { chromium } = require('playwright');

async function testOptimizedWebApp() {
    console.log('🚀 TESTING OPTIMIZED WEB APP - Faster startup & Hidden settings...');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 500
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Track timing
    const startTime = Date.now();
    
    // Capture console messages
    const consoleMessages = [];
    page.on('console', msg => {
        const timestamp = Date.now() - startTime;
        const message = `[${timestamp}ms] ${msg.type().toUpperCase()}: ${msg.text()}`;
        consoleMessages.push(message);
        console.log(message);
    });
    
    try {
        console.log('📱 Navigating to localhost:8080...');
        await page.goto('http://localhost:8080');
        await page.waitForLoadState('networkidle');
        
        const loadTime = Date.now() - startTime;
        console.log(`✅ Page loaded in ${loadTime}ms`);
        
        // Check if settings button is hidden
        console.log('\n🔍 Checking Settings Button...');
        const settingsBtn = await page.locator('#settingsBtn');
        const settingsBtnVisible = await settingsBtn.isVisible();
        console.log('- Settings button visible:', settingsBtnVisible ? '❌ Still visible' : '✅ Hidden');
        
        // Check if settings panel is hidden
        const settingsPanel = await page.locator('#settingsPanel');
        const settingsPanelVisible = await settingsPanel.isVisible();
        console.log('- Settings panel visible:', settingsPanelVisible ? '❌ Still visible' : '✅ Hidden');
        
        // Wait for Supabase connection
        console.log('\n⏱️ Waiting for Supabase connection...');
        let supabaseConnected = false;
        let connectionTime = 0;
        
        for (let i = 0; i < 20; i++) { // Wait up to 10 seconds
            await page.waitForTimeout(500);
            connectionTime = Date.now() - startTime;
            
            supabaseConnected = await page.evaluate(() => {
                return window.isSupabaseConnected || false;
            });
            
            if (supabaseConnected) {
                console.log(`✅ Supabase connected in ${connectionTime}ms`);
                break;
            }
        }
        
        if (!supabaseConnected) {
            console.log(`⚠️ Supabase not connected after ${connectionTime}ms`);
        }
        
        // Check for error notifications
        console.log('\n🔔 Checking for error notifications...');
        const notification = await page.locator('#notification');
        const notificationVisible = await notification.isVisible();
        
        if (notificationVisible) {
            const notificationText = await page.locator('#notificationText').textContent();
            console.log('- Notification shown:', notificationText);
            
            if (notificationText.includes('Cloud connection required')) {
                console.log('❌ Still showing connection error notification');
            } else {
                console.log('✅ No connection error notification');
            }
        } else {
            console.log('✅ No notifications shown during startup');
        }
        
        // Test supplier functionality
        console.log('\n👥 Testing supplier functionality...');
        const supplierCards = await page.locator('.supplier-card').count();
        console.log('- Supplier cards found:', supplierCards);
        
        // Screenshot final state
        await page.screenshot({ 
            path: 'test_screenshots/optimized_webapp.png', 
            fullPage: true 
        });
        
        // Analyze console messages for optimization
        console.log('\n📊 STARTUP ANALYSIS:');
        
        const errorMessages = consoleMessages.filter(msg => 
            msg.includes('ERROR') || 
            msg.includes('Cloud connection required') ||
            msg.includes('❌')
        );
        
        const successMessages = consoleMessages.filter(msg => 
            msg.includes('Supabase connection successful') ||
            msg.includes('✅')
        );
        
        console.log('- Total console messages:', consoleMessages.length);
        console.log('- Error messages:', errorMessages.length);
        console.log('- Success messages:', successMessages.length);
        console.log('- Page load time:', loadTime + 'ms');
        console.log('- Supabase connection time:', connectionTime + 'ms');
        
        // Performance score
        let score = 0;
        if (!settingsBtnVisible) score += 25; // Settings hidden
        if (supabaseConnected) score += 30; // Supabase connected
        if (connectionTime < 2000) score += 20; // Fast connection
        if (errorMessages.length === 0) score += 15; // No errors
        if (loadTime < 3000) score += 10; // Fast load
        
        console.log('\n🎯 OPTIMIZATION SCORE:', score + '/100');
        
        if (score >= 90) {
            console.log('🎉 EXCELLENT - Fully optimized!');
        } else if (score >= 70) {
            console.log('✅ GOOD - Well optimized');
        } else if (score >= 50) {
            console.log('⚠️ FAIR - Some improvements made');
        } else {
            console.log('❌ POOR - Needs more optimization');
        }
        
        if (errorMessages.length > 0) {
            console.log('\n❌ Error Messages Found:');
            errorMessages.slice(0, 3).forEach(msg => console.log('  ', msg));
        }
        
    } catch (error) {
        console.error('❌ Test error:', error.message);
        await page.screenshot({ path: 'test_screenshots/optimization_test_error.png', fullPage: true });
    } finally {
        await browser.close();
        console.log('\n🎭 Test completed - Browser closed');
    }
}

testOptimizedWebApp().catch(console.error);
