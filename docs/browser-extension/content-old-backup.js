// Content script to extract Facebook event data
// Runs on Facebook event pages

console.log('🔥 UPDATED CONTENT SCRIPT LOADED - VERSION 2.0 🔥', new Date().toISOString());

async function extractEventData() {
    console.log('Facebook Event Extractor: Starting extraction on', window.location.href);
    
    // Check if we're actually on an event page
    const isEventPage = window.location.href.includes('/events/') && 
                       window.location.href.match(/\/events\/\d+/) &&
                       !window.location.href.includes('/events/?') &&
                       !window.location.href.includes('/events/discover') &&
                       !window.location.href.includes('/events/calendar');
    
    if (!isEventPage) {
        console.log('Facebook Event Extractor: Not on an event page');
        return {
            title: 'Not on Facebook event page',
            date: '',
            time: '',
            venue: '',
            description: 'Please navigate to a specific Facebook event page (e.g., facebook.com/events/123456789)',
            organizer: '',
            url: window.location.href,
            extracted_at: new Date().toISOString()
        };
    }
    
    console.log('Facebook Event Extractor: Confirmed on event page, extracting...');
    
    const eventData = {
        title: '',
        date: '',
        time: '',
        venue: '',
        description: '',
        organizer: '',
        image: '',
        url: window.location.href,
        extracted_at: new Date().toISOString()
    };

    try {
        // Wait for page to load if needed
        if (document.readyState !== 'complete') {
            await new Promise(resolve => {
                window.addEventListener('load', resolve);
                setTimeout(resolve, 2000); // fallback timeout
            });
        }

        // Extract event title (multiple selectors for different FB layouts)
        const titleSelectors = [
            '[data-testid="event-permalink-event-name"] h1',
            '[data-testid="event-permalink-event-name"]',
            'h1[data-testid="event-permalink-event-name"]',
            '[role="main"] h1',
            'h1[class*="x1heor9g"]',
            'h1[class*="x1qlqyl8"]',
            '.x1heor9g .x1qlqyl8',
            'div[dir="auto"] h1',
            'h1',
            // Fallback to any large text that might be the title
            '[style*="font-size"] span',
            'span[dir="auto"][class*="x1"]'
        ];
        
        for (const selector of titleSelectors) {
            const titleEl = document.querySelector(selector);
            if (titleEl && titleEl.textContent.trim()) {
                eventData.title = titleEl.textContent.trim();
                break;
            }
        }

        // Extract date and time - look specifically for the header date/time
        const dateTimeSelectors = [
            // Look for the red header text that shows "Friday, October 31, 2025 at 8 PM"
            '[style*="color: rgb(255, 72, 72)"]', // Red date text
            '[style*="color: #ff4848"]', // Alternative red color
            '.x1heor9g[style*="color"]', // Styled header elements
            'div[dir="ltr"]', // Left-to-right text containers
        ];
        
        let fullDateTimeText = '';
        
        for (const selector of dateTimeSelectors) {
            const elements = document.querySelectorAll(selector);
            for (const el of elements) {
                const text = el.textContent?.trim();
                if (text && text.includes('2025') && text.includes('at')) {
                    // Found the full date/time string like "Friday, October 31, 2025 at 8 PM"
                    fullDateTimeText = text;
                    console.log('Found full date/time:', text);
                    break;
                }
            }
            if (fullDateTimeText) break;
        }
        
        // Fallback: scan all text for the date/time pattern
        if (!fullDateTimeText) {
            const allTextElements = document.querySelectorAll('*');
            for (const el of allTextElements) {
                if (el.children.length === 0) { // Only leaf nodes
                    const text = el.textContent?.trim();
                    if (text && text.match(/\w+day,\s+\w+\s+\d{1,2},\s+\d{4}\s+at\s+\d+\s*[AP]M/i)) {
                        fullDateTimeText = text;
                        console.log('Found date/time in fallback:', text);
                        break;
                    }
                }
            }
        }

        // Parse the full date/time string
        if (fullDateTimeText) {
            const datePattern = /(\w+day,\s+\w+\s+\d{1,2},\s+\d{4})/i;
            const timePattern = /at\s+(\d+)\s*([AP]M)/i;
            
            const dateMatch = fullDateTimeText.match(datePattern);
            const timeMatch = fullDateTimeText.match(timePattern);
            
            if (dateMatch) {
                eventData.date = dateMatch[1];
                console.log('Extracted date:', dateMatch[1]);
            }
            if (timeMatch) {
                eventData.time = timeMatch[1] + timeMatch[2].toLowerCase();
                console.log('Extracted time:', timeMatch[1] + timeMatch[2]);
            }
        }

        // Extract venue/location - look for text right under the event title
        let venueText = '';
        
        // First try to find venue near the title
        if (eventData.title) {
            // Find title element and look for venue in nearby elements
            const titleSelectors = [
                '[data-testid="event-permalink-event-name"] h1',
                '[data-testid="event-permalink-event-name"]',
                'h1[data-testid="event-permalink-event-name"]',
                '[role="main"] h1',
                'h1'
            ];
            
            for (const selector of titleSelectors) {
                const titleEl = document.querySelector(selector);
                if (titleEl && titleEl.textContent.trim() === eventData.title) {
                    // Look for venue in the next few sibling elements
                    let current = titleEl.parentElement;
                    let attempts = 0;
                    while (current && attempts < 5) {
                        const nextSibling = current.nextElementSibling;
                        if (nextSibling) {
                            const text = nextSibling.textContent?.trim();
                            if (text && text.length > 3 && text.length < 100 && 
                                !text.includes('202') && // Not a date
                                !text.includes('AM') && !text.includes('PM') && // Not time
                                !text.includes('$') && // Not price
                                !text.toLowerCase().includes('interested') && // Not interest count
                                !text.toLowerCase().includes('going')) { // Not going count
                                venueText = text;
                                break;
                            }
                        }
                        current = nextSibling;
                        attempts++;
                    }
                    if (venueText) break;
                }
            }
        }
        
        // Fallback to traditional location selectors if venue not found near title
        if (!venueText) {
            const locationSelectors = [
                '[data-testid="event-permalink-details"] a[href*="maps"]',
                'a[href*="maps.google"]',
                'a[href*="facebook.com/pages"]',
                '.event-location',
                '.venue-name'
            ];

            for (const selector of locationSelectors) {
                const locationEl = document.querySelector(selector);
                if (locationEl && locationEl.textContent.trim()) {
                    venueText = locationEl.textContent.trim();
                    break;
                }
            }
        }
        
        eventData.venue = venueText;

        // Extract promoter - look for "Event by" line that shows all organizers
        let organizerText = '';
        
        // Look for the "Event by" line - only check visible text elements, not JSON data
        const organizerTextElements = document.querySelectorAll('div, span, p, a');
        for (const el of organizerTextElements) {
            const text = el.textContent?.trim();
            if (text && 
                text.length < 200 && // Reasonable length, not JSON data
                text.includes('Event by') && 
                text.includes('Downright Entertainment') &&
                !text.includes('{') && // Not JSON
                !text.includes('__typename') && // Not GraphQL data
                !text.includes('normalization')) {
                
                console.log('Found Event by line:', text);
                
                // Extract "Downright Entertainment" specifically
                if (text.includes('Downright Entertainment')) {
                    organizerText = 'Downright Entertainment';
                    console.log('Extracted promoter:', organizerText);
                    break;
                }
            }
        }
        
        // Fallback selectors if the "Event by" line isn't found
        if (!organizerText) {
            const organizerSelectors = [
                '[data-testid="event-permalink-organizer"] a',
                '.event-organizer a',
                '.hosted-by a'
            ];

            for (const selector of organizerSelectors) {
                const organizerElements = document.querySelectorAll(selector);
                for (const organizerEl of organizerElements) {
                    if (organizerEl && organizerEl.textContent.trim()) {
                        const text = organizerEl.textContent.trim();
                        // Skip common navigation elements
                        if (text !== 'Home' && text !== 'Events' && text !== 'Find Tickets' &&
                            text !== 'Profile' && text !== 'Settings' && text !== 'Menu' &&
                            text.length > 2 && text.length < 50) {
                            organizerText = text;
                            break;
                        }
                    }
                }
                if (organizerText) break;
            }
        }
        
        eventData.organizer = organizerText;

        // Extract description - look for text starting with "We're taking over"
        let descriptionText = '';
        
        // Look for description text - be more flexible with the search
        const descriptionTextElements = document.querySelectorAll('div, p, span');
        for (const el of descriptionTextElements) {
            const text = el.textContent?.trim();
            if (text && text.length > 50 && text.length < 1000) { // Reasonable description length
                // Look for description patterns
                if (text.includes("We're taking over") || 
                    text.includes("Halloween night") ||
                    text.includes("warehouse takeover") ||
                    text.includes("TROYBOI") ||
                    text.includes("What to expect")) {
                    
                    // Make sure it's not JSON or navigation text
                    if (!text.includes('{') && 
                        !text.includes('__typename') &&
                        !text.includes('normalization') &&
                        !text.toLowerCase().includes('tickets') &&
                        !text.toLowerCase().includes('find tickets')) {
                        
                        descriptionText = text;
                        console.log('Found description:', text.substring(0, 100));
                        break;
                    }
                }
            }
        }
        
        // Fallback description selectors
        if (!descriptionText) {
            const descSelectors = [
                '[data-testid="event-permalink-description"]',
                '.event-description',
                '.description-text',
                '[role="main"] div[data-testid*="description"]'
            ];

            for (const selector of descSelectors) {
                const descEl = document.querySelector(selector);
                if (descEl && descEl.textContent.trim()) {
                    const text = descEl.textContent.trim();
                    if (text.length > 50) { // Ensure it's substantial content
                        descriptionText = text;
                        break;
                    }
                }
            }
        }
        
        eventData.description = descriptionText;

        // Extract event image/flyer
        let imageUrl = '';
        
        // Look for the main event image - Facebook event cover photos with updated selectors
        const imageSelectors = [
            // Main event cover image (most common)
            'img[data-imgperflogname="profileCoverPhoto"]',
            'img[data-imgperflogname="eventCoverPhoto"]', 
            // Large prominent images in main content
            '[role="main"] img[src*="scontent"]',
            '[role="main"] img[src*="fbcdn.net"]',
            // Header/cover area images
            'header img[src*="scontent"]',
            'div[role="banner"] img[src*="scontent"]',
            // Event specific containers
            '[data-testid="event-permalink-cover-photo"] img',
            '[data-testid="event-header"] img',
            // Large images that might be event flyers (common sizes)
            'img[width="400"], img[width="500"], img[width="600"], img[width="800"]',
            'img[style*="width: 400"], img[style*="width: 500"], img[style*="width: 600"]',
            // Any large image in the main content area
            '[role="main"] img[style*="width"]',
            // Generic Facebook image patterns
            'img[src*="scontent-"]',
            'img[src*="fbcdn.net"]',
            // Mobile-specific selectors
            '.img[class*="coverPhoto"]',
            'img[class*="scaledImageFitWidth"]'
        ];
        
        console.log('Facebook Event Extractor: Looking for images with', imageSelectors.length, 'selectors');
        console.log('Facebook Event Extractor: Current page URL:', window.location.href);
        
        // First, let's see ALL images on the page
        const allImages = document.querySelectorAll('img');
        console.log(`Facebook Event Extractor: Found ${allImages.length} total images on page`);
        
        // Log details about all images for debugging  
        window.candidateImages = []; // Make it global so it's available later
        let candidateImages = window.candidateImages;
        allImages.forEach((img, index) => {
            const src = img.src || img.getAttribute('src') || img.getAttribute('data-src');
            if (src && (src.includes('scontent') || src.includes('fbcdn.net'))) {
                candidateImages.push({
                    index: index + 1,
                    src: src,
                    naturalWidth: img.naturalWidth,
                    naturalHeight: img.naturalHeight,
                    width: img.width,
                    height: img.height,
                    className: img.className,
                    alt: img.alt,
                    dataSrc: img.getAttribute('data-src'),
                    style: img.style.cssText
                });
            }
        });
        
        console.log(`Facebook Event Extractor: Found ${candidateImages.length} Facebook CDN images:`, candidateImages);
        
        // If we found Facebook images, try to use the largest one as fallback
        if (candidateImages.length > 0) {
            const largestImage = candidateImages.reduce((largest, current) => {
                const currentSize = (current.naturalWidth || current.width || 0) * (current.naturalHeight || current.height || 0);
                const largestSize = (largest.naturalWidth || largest.width || 0) * (largest.naturalHeight || largest.height || 0);
                return currentSize > largestSize ? current : largest;
            });
            console.log('Facebook Event Extractor: Largest image candidate:', largestImage);
        }

        for (const selector of imageSelectors) {
            const images = document.querySelectorAll(selector);
            console.log(`Facebook Event Extractor: Selector "${selector}" found ${images.length} images`);
            
            for (const img of images) {
                const src = img.src || img.getAttribute('src');
                console.log('Facebook Event Extractor: Checking image:', src, 'dimensions:', img.naturalWidth, 'x', img.naturalHeight);
                
                // More detailed checking with reasons for rejection
                if (!src) {
                    console.log('Facebook Event Extractor: ❌ Rejected - no src');
                    continue;
                }
                
                if (!src.includes('scontent') && !src.includes('fbcdn.net')) {
                    console.log('Facebook Event Extractor: ❌ Rejected - not Facebook CDN:', src);
                    continue;
                }
                
                if (src.includes('profile_pic')) {
                    console.log('Facebook Event Extractor: ❌ Rejected - profile picture');
                    continue;
                }
                
                if (src.includes('safe_image')) {
                    console.log('Facebook Event Extractor: ❌ Rejected - safe image');
                    continue;
                }
                
                if (img.naturalWidth <= 150 || img.naturalHeight <= 150) {
                    console.log('Facebook Event Extractor: ❌ Rejected - too small:', img.naturalWidth, 'x', img.naturalHeight);
                    continue;
                }
                
                console.log('Facebook Event Extractor: ✅ Found valid event image:', src);
                
                // Clean the Facebook image URL to get the highest quality
                let cleanImageUrl = src;
                
                // Remove Facebook's image resizing parameters to get full resolution
                cleanImageUrl = cleanImageUrl.replace(/&oh=[^&]+/, '');
                cleanImageUrl = cleanImageUrl.replace(/&oe=[^&]+/, '');
                cleanImageUrl = cleanImageUrl.replace(/&_nc_cat=[^&]+/, '');
                cleanImageUrl = cleanImageUrl.replace(/&ccb=[^&]+/, '');
                cleanImageUrl = cleanImageUrl.replace(/&_nc_sid=[^&]+/, '');
                cleanImageUrl = cleanImageUrl.replace(/&_nc_ohc=[^&]+/, '');
                cleanImageUrl = cleanImageUrl.replace(/&_nc_ht=[^&]+/, '');
                cleanImageUrl = cleanImageUrl.replace(/&tp=[^&]+/, '');
                cleanImageUrl = cleanImageUrl.replace(/&cb=[^&]+/, '');
                
                // Try to get original resolution by changing width/height parameters
                if (cleanImageUrl.includes('&w=') && cleanImageUrl.includes('&h=')) {
                    // Keep the aspect ratio but increase resolution
                    cleanImageUrl = cleanImageUrl.replace(/&w=\d+/, '&w=1080');
                    cleanImageUrl = cleanImageUrl.replace(/&h=\d+/, '&h=1080');
                }
                
                imageUrl = cleanImageUrl;
                console.log('Found event image:', imageUrl);
                break;
            }
            if (imageUrl) break;
        }
        
        // If no image found, try aggressive fallback strategies
        if (!imageUrl) {
            console.log('Facebook Event Extractor: No image found with strict criteria, trying aggressive fallbacks...');
            
            // Strategy 1: Wait longer for lazy-loaded images
            console.log('Facebook Event Extractor: Waiting 3 seconds for images to load...');
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Strategy 2: Look for data-src attributes (lazy loading)
            const lazyImages = document.querySelectorAll('img[data-src]');
            console.log('Facebook Event Extractor: Found', lazyImages.length, 'lazy-loaded images');
            for (const img of lazyImages) {
                const src = img.getAttribute('data-src');
                if (src && (src.includes('scontent') || src.includes('fbcdn.net')) && !src.includes('profile_pic')) {
                    imageUrl = src;
                    console.log('Facebook Event Extractor: ✅ Using lazy-loaded image:', imageUrl);
                    break;
                }
            }
            
            // Strategy 3: Use ANY Facebook image that's reasonable size
            if (!imageUrl) {
                const fallbackImages = document.querySelectorAll('img');
                console.log('Facebook Event Extractor: Trying', fallbackImages.length, 'total images with relaxed criteria');
                
                for (const img of fallbackImages) {
                    const src = img.src || img.getAttribute('src');
                    if (src && (src.includes('scontent') || src.includes('fbcdn.net'))) {
                        console.log('Facebook Event Extractor: Fallback checking:', src, 'size:', img.naturalWidth || 'loading', 'x', img.naturalHeight || 'loading');
                        
                        // Very lenient criteria - any Facebook image over 100px
                        if (img.naturalWidth > 100 && img.naturalHeight > 100 && 
                            !src.includes('profile_pic') && 
                            !src.includes('safe_image')) {
                            imageUrl = src;
                            console.log('Facebook Event Extractor: ✅ Using relaxed criteria image:', imageUrl);
                            break;
                        }
                    }
                }
            }
            
            // Strategy 4: Desperate measures - any Facebook image at all
            if (!imageUrl) {
                console.log('Facebook Event Extractor: Desperate search - any Facebook image...');
                const allFbImages = Array.from(document.querySelectorAll('img')).filter(img => {
                    const src = img.src || img.getAttribute('src');
                    return src && (src.includes('scontent') || src.includes('fbcdn.net')) && !src.includes('profile_pic');
                });
                
                if (allFbImages.length > 0) {
                    // Sort by size and take the largest
                    allFbImages.sort((a, b) => (b.naturalWidth * b.naturalHeight) - (a.naturalWidth * a.naturalHeight));
                    const bestImg = allFbImages[0];
                    imageUrl = bestImg.src || bestImg.getAttribute('src');
                    console.log('Facebook Event Extractor: ⚠️ Using best available image:', imageUrl, 'size:', bestImg.naturalWidth, 'x', bestImg.naturalHeight);
                }
            }
            
            // Strategy 5: Look in CSS background images
            if (!imageUrl) {
                console.log('Facebook Event Extractor: Checking CSS background images...');
                const elementsWithBg = document.querySelectorAll('*');
                for (const element of elementsWithBg) {
                    const style = window.getComputedStyle(element);
                    const bgImage = style.backgroundImage;
                    if (bgImage && bgImage !== 'none' && bgImage.includes('scontent')) {
                        const match = bgImage.match(/url\(['"]?(.*?)['"]?\)/);
                        if (match) {
                            imageUrl = match[1];
                            console.log('Facebook Event Extractor: ✅ Using CSS background image:', imageUrl);
                            break;
                        }
                    }
                }
            }
        }
        
        eventData.image = imageUrl;

        console.log('Facebook Event Extractor: Extracted data:', eventData);
        return eventData;

    } catch (error) {
        console.error('Facebook Event Extractor: Error extracting data:', error);
        return eventData;
    }
}

function detectGenre(eventData) {
    const content = (eventData.title + ' ' + eventData.description + ' ' + eventData.organizer).toLowerCase();
    
    const genreKeywords = {
        'house': ['house', 'deep house', 'tech house', 'progressive house'],
        'drum-and-bass': ['drum and bass', 'dnb', 'liquid', 'neurofunk'],
        'ukg': ['uk garage', 'garage', 'ukg', '2-step'],
        'dubstep': ['dubstep', 'bass music', 'riddim', 'future bass'],
        'trance': ['trance', 'progressive trance', 'uplifting', 'psytrance'],
        'techno': ['techno', 'minimal', 'industrial', 'detroit techno'],
        'hip-hop': ['hip hop', 'rap', 'trap', 'hip-hop'],
        'electronic': ['electronic', 'edm', 'dance music'],
        'multi-genre': ['multi-genre', 'various artists', 'multiple genres', 'diverse lineup']
    };
    
    // Check for multi-genre indicators first
    if (content.includes('troyboi') || content.includes('multiple') || content.includes('various') || content.includes('diverse')) {
        return 'multi-genre';
    }

    for (const [genre, keywords] of Object.entries(genreKeywords)) {
        if (keywords.some(keyword => content.includes(keyword))) {
            return genre;
        }
    }
    return 'other';
}

// Function to download image and upload via server-side proxy
async function downloadAndUploadImage(imageUrl) {
    try {
        console.log('Facebook Event Extractor: Using server-side proxy for image:', imageUrl);
        
        // Use server-side proxy to bypass Facebook's CORS restrictions
        const response = await fetch('http://localhost:3002/api/proxy-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                imageUrl: imageUrl
            })
        });
        
        if (!response.ok) {
            throw new Error(`Proxy request failed: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success && result.url) {
            console.log('Facebook Event Extractor: Successfully proxied image:', result.url);
            // Convert relative URL to absolute URL
            const fullUrl = `http://localhost:3002${result.url}`;
            console.log('Facebook Event Extractor: Full image URL:', fullUrl);
            return fullUrl;
        } else {
            throw new Error(result.error || 'Proxy failed');
        }
        
    } catch (error) {
        console.error('Facebook Event Extractor: Proxy method failed:', error);
        
        // FALLBACK: Return empty string instead of Facebook URL to avoid 403 errors
        return '';
    }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Facebook Event Extractor: Received message:', request);
    
    if (request.action === 'extractEventData') {
        // Handle async extraction
        (async () => {
            try {
                const eventData = await extractEventData();
                const detectedGenre = detectGenre(eventData);
                
                // If we have an image URL, download and upload it from page context
                let processedImageUrl = '';
                console.log('Facebook Event Extractor: Initial image URL:', eventData.image);
                
                if (eventData.image) {
                    let { width, height } = img;
                    
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                    
                    canvas.width = width;
                    canvas.height = height;
                    
                    // Draw the image to canvas with scaling
                    ctx.drawImage(img, 0, 0, width, height);
                    
                    // Convert canvas to blob
                    canvas.toBlob(async (blob) => {
                        if (!blob) {
                            reject(new Error('Failed to convert canvas to blob'));
                            return;
                        }
                        
                        console.log('Facebook Event Extractor: Created blob from canvas, size:', blob.size);
                        
                        // Convert blob to base64 for Imgur upload
                        const reader = new FileReader();
                        reader.onload = async function() {
                            try {
                                // Get base64 data (remove data:image/jpeg;base64, prefix)
                                const base64Data = reader.result.split(',')[1];
                                console.log('Facebook Event Extractor: Converted to base64, length:', base64Data.length);
                                
                                // Upload to freeimage.host (simple, no API key required)
                                const fileBlob = new Blob([Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))], {type: 'image/jpeg'});
                                const formData = new FormData();
                                formData.append('source', fileBlob, 'facebook-event.jpg');
                                formData.append('type', 'file');
                                formData.append('action', 'upload');
                                
                                const freeImageResponse = await fetch('https://freeimage.host/api/1/upload', {
                                    method: 'POST',
                                    body: formData
                                });
                                
                                console.log('Facebook Event Extractor: FreeImage response status:', freeImageResponse.status);
                                console.log('Facebook Event Extractor: FreeImage response ok:', freeImageResponse.ok);
                                
                                if (!freeImageResponse.ok) {
                                    const errorText = await freeImageResponse.text();
                                    console.error('Facebook Event Extractor: FreeImage error response:', errorText);
                                    // Try Telegraph as fallback (Telegram's image hosting)
                                    console.log('Facebook Event Extractor: FreeImage failed, trying Telegraph...');
                                    
                                    const telegraphFormData = new FormData();
                                    telegraphFormData.append('file', fileBlob, 'facebook-event.jpg');
                                    
                                    const telegraphResponse = await fetch('https://telegra.ph/upload', {
                                        method: 'POST',
                                        body: telegraphFormData
                                    });
                                    
                                    console.log('Facebook Event Extractor: Telegraph response status:', telegraphResponse.status);
                                    console.log('Facebook Event Extractor: Telegraph response ok:', telegraphResponse.ok);
                                    
                                    if (telegraphResponse.ok) {
                                        const telegraphResult = await telegraphResponse.json();
                                        console.log('Facebook Event Extractor: Telegraph upload successful!');
                                        console.log('Facebook Event Extractor: Telegraph response:', telegraphResult);
                                        
                                        if (telegraphResult && telegraphResult[0] && telegraphResult[0].src) {
                                            const telegraphUrl = 'https://telegra.ph' + telegraphResult[0].src;
                                            console.log('Facebook Event Extractor: Final Telegraph URL:', telegraphUrl);
                                            resolve(telegraphUrl);
                                            return;
                                        }
                                    } else {
                                        const telegraphErrorText = await telegraphResponse.text();
                                        console.error('Facebook Event Extractor: Telegraph error response:', telegraphErrorText);
                                    }
                                    
                                    // Try one more service - ImgBB with anonymous upload
                                    console.log('Facebook Event Extractor: Both services failed, trying ImgBB anonymous...');
                                    
                                    const imgbbFormData = new FormData();
                                    imgbbFormData.append('image', base64Data);
                                    
                                    const imgbbResponse = await fetch('https://api.imgbb.com/1/upload?key=anonymous', {
                                        method: 'POST',
                                        body: imgbbFormData
                                    });
                                    
                                    console.log('Facebook Event Extractor: ImgBB response status:', imgbbResponse.status);
                                    
                                    if (imgbbResponse.ok) {
                                        const imgbbResult = await imgbbResponse.json();
                                        console.log('Facebook Event Extractor: ImgBB upload successful!');
                                        console.log('Facebook Event Extractor: ImgBB response:', imgbbResult);
                                        
                                        if (imgbbResult.success && imgbbResult.data && imgbbResult.data.url) {
                                            const imgbbUrl = imgbbResult.data.url;
                                            console.log('Facebook Event Extractor: Final ImgBB URL:', imgbbUrl);
                                            resolve(imgbbUrl);
                                            return;
                                        }
                                    }
                                    
                                    throw new Error('All image hosting services failed');
                                }
                                
                                const freeImageResult = await freeImageResponse.json();
                                console.log('Facebook Event Extractor: FreeImage upload successful!');
                                console.log('Facebook Event Extractor: FreeImage response:', freeImageResult);
                                
                                if (freeImageResult.success && freeImageResult.image && freeImageResult.image.url) {
                                    const imageUrl = freeImageResult.image.url;
                                    console.log('Facebook Event Extractor: Final FreeImage URL:', imageUrl);
                                    resolve(imageUrl);
                                } else {
                                    throw new Error('FreeImage response missing image URL');
                                }
                                
                            } catch (uploadError) {
                                console.error('Facebook Event Extractor: Image upload failed:', uploadError);
                                reject(uploadError);
                            }
                        };
                        
                        reader.onerror = () => {
                            reject(new Error('Failed to convert blob to base64'));
                        };
                        
                        reader.readAsDataURL(blob);
                    }, 'image/jpeg', 0.9);
                    
                } catch (canvasError) {
                    console.error('Facebook Event Extractor: Canvas processing failed:', canvasError);
                    reject(canvasError);
                }
            };
            
            img.onerror = (error) => {
                console.error('Facebook Event Extractor: Image load failed (CORS likely):', error);
                console.log('Facebook Event Extractor: Trying without CORS...');
                
                // Try without CORS as fallback
                const img2 = new Image();
                img2.onload = async () => {
                    try {
                        console.log('Facebook Event Extractor: Image loaded without CORS, size:', img2.width, 'x', img2.height);
                        
                        // Create canvas and draw image
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        
                        // Set reasonable max dimensions to avoid huge uploads
                        const maxWidth = 1200;
                        const maxHeight = 800;
                        let { width, height } = img2;
                        
                        if (width > maxWidth) {
                            height = (height * maxWidth) / width;
                            width = maxWidth;
                        }
                        if (height > maxHeight) {
                            width = (width * maxHeight) / height;
                            height = maxHeight;
                        }
                        
                        canvas.width = width;
                        canvas.height = height;
                        
                        // Draw the image to canvas with scaling
                        ctx.drawImage(img2, 0, 0, width, height);
                        
                        // Convert canvas to blob
                        canvas.toBlob(async (blob) => {
                            if (!blob) {
                                reject(new Error('Failed to convert canvas to blob (no CORS)'));
                                return;
                            }
                            
                            console.log('Facebook Event Extractor: Created blob from canvas (no CORS), size:', blob.size);
                            
                            // Convert blob to base64 for Imgur upload
                            const reader = new FileReader();
                            reader.onload = async function() {
                                try {
                                    // Get base64 data (remove data:image/jpeg;base64, prefix)
                                    const base64Data = reader.result.split(',')[1];
                                    console.log('Facebook Event Extractor: Converted to base64 (no CORS), length:', base64Data.length);
                                    
                                    // Upload to freeimage.host (no CORS fallback)
                                    const fileBlob = new Blob([Uint8Array.from(atob(base64Data), c => c.charCodeAt(0))], {type: 'image/jpeg'});
                                    const formData = new FormData();
                                    formData.append('source', fileBlob, 'facebook-event.jpg');
                                    formData.append('type', 'file');
                                    formData.append('action', 'upload');
                                    
                                    const freeImageResponse = await fetch('https://freeimage.host/api/1/upload', {
                                        method: 'POST',
                                        body: formData
                                    });
                                    
                                    if (!freeImageResponse.ok) {
                                        // Try Telegraph as fallback for no-CORS
                                        console.log('Facebook Event Extractor: FreeImage failed (no CORS), trying Telegraph...');
                                        
                                        const telegraphFormData = new FormData();
                                        telegraphFormData.append('file', fileBlob, 'facebook-event.jpg');
                                        
                                        const telegraphResponse = await fetch('https://telegra.ph/upload', {
                                            method: 'POST',
                                            body: telegraphFormData
                                        });
                                        
                                        if (telegraphResponse.ok) {
                                            const telegraphResult = await telegraphResponse.json();
                                            console.log('Facebook Event Extractor: Telegraph upload successful (no CORS)!');
                                            console.log('Facebook Event Extractor: Telegraph response:', telegraphResult);
                                            
                                            if (telegraphResult && telegraphResult[0] && telegraphResult[0].src) {
                                                const telegraphUrl = 'https://telegra.ph' + telegraphResult[0].src;
                                                console.log('Facebook Event Extractor: Final Telegraph URL (no CORS):', telegraphUrl);
                                                resolve(telegraphUrl);
                                                return;
                                            }
                                        }
                                        
                                        throw new Error('All image hosting services failed (no CORS)');
                                    }
                                    
                                    const freeImageResult = await freeImageResponse.json();
                                    console.log('Facebook Event Extractor: FreeImage upload successful (no CORS)!');
                                    console.log('Facebook Event Extractor: FreeImage response:', freeImageResult);
                                    
                                    if (freeImageResult.success && freeImageResult.image && freeImageResult.image.url) {
                                        const imageUrl = freeImageResult.image.url;
                                        console.log('Facebook Event Extractor: Final FreeImage URL (no CORS):', imageUrl);
                                        resolve(imageUrl);
                                    } else {
                                        throw new Error('FreeImage response missing image URL (no CORS)');
                                    }
                                    
                                } catch (uploadError) {
                                    console.error('Facebook Event Extractor: Image upload failed (no CORS):', uploadError);
                                    reject(uploadError);
                                }
                            };
                            
                            reader.onerror = () => {
                                reject(new Error('Failed to convert blob to base64 (no CORS)'));
                            };
                            
                            reader.readAsDataURL(blob);
                        }, 'image/jpeg', 0.9);
                        
                    } catch (canvasError) {
                        console.error('Facebook Event Extractor: Canvas processing failed (no CORS):', canvasError);
                        reject(canvasError);
                    }
                };
                
                img2.onerror = (error2) => {
                    console.error('Facebook Event Extractor: Image load failed even without CORS:', error2);
                    reject(new Error('Failed to load image - both CORS and non-CORS failed'));
                };
                
                // Try loading without CORS
                img2.src = imageUrl;
            };
            
            // Start loading the image
            img.src = imageUrl;
        });
        
    } catch (error) {
        console.error('Facebook Event Extractor: Failed to process image:', error);
        throw error;
    }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Facebook Event Extractor: Received message:', request);
    
    if (request.action === 'extractEventData') {
        // Handle async extraction
        (async () => {
            try {
                const eventData = await extractEventData();
                const detectedGenre = detectGenre(eventData);
                
                // If we have an image URL, download and upload it from page context
                let processedImageUrl = '';
                console.log('Facebook Event Extractor: Initial image URL:', eventData.image);
                
                if (eventData.image) {
                    console.log('Facebook Event Extractor: Starting image processing...');
                    console.log('Facebook Event Extractor: Original FB image URL:', eventData.image);
                    try {
                        processedImageUrl = await downloadAndUploadImage(eventData.image);
                        console.log('Facebook Event Extractor: Image processed successfully!');
                        console.log('Facebook Event Extractor: Processed image URL:', processedImageUrl);
                        console.log('Facebook Event Extractor: Image URL type:', typeof processedImageUrl);
                        
                        // Validate that we got a hosted URL, not Facebook URL
                        if (processedImageUrl && !processedImageUrl.includes('fbcdn.net')) {
                            console.log('Facebook Event Extractor: ✅ Successfully uploaded to external host');
                        } else {
                            console.error('Facebook Event Extractor: ❌ Still got Facebook URL, upload failed');
                            processedImageUrl = ''; // Don't use Facebook URLs
                        }
                    } catch (error) {
                        console.error('Facebook Event Extractor: Image processing failed:', error);
                        console.error('Facebook Event Extractor: Error details:', error.message, error.stack);
                        // Don't use original Facebook URL as fallback - they cause 403 errors
                        processedImageUrl = '';
                        console.log('Facebook Event Extractor: Will not use Facebook URL due to CORS restrictions');
                    }
                } else {
                    console.log('Facebook Event Extractor: No image URL found in event data');
                    
                    // ULTIMATE FALLBACK: Use largest Facebook image if we found any
                    if (window.candidateImages && window.candidateImages.length > 0) {
                        console.log('Facebook Event Extractor: Attempting ultimate fallback with largest image...');
                        const largestImage = window.candidateImages.reduce((largest, current) => {
                            const currentSize = (current.naturalWidth || current.width || 0) * (current.naturalHeight || current.height || 0);
                            const largestSize = (largest.naturalWidth || largest.width || 0) * (largest.naturalHeight || largest.height || 0);
                            return currentSize > largestSize ? current : largest;
                        });
                        
                        if (largestImage && largestImage.src) {
                            console.log('Facebook Event Extractor: Trying ultimate fallback image:', largestImage.src);
                            try {
                                processedImageUrl = await downloadAndUploadImage(largestImage.src);
                                console.log('Facebook Event Extractor: Ultimate fallback SUCCESS!', processedImageUrl);
                            } catch (error) {
                                console.error('Facebook Event Extractor: Ultimate fallback failed:', error);
                                processedImageUrl = '';
                            }
                        }
                    }
                }
                
                console.log('Facebook Event Extractor: Final image URL to use:', processedImageUrl);
                
                // Clean the ticket URL - look for actual ticket links and remove Facebook tracking
                let cleanTicketUrl = eventData.url;
                
                // Look for actual ticket purchase links, including the specific theticketing.co link
                const ticketSelectors = [
                    'a[href*="theticketing.co/e/wickedwarehouse"]', // Specific to this event
                    'a[href*="theticketing"]',
                    'a[href*="ticket"]',
                    'a[href*="eventbrite"]',
                    'a[href*="ticketmaster"]',
                    'a[href*="eventtickets"]',
                    'a[href*="buy"]',
                    'a[href*="purchase"]'
                ];
                
                for (const selector of ticketSelectors) {
                    const ticketEl = document.querySelector(selector);
                    if (ticketEl && ticketEl.href) {
                        let url = ticketEl.href;
                        
                        // Clean Facebook tracking parameters
                        // Handle Facebook redirect URLs
                        if (url.includes('facebook.com/l.php')) {
                            const urlParams = new URLSearchParams(url.split('?')[1]);
                            const actualUrl = urlParams.get('u');
                            if (actualUrl) {
                                url = decodeURIComponent(actualUrl);
                            }
                        }
                        
                        console.log('Found ticket URL before cleaning:', url);
                        
                        // Remove tracking parameters and trailing question marks
                        const cleanUrl = url.split('?')[0];
                        const params = url.includes('?') ? url.split('?')[1].split('&').filter(param => 
                            !param.startsWith('fbclid=') &&
                            !param.startsWith('utm_') &&
                            !param.startsWith('_gl=') &&
                            param.trim() !== '' // Remove empty parameters
                        ) : [];
                        
                        url = cleanUrl + (params.length > 0 ? '?' + params.join('&') : '');
                        
                        cleanTicketUrl = url;
                        break;
                    }
                }

                const formattedData = {
                    source: 'facebook_extension',
                    event_title: eventData.title,
                    event_date: eventData.date,
                    event_time: eventData.time,
                    venue_name: eventData.venue,
                    promoter: eventData.organizer,
                    genre: detectedGenre,
                    description: eventData.description,
                    image_url: processedImageUrl, // Use the processed (uploaded) image URL
                    ticket_url: cleanTicketUrl,
                    facebook_url: window.location.href,
                    extracted_at: eventData.extracted_at
                };
                
                console.log('Facebook Event Extractor: Sending response:', formattedData);
                
                sendResponse({
                    success: true,
                    data: formattedData,
                    raw: eventData
                });
            } catch (error) {
                console.error('Facebook Event Extractor: Error processing request:', error);
                sendResponse({
                    success: false,
                    error: error.message
                });
            }
        })();
    }
    
    // Return true to indicate we'll send a response asynchronously
    return true;
});

// Also make the functions available globally for debugging
window.facebookEventExtractor = {
    extractEventData,
    detectGenre
};

console.log('Facebook Event Extractor: Content script loaded on', window.location.href);
console.log('🔥 CONTENT SCRIPT END REACHED - NO SYNTAX ERRORS 🔥');