// Fixed Cloud-Only Storage Debug Script
const puppeteer = require('puppeteer');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fixedDebug() {
    console.log('🔍 Fixed Debug - Testing Live Deployment...');
    
    const browser = await puppeteer.launch({ 
        headless: false, 
        slowMo: 500,
        defaultViewport: { width: 1200, height: 800 }
    });
    
    const page = await browser.newPage();
    
    const errors = [];
    const networkRequests = [];
    
    // Monitor console and network
    page.on('console', msg => {
        const text = msg.text();
        const type = msg.type();
        
        console.log(`🔍 Console [${type}]: ${text}`);
        
        if (type === 'error' || text.includes('405') || text.includes('deleteMediaItem') || text.includes('v4.0.0') || text.includes('Supabase')) {
            errors.push({ type, text, timestamp: new Date().toISOString() });
        }
    });
    
    page.on('request', req => {
        const url = req.url();
        if (url.includes('supabase') || url.includes('storage')) {
            console.log(`📡 →  ${req.method()} ${url}`);
            networkRequests.push({ method: req.method(), url, type: 'request' });
        }
    });
    
    page.on('response', response => {
        const url = response.url();
        if (url.includes('supabase') || url.includes('storage')) {
            console.log(`📡 ← ${response.status()} ${url}`);
            networkRequests.push({ status: response.status(), url, type: 'response' });
            
            if (response.status() >= 400) {
                errors.push({
                    type: 'http_error',
                    status: response.status(),
                    url: url,
                    timestamp: new Date().toISOString()
                });
            }
        }
    });
    
    try {
        console.log('🌐 Loading https://ncc-opal.vercel.app/ ...');
        await page.goto('https://ncc-opal.vercel.app/', { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        
        console.log('⏳ Waiting for page initialization...');
        await sleep(3000);
        
        // Check critical functions
        const functionCheck = await page.evaluate(() => {
            const results = {
                deleteMediaItemExists: typeof window.deleteMediaItem === 'function',
                uploadFunctionExists: typeof window.uploadFileToSupabaseStorage === 'function',
                supabaseExists: typeof window.supabase !== 'undefined',
                supabaseConnected: window.isSupabaseConnected || false,
                hasV4Markers: document.body.innerHTML.includes('Cloud-Only v4.0.0') || 
                              document.body.innerHTML.includes('v4.0.0') ||
                              document.documentElement.innerHTML.includes('Cloud-Only v4.0.0'),
                supabaseUrl: window.SUPABASE_URL || 'Not found'
            };
            
            // Try to get more info about functions
            if (typeof window.deleteMediaItem === 'function') {
                results.deleteMediaItemCode = window.deleteMediaItem.toString().substring(0, 200) + '...';
            }
            
            return results;
        });
        
        console.log('\\n📊 === CRITICAL ANALYSIS ===');
        console.log('🔹 deleteMediaItem function exists:', functionCheck.deleteMediaItemExists);
        console.log('🔹 uploadFileToSupabaseStorage exists:', functionCheck.uploadFunctionExists);  
        console.log('🔹 Supabase client exists:', functionCheck.supabaseExists);
        console.log('🔹 Supabase connected:', functionCheck.supabaseConnected);
        console.log('🔹 Has v4.0.0 code markers:', functionCheck.hasV4Markers);
        console.log('🔹 Supabase URL:', functionCheck.supabaseUrl);
        
        if (functionCheck.deleteMediaItemCode) {
            console.log('🔹 deleteMediaItem preview:', functionCheck.deleteMediaItemCode);
        }
        
        // Test supplier interaction
        const suppliers = await page.$$('.supplier-card, .supplier-item');
        console.log(`\\n🏢 Found ${suppliers.length} supplier elements`);
        
        if (suppliers.length > 0) {
            console.log('👆 Clicking first supplier...');
            await suppliers[0].click();
            await sleep(2000);
            
            // Check for delete buttons
            const deleteButtons = await page.$$eval('button[onclick*="deleteMediaItem"], button[title*="Xóa"], .fa-trash', 
                buttons => buttons.map(btn => ({
                    onclick: btn.onclick ? btn.onclick.toString() : btn.getAttribute('onclick'),
                    title: btn.title,
                    className: btn.className
                }))
            );
            
            console.log(`🗑️  Found ${deleteButtons.length} delete buttons:`, deleteButtons);
            
            // Check for file upload
            const fileInputs = await page.$$eval('input[type="file"]', 
                inputs => inputs.map(input => ({
                    id: input.id,
                    name: input.name,
                    accept: input.accept
                }))
            );
            
            console.log(`📁 Found ${fileInputs.length} file inputs:`, fileInputs);
            
            // Check for media grid
            const mediaGrid = await page.$('#mediaGrid, .media-grid, .media-container');
            console.log('🖼️  Media grid element found:', !!mediaGrid);
            
            if (mediaGrid) {
                const mediaItems = await page.$$eval('#mediaGrid .media-item, .media-grid .media-item', 
                    items => items.length
                );
                console.log(`🖼️  Found ${mediaItems} media items in grid`);
            }
        }
        
        // Test Supabase directly if client exists
        if (functionCheck.supabaseExists) {
            console.log('\\n🧪 Testing Supabase connection directly...');
            
            const supabaseTest = await page.evaluate(async () => {
                try {
                    if (window.supabase && window.supabase.storage) {
                        const { data, error } = await window.supabase.storage.listBuckets();
                        return {
                            success: !error,
                            buckets: data ? data.map(b => ({ name: b.name, public: b.public })) : [],
                            error: error ? error.message : null
                        };
                    }
                    return { error: 'Supabase storage not available' };
                } catch (e) {
                    return { error: `Exception: ${e.message}` };
                }
            });
            
            console.log('📡 Supabase test result:', supabaseTest);
        }
        
        console.log('\\n🎯 === DIAGNOSTIC SUMMARY ===');
        console.log('📊 Total errors detected:', errors.length);
        console.log('📊 Network requests to Supabase:', networkRequests.length);
        
        if (errors.length > 0) {
            console.log('\\n❌ ERRORS FOUND:');
            errors.forEach((err, i) => {
                console.log(`   ${i+1}. [${err.type}] ${err.text || err.status + ' ' + err.url}`);
            });
        }
        
        // Key issues identification
        console.log('\\n🔍 === KEY ISSUES ===');
        
        let issuesFound = 0;
        
        if (!functionCheck.hasV4Markers) {
            console.log('❌ DEPLOYMENT SYNC ISSUE: Missing Cloud-Only v4.0.0 markers');
            console.log('   → The deployed version may be outdated');
            issuesFound++;
        }
        
        if (!functionCheck.deleteMediaItemExists) {
            console.log('❌ CRITICAL: deleteMediaItem function missing from global scope');
            console.log('   → This causes "Cannot find variable: deleteMediaItem" errors');
            issuesFound++;
        }
        
        if (!functionCheck.uploadFunctionExists) {
            console.log('❌ CRITICAL: uploadFileToSupabaseStorage function missing');
            console.log('   → Upload functionality may be broken or using different function name');  
            issuesFound++;
        }
        
        if (!functionCheck.supabaseConnected && functionCheck.supabaseExists) {
            console.log('⚠️  WARNING: Supabase client exists but not connected');
            console.log('   → Check Supabase credentials and network connectivity');
            issuesFound++;
        }
        
        const http405Errors = errors.filter(e => e.text?.includes('405') || e.status === 405);
        if (http405Errors.length > 0) {
            console.log('❌ CRITICAL: HTTP 405 errors detected');
            console.log('   → Supabase Storage policies may not be configured correctly');
            console.log('   → Run URGENT_supabase_fix_v4.sql in Supabase Dashboard');
            issuesFound++;
        }
        
        if (issuesFound === 0) {
            console.log('✅ No critical issues detected in this automated test');
            console.log('   → Manual testing of upload/delete may still reveal issues');
        }
        
        console.log('\\n🏁 Debug analysis complete. Check the findings above for specific fixes needed.');
        
    } catch (error) {
        console.error('❌ Error during debug:', error);
    } finally {
        await browser.close();
        console.log('🔚 Browser closed');
    }
}

fixedDebug().catch(console.error);