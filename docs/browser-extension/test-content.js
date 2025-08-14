// Simple test version - just check if the extension can connect
console.log('Facebook Event Extractor: Test content script loaded');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Test: Received message:', request);
    
    if (request.action === 'extractEventData') {
        sendResponse({
            success: true,
            data: {
                source: 'facebook_extension',
                event_title: 'Test Event',
                event_date: 'Test Date',
                event_time: 'Test Time',
                venue_name: 'Test Venue',
                promoter: 'Test Promoter',
                genre: 'test',
                description: 'Test Description',
                ticket_url: 'https://test.com',
                extracted_at: new Date().toISOString()
            }
        });
    }
    
    return true;
});

console.log('Test content script ready');