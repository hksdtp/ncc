// Comprehensive Cloud-Only Storage v4.0.0 Debug Script
// Tests the live deployment against expected functionality

const puppeteer = require('puppeteer-core');
const fs = require('fs');

async function comprehensiveDebug() {
    console.log('🔍 Starting Comprehensive Cloud-Only Storage Debug...');
    
    let browser;
    
    try {
        // Try to find Chrome/Chromium executable
        const possiblePaths = [
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            '/Applications/Chromium.app/Contents/MacOS/Chromium',
            '/usr/bin/google-chrome',
            '/usr/bin/chromium-browser'
        ];
        
        let executablePath = null;
        for (const path of possiblePaths) {
            if (fs.existsSync(path)) {
                executablePath = path;
                break;
            }
        }
        
        if (!executablePath) {
            console.log('❌ Chrome/Chromium not found. Installing chromium...');
            // Fallback to system chrome
            browser = await puppeteer.launch({ 
                headless: false,
                slowMo: 500
            });
        } else {
            browser = await puppeteer.launch({ 
                executablePath,
                headless: false,
                slowMo: 500,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
        }
        
        const page = await browser.newPage();
        
        // Set up comprehensive monitoring
        const errors = [];
        const networkRequests = [];
        const consoleMessages = [];
        
        page.on('console', msg => {
            const message = {
                type: msg.type(),
                text: msg.text(),
                timestamp: new Date().toISOString()
            };
            consoleMessages.push(message);
            
            if (msg.type() === 'error' || msg.text().includes('405') || msg.text().includes('Supabase')) {
                console.log(`🔍 Console [${msg.type().toUpperCase()}]: ${msg.text()}`);
            }
        });
        
        page.on('request', request => {
            const requestInfo = {
                method: request.method(),
                url: request.url(),
                timestamp: new Date().toISOString()
            };
            networkRequests.push(requestInfo);
            
            if (request.url().includes('supabase') || request.url().includes('storage')) {
                console.log(`📡 → ${request.method()} ${request.url()}`);
            }
        });
        
        page.on('response', response => {
            const url = response.url();
            if (url.includes('supabase') || url.includes('storage')) {
                console.log(`📡 ← ${response.status()} ${url}`);
                if (response.status() >= 400) {
                    console.log(`❌ HTTP Error: ${response.status()} ${response.statusText()}`);
                }
            }
        });
        
        page.on('pageerror', error => {
            errors.push({
                type: 'pageerror',
                message: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
            console.log('❌ Page Error:', error.message);
        });
        
        console.log('🌐 Navigating to live app: https://ncc-opal.vercel.app/');
        await page.goto('https://ncc-opal.vercel.app/', { 
            waitUntil: 'networkidle2',
            timeout: 30000 
        });
        
        console.log('⏳ Waiting for app initialization...');
        await page.waitForTimeout(3000);
        
        // === DIAGNOSTIC PHASE 1: CHECK DEPLOYMENT VERSION ===
        console.log('\\n🔍 === PHASE 1: CHECKING DEPLOYMENT VERSION ===');
        
        const versionCheck = await page.evaluate(() => {
            // Check if our Cloud-Only v4.0.0 functions exist
            return {
                hasDeleteMediaItem: typeof window.deleteMediaItem === 'function',
                hasUploadFileToSupabase: typeof window.uploadFileToSupabaseStorage === 'function',
                hasSupabaseClient: typeof window.supabase !== 'undefined',
                supabaseUrl: window.SUPABASE_URL || 'Not found',
                isConnected: window.isSupabaseConnected || false,
                // Look for our v4.0.0 console markers
                hasV4Markers: document.documentElement.innerHTML.includes('Cloud-Only v4.0.0') || 
                              document.documentElement.innerHTML.includes('Cloud-Only Storage v4.0.0')
            };
        });
        
        console.log('📊 Deployment Status:', versionCheck);
        
        if (!versionCheck.hasV4Markers) {
            console.log('⚠️  WARNING: Deployed version does not contain Cloud-Only v4.0.0 markers!');
            console.log('📋 Action needed: The deployment may not include the latest fixes');
        }
        
        // === DIAGNOSTIC PHASE 2: SUPABASE CONNECTION ===
        console.log('\\n🔍 === PHASE 2: SUPABASE CONNECTION TEST ===');
        
        const supabaseTest = await page.evaluate(async () => {
            if (typeof window.supabase === 'undefined') {
                return { error: 'Supabase client not found' };
            }
            
            try {
                // Test Supabase connection
                const { data, error } = await window.supabase.storage.listBuckets();
                return {
                    success: !error,
                    buckets: data?.map(b => b.name) || [],
                    error: error?.message || null
                };
            } catch (e) {
                return { error: e.message };
            }
        });
        
        console.log('📊 Supabase Connection:', supabaseTest);
        
        // === DIAGNOSTIC PHASE 3: FUNCTION AVAILABILITY ===
        console.log('\\n🔍 === PHASE 3: FUNCTION AVAILABILITY TEST ===');
        
        const functionTest = await page.evaluate(() => {
            const functions = [
                'deleteMediaItem',
                'uploadFileToSupabaseStorage', 
                'handleFiles',
                'renderMediaGrid',
                'showNotification'
            ];
            
            const results = {};
            functions.forEach(funcName => {
                results[funcName] = {
                    exists: typeof window[funcName] === 'function',
                    type: typeof window[funcName]
                };
            });
            
            return results;
        });
        
        console.log('📊 Function Availability:', functionTest);
        
        // === DIAGNOSTIC PHASE 4: UI ELEMENT TEST ===
        console.log('\\n🔍 === PHASE 4: UI ELEMENT TEST ===');
        
        // Check for suppliers
        await page.waitForSelector('body', { timeout: 5000 });
        const suppliers = await page.$$('.supplier-card');
        console.log(`📊 Found ${suppliers.length} supplier cards`);
        
        // Check for file upload input
        const fileInputs = await page.$$('input[type="file"]');
        console.log(`📊 Found ${fileInputs.length} file input(s)`);
        
        // Check for delete buttons
        const deleteButtons = await page.$$('button[onclick*="deleteMediaItem"], button[title*="Xóa"]');
        console.log(`📊 Found ${deleteButtons.length} delete button(s)`);
        
        // === DIAGNOSTIC PHASE 5: UPLOAD TEST ===
        if (suppliers.length > 0 && fileInputs.length > 0) {
            console.log('\\n🔍 === PHASE 5: UPLOAD FUNCTIONALITY TEST ===');
            
            console.log('👆 Selecting first supplier...');
            await suppliers[0].click();
            await page.waitForTimeout(2000);
            
            // Check if upload area is available
            const uploadArea = await page.$('.upload-area, #uploadArea');
            console.log('📊 Upload area found:', !!uploadArea);
            
            // Check for media grid
            const mediaGrid = await page.$('#mediaGrid, .media-grid');
            console.log('📊 Media grid found:', !!mediaGrid);
            
            if (uploadArea) {
                console.log('✅ Upload UI is available for testing');
            }
        }
        
        // === DIAGNOSTIC PHASE 6: DELETE FUNCTION TEST ===
        if (deleteButtons.length > 0) {
            console.log('\\n🔍 === PHASE 6: DELETE FUNCTION TEST ===');
            
            const deleteTest = await page.evaluate(() => {
                // Test if we can call deleteMediaItem without actually deleting
                if (typeof window.deleteMediaItem === 'function') {
                    try {
                        // Mock test - check function signature
                        const functionStr = window.deleteMediaItem.toString();
                        return {
                            accessible: true,
                            hasSupabaseCode: functionStr.includes('supabase'),
                            hasBucketRef: functionStr.includes('supplier-media'),
                            hasErrorHandling: functionStr.includes('catch') || functionStr.includes('error')
                        };
                    } catch (e) {
                        return { accessible: false, error: e.message };
                    }
                }
                return { accessible: false, reason: 'Function does not exist' };
            });
            
            console.log('📊 Delete Function Analysis:', deleteTest);
        }
        
        // === GENERATE DIAGNOSTIC REPORT ===
        console.log('\\n📋 === COMPREHENSIVE DIAGNOSTIC REPORT ===');
        
        const report = {
            timestamp: new Date().toISOString(),
            deployment: versionCheck,
            supabase: supabaseTest,
            functions: functionTest,
            ui: {
                suppliers: suppliers.length,
                fileInputs: fileInputs.length,
                deleteButtons: deleteButtons.length
            },
            errors: errors.length,
            networkRequests: networkRequests.filter(r => 
                r.url.includes('supabase') || r.url.includes('storage')
            ).length,
            consoleMessages: consoleMessages.filter(m => 
                m.type === 'error' || m.text.includes('405') || m.text.includes('Supabase')
            )
        };
        
        console.log('📊 Final Report:', JSON.stringify(report, null, 2));
        
        // Save detailed report
        const reportFile = '/tmp/cloud_storage_debug_report.json';
        require('fs').writeFileSync(reportFile, JSON.stringify({
            report,
            allErrors: errors,
            allNetworkRequests: networkRequests.slice(-20), // Last 20 requests
            allConsoleMessages: consoleMessages.slice(-50)  // Last 50 console messages
        }, null, 2));
        
        console.log(`📄 Detailed report saved to: ${reportFile}`);
        
        console.log('\\n🎯 === KEY FINDINGS SUMMARY ===');
        
        if (!versionCheck.hasV4Markers) {
            console.log('❌ CRITICAL: Deployment missing Cloud-Only v4.0.0 updates');
        }
        
        if (!versionCheck.hasDeleteMediaItem) {
            console.log('❌ CRITICAL: deleteMediaItem function missing');
        }
        
        if (!versionCheck.hasUploadFileToSupabase) {
            console.log('❌ CRITICAL: uploadFileToSupabaseStorage function missing');
        }
        
        if (supabaseTest.error) {
            console.log(`❌ CRITICAL: Supabase connection failed: ${supabaseTest.error}`);
        }
        
        console.log('\\n✅ Debug complete. Browser will stay open for 30 seconds for manual inspection...');
        await page.waitForTimeout(30000);
        
    } catch (error) {
        console.error('❌ Debug script error:', error);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run if called directly
if (require.main === module) {
    comprehensiveDebug().catch(console.error);
}

module.exports = { comprehensiveDebug };