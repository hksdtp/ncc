// Cloud-Only Storage v4.0.0 - Debug Script
// This script will test the live web app functionality

const { chromium } = require('playwright');

async function debugCloudOnlyStorage() {
    console.log('🔍 Starting Cloud-Only Storage v4.0.0 Debug...');
    
    const browser = await chromium.launch({ 
        headless: false, 
        slowMo: 1000 // Slow down for debugging
    });
    
    const context = await browser.newContext({
        permissions: ['clipboard-read', 'clipboard-write']
    });
    
    const page = await context.newPage();
    
    // Monitor console messages
    page.on('console', msg => {
        const type = msg.type();
        if (type === 'error' || type === 'warn' || msg.text().includes('405') || msg.text().includes('Supabase')) {
            console.log(`🔍 Console [${type.toUpperCase()}]:`, msg.text());
        }
    });
    
    // Monitor network requests
    page.on('request', request => {
        const url = request.url();
        if (url.includes('supabase') || url.includes('storage')) {
            console.log(`📡 Request: ${request.method()} ${url}`);
        }
    });
    
    page.on('response', response => {
        const url = response.url();
        if (url.includes('supabase') || url.includes('storage')) {
            console.log(`📡 Response: ${response.status()} ${url}`);
            if (response.status() >= 400) {
                console.log(`❌ Error Response: ${response.status()} ${response.statusText()}`);
            }
        }
    });
    
    try {
        console.log('🌐 Navigating to live app...');
        await page.goto('https://ncc-opal.vercel.app/', { 
            waitUntil: 'networkidle',
            timeout: 30000 
        });
        
        console.log('⏳ Waiting for app to load...');
        await page.waitForTimeout(3000);
        
        // Check if Supabase is connected
        console.log('🔍 Checking Supabase connection...');
        const supabaseStatus = await page.evaluate(() => {
            return {
                supabaseExists: typeof window.supabase !== 'undefined',
                isConnected: window.isSupabaseConnected || false,
                supabaseUrl: window.SUPABASE_URL || 'Not found',
                hasSupabaseClient: typeof window.supabase?.createClient !== 'undefined'
            };
        });
        console.log('📊 Supabase Status:', supabaseStatus);
        
        // Check if deleteMediaItem function exists
        console.log('🔍 Checking deleteMediaItem function...');
        const functionStatus = await page.evaluate(() => {
            return {
                deleteMediaItemExists: typeof window.deleteMediaItem === 'function',
                uploadFunctionExists: typeof window.uploadFileToSupabaseStorage === 'function'
            };
        });
        console.log('📊 Function Status:', functionStatus);
        
        // Try to find and click a supplier
        console.log('🔍 Looking for suppliers...');
        await page.waitForSelector('.supplier-card', { timeout: 10000 });
        
        const suppliers = await page.$$('.supplier-card');
        console.log(`📊 Found ${suppliers.length} suppliers`);
        
        if (suppliers.length > 0) {
            console.log('👆 Clicking first supplier...');
            await suppliers[0].click();
            await page.waitForTimeout(2000);
            
            // Check if media grid is visible
            const mediaGridVisible = await page.isVisible('#mediaGrid');
            console.log('📊 Media grid visible:', mediaGridVisible);
            
            // Try to find file input for upload testing
            console.log('🔍 Looking for file upload...');
            const fileInput = await page.$('input[type="file"]');
            
            if (fileInput) {
                console.log('📁 File input found - ready for upload testing');
                
                // Create a test image file for upload
                const testImagePath = '/tmp/test_upload.png';
                await page.evaluate(() => {
                    // Create a simple canvas image for testing
                    const canvas = document.createElement('canvas');
                    canvas.width = 100;
                    canvas.height = 100;
                    const ctx = canvas.getContext('2d');
                    ctx.fillStyle = '#ff0000';
                    ctx.fillRect(0, 0, 100, 100);
                    ctx.fillStyle = '#ffffff';
                    ctx.font = '20px Arial';
                    ctx.fillText('Test', 30, 55);
                });
                
                console.log('📤 Attempting file upload...');
                // Note: We'll simulate upload without actual file for now
                // await fileInput.setInputFiles([testImagePath]);
                
            } else {
                console.log('❌ File input not found');
            }
            
            // Test delete functionality if there are existing images
            console.log('🔍 Looking for delete buttons...');
            const deleteButtons = await page.$$('button[title*="Xóa"], button[onclick*="deleteMediaItem"]');
            console.log(`📊 Found ${deleteButtons.length} delete buttons`);
            
            if (deleteButtons.length > 0) {
                console.log('🗑️ Testing delete functionality...');
                
                // Test if delete function is accessible
                const deleteTest = await page.evaluate(() => {
                    if (typeof window.deleteMediaItem === 'function') {
                        console.log('✅ deleteMediaItem function is accessible');
                        return { accessible: true, type: typeof window.deleteMediaItem };
                    } else {
                        console.log('❌ deleteMediaItem function not accessible');
                        return { accessible: false };
                    }
                });
                console.log('📊 Delete function test:', deleteTest);
            }
        }
        
        // Check for any JavaScript errors in console
        console.log('🔍 Checking for console errors...');
        const consoleErrors = await page.evaluate(() => {
            // Return any stored console errors if available
            return window.console.errors || [];
        });
        
        console.log('✅ Debug complete - keeping browser open for manual inspection...');
        console.log('👀 You can now manually test upload/delete functionality');
        console.log('📋 Check the browser console for any additional errors');
        
        // Keep browser open for manual testing
        await page.waitForTimeout(60000); // Wait 60 seconds
        
    } catch (error) {
        console.error('❌ Debug error:', error);
    } finally {
        await browser.close();
    }
}

// Run the debug
if (require.main === module) {
    debugCloudOnlyStorage().catch(console.error);
}

module.exports = { debugCloudOnlyStorage };