// SIMPLIFIED CONTENT SCRIPT FOR TESTING CONNECTION

console.log('🔥 TEST CONTENT SCRIPT LOADED 🔥', new Date().toISOString());
console.log('Current URL:', window.location.href);

// Simple message listener for testing
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('📨 TEST: Received message:', request);
    
    if (request.action === 'extractEventData') {
        console.log('📊 TEST: Starting extraction...');
        
        // Simple test response
        const testData = {
            event_title: 'TEST EVENT - Connection Working',
            event_date: '2025-08-15',
            event_time: '8:00 PM',
            venue_name: 'Test Venue',
            promoter: 'Test Promoter',
            genre: 'electronic',
            description: 'Test event to verify connection works',
            image_url: '',
            ticket_url: window.location.href,
            facebook_url: window.location.href,
            extracted_at: new Date().toISOString()
        };
        
        console.log('✅ TEST: Sending response:', testData);
        
        sendResponse({
            success: true,
            data: testData
        });
        
        return true; // Keep message channel open
    }
    
    return false;
});

console.log('📋 TEST: Message listener registered');