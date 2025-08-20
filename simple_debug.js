// Simple Cloud-Only Storage Debug Script
const puppeteer = require('puppeteer');

async function simpleDebug() {
    console.log('🔍 Simple Debug - Testing Live Deployment...');
    
    const browser = await puppeteer.launch({ 
        headless: false, 
        slowMo: 500,
        defaultViewport: { width: 1200, height: 800 }
    });
    
    const page = await browser.newPage();
    
    // Monitor console and network
    page.on('console', msg => {
        if (msg.type() === 'error' || msg.text().includes('405') || msg.text().includes('deleteMediaItem') || msg.text().includes('v4.0.0')) {
            console.log(`🔍 Console: [${msg.type()}] ${msg.text()}`);
        }
    });
    
    page.on('response', response => {
        if (response.url().includes('supabase') && response.status() >= 400) {
            console.log(`❌ HTTP Error: ${response.status()} ${response.url()}`);
        }
    });
    
    try {
        console.log('🌐 Loading https://ncc-opal.vercel.app/ ...');
        await page.goto('https://ncc-opal.vercel.app/', { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        
        console.log('⏳ Waiting for page load...');
        await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(() => {});
        
        // Check critical functions
        const functionCheck = await page.evaluate(() => {
            return {
                deleteMediaItemExists: typeof window.deleteMediaItem === 'function',
                uploadFunctionExists: typeof window.uploadFileToSupabaseStorage === 'function',
                supabaseExists: typeof window.supabase !== 'undefined',
                hasV4Markers: document.body.innerHTML.includes('Cloud-Only v4.0.0') || 
                              document.body.innerHTML.includes('v4.0.0'),
                consoleErrors: [],
                currentScript: document.querySelector('script') ? 'Scripts found' : 'No scripts'
            };
        });
        
        console.log('\\n📊 CRITICAL FUNCTION CHECK:');
        console.log('- deleteMediaItem exists:', functionCheck.deleteMediaItemExists);
        console.log('- uploadFileToSupabaseStorage exists:', functionCheck.uploadFunctionExists);
        console.log('- Supabase client exists:', functionCheck.supabaseExists);
        console.log('- Has v4.0.0 markers:', functionCheck.hasV4Markers);
        
        // Test supplier interaction
        const suppliers = await page.$$('.supplier-card');
        console.log(`\\n🏢 Found ${suppliers.length} suppliers`);
        
        if (suppliers.length > 0) {
            console.log('👆 Clicking first supplier...');
            await suppliers[0].click();
            await page.waitForTimeout(2000);
            
            // Check for delete buttons after selecting supplier
            const deleteButtons = await page.$$('button[onclick*="deleteMediaItem"]');
            console.log(`🗑️ Found ${deleteButtons.length} delete buttons`);
            
            if (deleteButtons.length > 0) {
                console.log('🧪 Testing delete button click (will be cancelled)...');
                
                // Override confirm to cancel delete
                await page.evaluate(() => {
                    window.originalConfirm = window.confirm;
                    window.confirm = () => {
                        console.log('🧪 Delete cancelled for testing');
                        return false;
                    };
                });
                
                try {
                    await deleteButtons[0].click();
                    console.log('✅ Delete button clicked successfully');
                } catch (e) {
                    console.log('❌ Delete button click failed:', e.message);
                }
                
                // Restore confirm
                await page.evaluate(() => {
                    if (window.originalConfirm) {
                        window.confirm = window.originalConfirm;
                    }
                });
            }
            
            // Check for file upload
            const fileInputs = await page.$$('input[type="file"]');
            console.log(`📁 Found ${fileInputs.length} file inputs`);
        }
        
        // Final assessment
        console.log('\\n🎯 ASSESSMENT SUMMARY:');
        
        if (!functionCheck.hasV4Markers) {
            console.log('❌ DEPLOYMENT ISSUE: Missing Cloud-Only v4.0.0 code markers');
            console.log('   → The deployed version may not include the latest fixes');
        } else {
            console.log('✅ Deployment appears to include v4.0.0 updates');
        }
        
        if (!functionCheck.deleteMediaItemExists) {
            console.log('❌ CRITICAL: deleteMediaItem function not found');
            console.log('   → This will cause "Cannot find variable: deleteMediaItem" errors');
        } else {
            console.log('✅ deleteMediaItem function is available');
        }
        
        if (!functionCheck.uploadFunctionExists) {
            console.log('❌ CRITICAL: uploadFileToSupabaseStorage function not found');
            console.log('   → Upload functionality may not work as expected');
        } else {
            console.log('✅ Upload function is available');
        }
        
        console.log('\\n🔍 Keeping browser open for 15 seconds for manual inspection...');
        await page.waitForTimeout(15000);
        
    } catch (error) {
        console.error('❌ Error during debug:', error);
    } finally {
        await browser.close();
        console.log('🏁 Debug complete');
    }
}

simpleDebug().catch(console.error);