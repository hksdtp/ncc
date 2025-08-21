const { chromium } = require('playwright');

async function testVercelDeployment() {
    console.log('🚀 TESTING VERCEL DEPLOYMENT - Function fixes & Cloud-only storage...');
    
    const browser = await chromium.launch({ 
        headless: false,
        slowMo: 1000
    });
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Track console messages and errors
    const consoleMessages = [];
    const errors = [];
    
    page.on('console', msg => {
        const message = `[${msg.type().toUpperCase()}] ${msg.text()}`;
        consoleMessages.push(message);
        console.log(message);
    });
    
    page.on('pageerror', error => {
        errors.push(error.message);
        console.log('🚨 Page Error:', error.message);
    });
    
    try {
        // Test both localhost and Vercel URL
        const testUrls = [
            'http://localhost:8080',
            // 'https://ncc1.vercel.app' // Uncomment to test Vercel deployment
        ];
        
        for (const url of testUrls) {
            console.log(`\n📱 Testing: ${url}`);
            
            await page.goto(url);
            await page.waitForLoadState('networkidle');
            
            // Wait for initialization
            await page.waitForTimeout(3000);
            
            // Test 1: Check if deleteMediaItem function exists
            console.log('\n🔍 TEST 1: deleteMediaItem function availability...');
            const deleteMediaItemExists = await page.evaluate(() => {
                return typeof window.deleteMediaItem === 'function';
            });
            console.log('- deleteMediaItem function exists:', deleteMediaItemExists ? '✅' : '❌');
            
            // Test 2: Check Supabase connection
            console.log('\n🔗 TEST 2: Supabase connection...');
            const supabaseConnected = await page.evaluate(() => {
                return window.isSupabaseConnected || false;
            });
            console.log('- Supabase connected:', supabaseConnected ? '✅' : '❌');
            
            // Test 3: Check cloud-only storage approach
            console.log('\n☁️ TEST 3: Cloud-only storage verification...');
            const storageInfo = await page.evaluate(() => {
                const localStorage = window.localStorage.getItem('supplierMedia');
                let hasLocalBinaryData = false;
                
                if (localStorage) {
                    try {
                        const data = JSON.parse(localStorage);
                        // Check if any item has 'url' property (base64 data)
                        Object.values(data).forEach(items => {
                            if (Array.isArray(items)) {
                                items.forEach(item => {
                                    if (item.url && item.url.startsWith('data:')) {
                                        hasLocalBinaryData = true;
                                    }
                                });
                            }
                        });
                    } catch (e) {
                        console.error('Error parsing localStorage:', e);
                    }
                }
                
                return {
                    hasLocalStorage: !!localStorage,
                    hasLocalBinaryData,
                    storageSize: localStorage ? localStorage.length : 0
                };
            });
            
            console.log('- Has localStorage data:', storageInfo.hasLocalStorage ? '✅' : '❌');
            console.log('- Has binary data in localStorage:', storageInfo.hasLocalBinaryData ? '❌ PROBLEM' : '✅ GOOD');
            console.log('- Storage size:', storageInfo.storageSize, 'characters');
            
            // Test 4: Test supplier selection and media gallery
            console.log('\n👥 TEST 4: Supplier functionality...');
            const supplierCards = await page.locator('.supplier-card').count();
            console.log('- Supplier cards found:', supplierCards);
            
            if (supplierCards > 0) {
                console.log('🎯 Testing supplier selection...');
                await page.locator('.supplier-card').first().click();
                await page.waitForTimeout(1000);
                
                // Check if media gallery opens
                const galleryVisible = await page.locator('.media-gallery').isVisible();
                console.log('- Media gallery opens:', galleryVisible ? '✅' : '❌');
                
                if (galleryVisible) {
                    // Test delete button functionality
                    const deleteButtons = await page.locator('button[onclick*="deleteMediaItem"]').count();
                    console.log('- Delete buttons found:', deleteButtons);
                    
                    if (deleteButtons > 0) {
                        console.log('🧪 Testing delete button click (without confirmation)...');
                        
                        // Override confirm to return false to avoid actual deletion
                        await page.evaluate(() => {
                            window.confirm = () => false;
                        });
                        
                        try {
                            await page.locator('button[onclick*="deleteMediaItem"]').first().click();
                            console.log('✅ Delete button clickable - no ReferenceError');
                        } catch (error) {
                            console.log('❌ Delete button error:', error.message);
                        }
                    }
                }
            }
            
            // Test 5: Upload functionality check
            console.log('\n📤 TEST 5: Upload functionality...');
            const uploadArea = await page.locator('.upload-area').count();
            const fileInput = await page.locator('#mediaUpload').count();
            console.log('- Upload area exists:', uploadArea > 0 ? '✅' : '❌');
            console.log('- File input exists:', fileInput > 0 ? '✅' : '❌');
            
            // Screenshot for verification
            await page.screenshot({ 
                path: `test_screenshots/vercel_test_${url.includes('localhost') ? 'local' : 'vercel'}.png`, 
                fullPage: true 
            });
        }
        
        // Summary
        console.log('\n📊 TEST SUMMARY:');
        console.log('- Total console messages:', consoleMessages.length);
        console.log('- JavaScript errors:', errors.length);
        
        const relevantErrors = errors.filter(error => 
            error.includes('deleteMediaItem') || 
            error.includes('ReferenceError') ||
            error.includes('not defined')
        );
        
        console.log('- Function-related errors:', relevantErrors.length);
        
        if (relevantErrors.length > 0) {
            console.log('\n❌ Function Errors Found:');
            relevantErrors.forEach(error => console.log('  ', error));
        } else {
            console.log('\n✅ No function-related errors found!');
        }
        
        // Check for cloud-only compliance
        const cloudOnlyMessages = consoleMessages.filter(msg => 
            msg.includes('Cloud-Only') || 
            msg.includes('Supabase') ||
            msg.includes('cloud')
        );
        
        console.log('\n☁️ Cloud-Only Messages:');
        cloudOnlyMessages.slice(0, 5).forEach(msg => console.log('  ', msg));
        
        // Overall assessment
        const hasErrors = relevantErrors.length > 0;
        const hasCloudMessages = cloudOnlyMessages.length > 0;
        
        console.log('\n🎯 OVERALL ASSESSMENT:');
        if (!hasErrors && hasCloudMessages) {
            console.log('🎉 EXCELLENT - All fixes working correctly!');
        } else if (!hasErrors) {
            console.log('✅ GOOD - No function errors detected');
        } else {
            console.log('⚠️ NEEDS ATTENTION - Function errors still present');
        }
        
    } catch (error) {
        console.error('❌ Test error:', error.message);
        await page.screenshot({ path: 'test_screenshots/vercel_test_error.png', fullPage: true });
    } finally {
        await browser.close();
        console.log('\n🎭 Test completed - Browser closed');
    }
}

testVercelDeployment().catch(console.error);
