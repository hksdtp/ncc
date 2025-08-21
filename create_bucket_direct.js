// 🪣 CREATE SUPABASE BUCKET DIRECTLY
// Script để tạo bucket trực tiếp từ JavaScript

const SUPABASE_URL = 'https://hukhojlhmvpjmiyageqg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1a2hvamxobXZwam1peWFnZXFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU2ODAwMTQsImV4cCI6MjA3MTI1NjAxNH0.g6KFGNEYtxxvjhc48m1Z3RLwW96g8_j3yPkv_Ly1zo8';

async function createBucketDirect() {
    try {
        console.log('🚀 Creating Supabase bucket directly...');
        
        // Import Supabase
        const { createClient } = supabase;
        const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
        // List existing buckets first
        console.log('📊 Checking existing buckets...');
        const { data: existingBuckets, error: listError } = await supabaseClient.storage.listBuckets();
        
        if (listError) {
            console.error('❌ Error listing buckets:', listError);
            return;
        }
        
        console.log('📋 Existing buckets:', existingBuckets?.map(b => b.name) || 'none');
        
        // Try to create supplier-media bucket
        const bucketName = 'supplier-media';
        const existingBucket = existingBuckets?.find(b => b.name === bucketName);
        
        if (existingBucket) {
            console.log('✅ Bucket already exists:', bucketName);
            return;
        }
        
        console.log('🔧 Creating bucket:', bucketName);
        const { data: createResult, error: createError } = await supabaseClient.storage.createBucket(bucketName, {
            public: true,
            allowedMimeTypes: ['image/*', 'video/*'],
            fileSizeLimit: 52428800 // 50MB
        });
        
        if (createError) {
            console.error('❌ Failed to create bucket:', createError);
            
            // Try alternative bucket names
            const alternatives = ['media', 'uploads', 'files'];
            
            for (const altName of alternatives) {
                console.log(`🔄 Trying alternative bucket: ${altName}`);
                const { error: altError } = await supabaseClient.storage.createBucket(altName, {
                    public: true
                });
                
                if (!altError) {
                    console.log(`✅ Successfully created bucket: ${altName}`);
                    return;
                } else {
                    console.log(`❌ Failed to create ${altName}:`, altError.message);
                }
            }
            
            console.error('❌ All bucket creation attempts failed');
        } else {
            console.log('✅ Successfully created bucket:', bucketName);
            console.log('📦 Bucket details:', createResult);
        }
        
    } catch (error) {
        console.error('❌ Script error:', error);
    }
}

// Auto-run when script loads
if (typeof window !== 'undefined' && window.supabase) {
    createBucketDirect();
} else {
    console.log('⚠️ Supabase not available. Run this in browser console after page loads.');
}
