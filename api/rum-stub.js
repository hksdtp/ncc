// 🛡️ RUM Stub API - Handle Cloudflare/Vercel RUM requests to prevent 404s
// This endpoint accepts RUM (Real User Monitoring) requests and returns success
// to prevent console errors while maintaining app functionality

export default function handler(req, res) {
    // Log the RUM request for debugging (optional)
    console.log('📊 RUM request received:', {
        method: req.method,
        url: req.url,
        userAgent: req.headers['user-agent'],
        timestamp: new Date().toISOString()
    });

    // Set CORS headers to allow cross-origin requests
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Return success response for all RUM requests
    res.status(200).json({
        success: true,
        message: 'RUM data received',
        timestamp: new Date().toISOString(),
        note: 'This is a stub endpoint to prevent 404 errors from RUM tracking'
    });
}
