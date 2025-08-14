// Simple CORS proxy server for the bookmarklet
// Run this with: node cors-proxy-server.js

const http = require('http');
const url = require('url');

const PROXY_PORT = 8080;
const TARGET_URL = 'http://localhost:3001/api/events/import-from-email';

const server = http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    // Only handle POST requests to /proxy
    if (req.method !== 'POST' || req.url !== '/proxy') {
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not found. Use POST /proxy');
        return;
    }
    
    console.log(`📥 Proxying request to ${TARGET_URL}`);
    
    // Collect request body
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', () => {
        // Forward to target server
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        const proxyReq = http.request(TARGET_URL, options, (proxyRes) => {
            // Forward response
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res);
            
            console.log(`✅ Response: ${proxyRes.statusCode}`);
        });
        
        proxyReq.on('error', (error) => {
            console.error('❌ Proxy error:', error);
            res.writeHead(500, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({
                error: 'Proxy error',
                details: error.message
            }));
        });
        
        proxyReq.write(body);
        proxyReq.end();
    });
});

server.listen(PROXY_PORT, () => {
    console.log('🚀 CORS Proxy Server started!');
    console.log(`📡 Listening on: http://localhost:${PROXY_PORT}`);
    console.log(`🎯 Proxying to: ${TARGET_URL}`);
    console.log('');
    console.log('📝 Update your bookmarklet to use:');
    console.log(`   fetch('http://localhost:${PROXY_PORT}/proxy', {...})`);
    console.log('');
    console.log('🛑 Press Ctrl+C to stop');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down CORS proxy server...');
    server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
    });
});