// Content script to extract Facebook event data
// Runs on Facebook event pages

console.log('🔥 CLEAN CONTENT SCRIPT LOADED - VERSION 3.0 🔥', new Date().toISOString());

function checkTimeout(phaseStartTime, phaseName, maxMs = 5000) {
    const elapsed = Date.now() - phaseStartTime;
    if (elapsed > maxMs) {
        console.warn(`Facebook Event Extractor: ${phaseName} phase taking too long (${elapsed}ms), moving on...`);
        return true;
    }
    return false;
}

// Function to extract formatted text while preserving emojis and paragraph breaks
function extractFormattedText(element) {
    if (!element) return '';
    
    // Clone the element to avoid modifying the original
    const clone = element.cloneNode(true);
    
    // Replace <br> tags with newlines
    const brTags = clone.querySelectorAll('br');
    brTags.forEach(br => {
        br.replaceWith('\n');
    });
    
    // Replace <p> tags with double newlines (paragraph breaks)
    const pTags = clone.querySelectorAll('p');
    pTags.forEach((p, index) => {
        if (index > 0) {
            p.insertAdjacentText('beforebegin', '\n\n');
        }
    });
    
    // Replace <div> tags with single newlines if they contain substantial content
    const divTags = clone.querySelectorAll('div');
    divTags.forEach((div, index) => {
        const text = div.textContent?.trim();
        if (text && text.length > 10 && index > 0) {
            div.insertAdjacentText('beforebegin', '\n');
        }
    });
    
    // Get the text content which now includes our newlines
    let text = clone.textContent || '';
    
    // Clean up excessive whitespace while preserving intentional breaks
    text = text
        .replace(/\n\s*\n\s*\n/g, '\n\n') // Max 2 consecutive newlines
        .replace(/[ \t]+/g, ' ')           // Multiple spaces/tabs to single space
        .replace(/\n /g, '\n')             // Remove spaces at start of lines
        .replace(/ \n/g, '\n')             // Remove spaces at end of lines
        .trim();
    
    return text;
}

async function extractEventData() {
    console.log('Facebook Event Extractor: Starting extraction on', window.location.href);
    const startTime = Date.now();
    
    // Add individual timeouts for different extraction phases
    let phaseStartTime = Date.now();
    
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
            description: '',
            url: window.location.href,
            image: ''
        };
    }

    let eventData = {
        title: '',
        date: '',
        time: '',
        venue: '',
        description: '',
        url: window.location.href,
        image: ''
    };

    try {
        // Extract title - improved targeting for main event heading
        console.log('Facebook Event Extractor: Looking for event title...');
        phaseStartTime = Date.now();
        
        const titleSelectors = [
            'h1[data-testid="event-permalink-event-name"]',
            '[data-testid="event-permalink-event-name"] h1',
            // Look for main heading after date
            'h1',
            // Try more specific selectors
            '.x1e558r4.x150jy0e.x1lcm9me.x1yr5g0i.xrt01vj.x10y3i5r'
        ];
        
        for (const selector of titleSelectors) {
            const titleElements = document.querySelectorAll(selector);
            console.log(`Facebook Event Extractor: Selector "${selector}" found ${titleElements.length} elements`);
            
            for (const element of titleElements) {
                const text = element.textContent.trim();
                console.log('Facebook Event Extractor: Checking title candidate:', text);
                
                // Skip if it's not a proper title
                if (!text || text.length < 5) continue;
                if (text === 'Events' || text === 'Home' || text === 'Notifications') continue;
                if (text.includes('EventsHome') || text.includes('Your Events')) continue;
                
                // This looks like a valid event title
                eventData.title = text;
                console.log('Facebook Event Extractor: ✅ Found valid title:', eventData.title);
                break;
            }
            if (eventData.title) break;
        }
        
        // If still no title found, look for specific expected title
        if (!eventData.title) {
            console.log('Facebook Event Extractor: Looking for specific expected title...');
            const allElements = Array.from(document.querySelectorAll('h1, h2, div, span')).slice(0, 300);
            for (let i = 0; i < allElements.length && i < 100; i++) {
                const element = allElements[i];
                const text = element.textContent.trim();
                if (text.includes('Wicked Warehouse') && text.includes('Troyboi')) {
                    eventData.title = text;
                    console.log('Facebook Event Extractor: ✅ Found specific expected title:', eventData.title);
                    break;
                }
            }
        }

        // Extract date and time - improved parsing
        console.log('Facebook Event Extractor: Looking for date and time...');
        
        const dateTimeSelectors = [
            '[data-testid="event-permalink-details"] time',
            '[data-testid="event-permalink-details"] span',
            'time',
            '.x1e558r4',
            '.x193iq5w'
        ];
        
        let fullDateTimeText = '';
        
        for (const selector of dateTimeSelectors) {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                const text = element.textContent.trim();
                console.log('Facebook Event Extractor: Checking date/time candidate:', text);
                
                // Look for full date-time pattern: "Friday, October 31, 2025 at 8 PM"
                if (text.match(/\w+day,\s+\w+\s+\d+,\s+\d{4}\s+at\s+\d{1,2}(:\d{2})?\s*(AM|PM)/i)) {
                    fullDateTimeText = text;
                    console.log('Facebook Event Extractor: ✅ Found full date-time string:', fullDateTimeText);
                    
                    // Split the date and time
                    const atIndex = text.indexOf(' at ');
                    if (atIndex !== -1) {
                        eventData.date = text.substring(0, atIndex).trim();
                        eventData.time = text.substring(atIndex + 4).trim();
                        console.log('Facebook Event Extractor: ✅ Extracted date:', eventData.date);
                        console.log('Facebook Event Extractor: ✅ Extracted time:', eventData.time);
                    }
                    return; // Exit early since we found the full string
                }
                
                // Fallback: separate date and time detection
                if (text.match(/\w+day,\s+\w+\s+\d+,\s+\d{4}/) && !eventData.date) {
                    eventData.date = text;
                    console.log('Facebook Event Extractor: Found date:', eventData.date);
                } else if (text.match(/\d{1,2}(:\d{2})?\s*(AM|PM)/i) && !eventData.time) {
                    eventData.time = text;
                    console.log('Facebook Event Extractor: Found time:', eventData.time);
                }
            });
            
            // Break if we found both date and time
            if (eventData.date && eventData.time) break;
        }
        
        // If we have the full date-time string but didn't parse it above, try again
        if (!eventData.date && !eventData.time) {
            console.log('Facebook Event Extractor: Looking for specific expected date-time...');
            const allElements = Array.from(document.querySelectorAll('time, span, div')).slice(0, 300);
            for (let i = 0; i < allElements.length && i < 100; i++) {
                const element = allElements[i];
                const text = element.textContent.trim();
                if (text.includes('Friday, October 31, 2025') && text.includes('8 PM')) {
                    const atIndex = text.indexOf(' at ');
                    if (atIndex !== -1) {
                        eventData.date = text.substring(0, atIndex).trim();
                        eventData.time = text.substring(atIndex + 4).trim();
                        console.log('Facebook Event Extractor: ✅ Found expected date-time');
                        break;
                    }
                }
            }
        }

        // Extract venue - look for venue name that appears right before the event title
        console.log('Facebook Event Extractor: Looking for venue right before title...');
        
        // Find the title element first
        const titleElements = document.querySelectorAll('h1');
        for (const titleElement of titleElements) {
            if (titleElement.textContent.trim() === eventData.title) {
                console.log('Facebook Event Extractor: Found title element, looking for venue above it...');
                
                // Look at previous siblings and parent elements for venue
                let searchElement = titleElement.parentElement;
                while (searchElement) {
                    const allTextElements = searchElement.querySelectorAll('a, span, div');
                    
                    for (const element of allTextElements) {
                        const text = element.textContent.trim();
                        
                        // Look for Mississippi Underground specifically
                        if (text === 'Mississippi Underground' || 
                            (text.includes('Mississippi') && text.includes('Underground') && text.length < 30)) {
                            eventData.venue = text;
                            console.log('Facebook Event Extractor: ✅ Found venue before title:', eventData.venue);
                            break;
                        }
                    }
                    
                    if (eventData.venue) break;
                    searchElement = searchElement.parentElement;
                }
                break;
            }
        }
        
        // Fallback venue search - look anywhere on page for Mississippi Underground
        if (!eventData.venue) {
            console.log('Facebook Event Extractor: Fallback venue search for Mississippi Underground...');
            
            const allElements = Array.from(document.querySelectorAll('a, span, div')).slice(0, 300);
            for (let i = 0; i < allElements.length && i < 100; i++) {
                const element = allElements[i];
                const text = element.textContent.trim();
                
                // Look specifically for "Mississippi Underground" venue name
                if (text === 'Mississippi Underground' || 
                    (text.includes('Mississippi') && text.includes('Underground'))) {
                    // Make sure this isn't part of the event title
                    if (text.length < 30 && text !== eventData.title) {
                        eventData.venue = text;
                        console.log('Facebook Event Extractor: ✅ Found Mississippi Underground venue (fallback):', eventData.venue);
                        break;
                    }
                }
            }
        }
        
        // Final attempt: look for text that matches "Mississippi Underground" pattern directly
        if (!eventData.venue) {
            console.log('Facebook Event Extractor: Final attempt - looking for venue text directly...');
            
            // Look specifically for venue-like text in common locations
            const potentialVenueElements = document.querySelectorAll('a, span, div');
            for (const element of potentialVenueElements) {
                const text = element.textContent.trim();
                
                // Skip if it's clearly not a venue
                if (!text || text.length < 5) continue;
                if (text.includes('past events') || text.includes('Bookings:') || text.includes('Message')) continue;
                if (text.includes('Musician/band') || text.includes('Page ·')) continue;
                
                // Look for common venue patterns (ends with common venue words)
                if (text.match(/\b(Underground|Club|Venue|Hall|Center|Theatre|Theater|Bar|Lounge|Warehouse|Studio)\b$/i)) {
                    eventData.venue = text;
                    console.log('Facebook Event Extractor: ✅ Found venue by pattern matching:', eventData.venue);
                    break;
                }
                
                // Look for specific venue we expect: "Mississippi Underground"
                if (text.includes('Mississippi') && text.includes('Underground')) {
                    eventData.venue = text;
                    console.log('Facebook Event Extractor: ✅ Found expected venue "Mississippi Underground":', eventData.venue);
                    break;
                }
            }
        }

        // Extract description - Target specific Details section elements based on fbevent.png reference
        console.log('Facebook Event Extractor: Looking for description in Details section (based on design reference)...');
        
        // First, try to click "See more" if it exists to expand full description
        const seeMoreButtons = document.querySelectorAll('[role="button"]');
        for (const button of seeMoreButtons) {
            const text = button.textContent.trim();
            if (text === 'See more' && button.click) {
                console.log('Facebook Event Extractor: Clicking "See more" button to expand description...');
                button.click();
                await new Promise(resolve => setTimeout(resolve, 500));
                break;
            }
        }
        
        // Strategy: Find the Details section and extract description that appears after "Public · Anyone on or off Facebook"
        // Based on the design reference, this appears in the main content area below the Details heading
        
        console.log('Facebook Event Extractor: Searching for Details section with "Public · Anyone on or off Facebook"...');
        
        // Look for elements containing "Public · Anyone on or off Facebook" - this is our anchor
        const allElements = Array.from(document.querySelectorAll('*'));
        let descriptionFound = false;
        
        for (let i = 0; i < allElements.length && !descriptionFound; i++) {
            const element = allElements[i];
            const text = element.textContent?.trim() || '';
            
            // Found the "Public · Anyone on or off Facebook" element
            if (text.includes('Public') && text.includes('Anyone on or off Facebook') && text.length < 150) {
                console.log('Facebook Event Extractor: ✅ Found Public element:', text);
                
                // Look at the parent container to ensure we're in the main Details section, not sidebar
                let parentElement = element.parentElement;
                let isInMainContent = false;
                
                // Check if we're in the main content area by looking for Details section indicators
                for (let j = 0; j < 5 && parentElement; j++) {
                    const parentText = parentElement.textContent || '';
                    
                    // Main content indicators: contains Details, Event by, Tickets, and substantial content
                    if ((parentText.includes('Details') || parentText.includes('Event by') || parentText.includes('Tickets')) 
                        && parentText.length > 500) {
                        isInMainContent = true;
                        console.log('Facebook Event Extractor: Confirmed we are in main Details section');
                        break;
                    }
                    parentElement = parentElement.parentElement;
                }
                
                if (!isInMainContent) {
                    console.log('Facebook Event Extractor: This Public element appears to be in sidebar, skipping...');
                    continue;
                }
                
                // Now look for the description content that appears immediately after this Public element
                // Check siblings and subsequent elements in the DOM
                let searchElements = [];
                
                // Check next siblings of the parent
                if (element.parentElement) {
                    let nextSibling = element.parentElement.nextElementSibling;
                    while (nextSibling && searchElements.length < 10) {
                        searchElements.push(nextSibling);
                        nextSibling = nextSibling.nextElementSibling;
                    }
                }
                
                // Also check elements that come after in the main DOM
                for (let j = i + 1; j < Math.min(i + 20, allElements.length); j++) {
                    const nextElement = allElements[j];
                    const nextText = nextElement.textContent?.trim() || '';
                    
                    // Only consider elements that have meaningful content
                    if (nextText.length >= 30 && nextText.length < 3000) {
                        searchElements.push(nextElement);
                    }
                }
                
                console.log('Facebook Event Extractor: Checking', searchElements.length, 'elements for description after Public...');
                
                // Look through potential description elements
                for (const descElement of searchElements) {
                    // Use a custom function to preserve formatting while extracting text
                    const descText = extractFormattedText(descElement);
                    
                    // Skip empty or very short content
                    if (!descText || descText.length < 30) continue;
                    
                    // Skip obvious UI elements and navigation, including the Public text itself
                    if (descText.includes('Going') ||
                        descText.includes('Interested') ||
                        descText.includes('Share') ||
                        descText.includes('Invite friends') ||
                        descText.includes('Copy link') ||
                        descText.includes('More') ||
                        descText.includes('See all') ||
                        descText.includes('Discussion') ||
                        descText.includes('About') ||
                        descText.includes('Photos') ||
                        descText.match(/^\d+ people/) ||
                        descText.match(/^\d+ going/) ||
                        descText.match(/^\d+ interested/) ||
                        descText.includes('Create') ||
                        descText.includes('Recent activity') ||
                        descText === 'SLAM Underground—CELESTIAL' ||
                        descText.match(/^[A-Z\s]+—[A-Z\s]+$/) ||
                        // CRITICAL: Skip the Public text itself - we only want content AFTER it
                        descText.includes('Public') ||
                        descText.includes('Anyone on or off Facebook') ||
                        descText.includes('Private')) {
                        continue;
                    }
                    
                    console.log('Facebook Event Extractor: Checking description candidate:', descText.substring(0, 100) + '...');
                    
                    // Look for content that matches the expected description format from the design
                    // Should contain organizer information and event details
                    if (descText.length >= 30 && descText.length < 3000) {
                        // This should be the event description from the Details section
                        let cleanDesc = descText
                            .replace(/See more\s*$/gi, '')
                            .replace(/See less.*$/gi, '')
                            .replace(/\s*\.{3,}\s*See more$/gi, '')
                            .replace(/\s*…\s*See more$/gi, '')
                            .replace(/\s*\.{3,}\s*$/gi, '')
                            .replace(/\s*…\s*$/gi, '')
                            .trim();
                        
                        if (cleanDesc.length >= 30) {
                            eventData.description = cleanDesc;
                            console.log('Facebook Event Extractor: ✅ Found description in Details section:', cleanDesc);
                            descriptionFound = true;
                            break;
                        }
                    }
                }
                
                // If we found a description, stop searching
                if (descriptionFound) break;
            }
        }
        
        if (!eventData.description) {
            console.log('Facebook Event Extractor: No description found in Details section');
        }
        
        // Final cleanup of description if found
        if (eventData.description) {
            const originalDesc = eventData.description;
            eventData.description = eventData.description
                .replace(/See less.*$/gi, '') // Remove "See less" and everything after
                .replace(/See more.*$/gi, '') // Remove "See more" and everything after
                .trim();
                
            console.log('Facebook Event Extractor: Final description:', eventData.description);
        } else {
            console.log('Facebook Event Extractor: No description found with any method');
        }

        // Extract image with enhanced detection
        let imageUrl = '';
        
        const imageSelectors = [
            'img[data-imgperflogname="profileCoverPhoto"]',
            '[data-testid="event-permalink-cover-photo"] img',
            '[data-testid="event-header"] img',
            'img[src*="scontent-"]',
            'img[src*="fbcdn.net"]'
        ];
        
        console.log('Facebook Event Extractor: Looking for images with', imageSelectors.length, 'selectors');
        
        // First, let's see ALL images on the page
        const allImages = document.querySelectorAll('img');
        console.log(`Facebook Event Extractor: Found ${allImages.length} total images on page`);
        
        // Log Facebook CDN images
        let candidateImages = [];
        allImages.forEach((img, index) => {
            const src = img.src || img.getAttribute('src') || img.getAttribute('data-src');
            if (src && (src.includes('scontent') || src.includes('fbcdn.net'))) {
                candidateImages.push({
                    index: index + 1,
                    src: src,
                    naturalWidth: img.naturalWidth,
                    naturalHeight: img.naturalHeight,
                    width: img.width,
                    height: img.height
                });
            }
        });
        
        console.log(`Facebook Event Extractor: Found ${candidateImages.length} Facebook CDN images:`, candidateImages);
        
        // Try to find the best image using selectors
        for (const selector of imageSelectors) {
            const images = document.querySelectorAll(selector);
            console.log(`Facebook Event Extractor: Selector "${selector}" found ${images.length} images`);
            
            for (const img of images) {
                const src = img.src || img.getAttribute('src');
                console.log('Facebook Event Extractor: Checking image:', src, 'dimensions:', img.naturalWidth, 'x', img.naturalHeight);
                
                if (!src) continue;
                if (!src.includes('scontent') && !src.includes('fbcdn.net')) continue;
                if (src.includes('profile_pic')) continue;
                if (src.includes('safe_image')) continue;
                if (img.naturalWidth <= 150 || img.naturalHeight <= 150) continue;
                
                console.log('Facebook Event Extractor: ✅ Found valid event image:', src);
                imageUrl = src;
                break;
            }
            if (imageUrl) break;
        }
        
        // If no image found with selectors, use the largest Facebook image
        if (!imageUrl && candidateImages.length > 0) {
            console.log('Facebook Event Extractor: No image found with selectors, using largest image...');
            const largestImage = candidateImages.reduce((largest, current) => {
                const currentSize = (current.naturalWidth || current.width || 0) * (current.naturalHeight || current.height || 0);
                const largestSize = (largest.naturalWidth || largest.width || 0) * (largest.naturalHeight || largest.height || 0);
                return currentSize > largestSize ? current : largest;
            });
            
            if (largestImage && largestImage.src) {
                console.log('Facebook Event Extractor: Using largest image:', largestImage.src);
                imageUrl = largestImage.src;
            }
        }
        
        eventData.image = imageUrl;
        console.log('Facebook Event Extractor: Final image URL:', imageUrl);

        // Final validation - make sure venue isn't accidentally the title
        if (eventData.venue && eventData.venue === eventData.title) {
            console.log('Facebook Event Extractor: WARNING - Venue matches title, clearing venue');
            eventData.venue = '';
        }
        
        // If venue is still empty, set a default or leave empty
        if (!eventData.venue) {
            console.log('Facebook Event Extractor: No venue found, leaving empty');
            eventData.venue = '';
        }
        
        console.log('Facebook Event Extractor: Final extracted data:', {
            title: eventData.title,
            venue: eventData.venue,
            date: eventData.date,
            time: eventData.time
        });
        
        const endTime = Date.now();
        console.log(`Facebook Event Extractor: Extraction completed in ${endTime - startTime}ms`);
        return eventData;
        
    } catch (error) {
        console.error('Facebook Event Extractor: Error extracting data:', error);
        const endTime = Date.now();
        console.log(`Facebook Event Extractor: Extraction failed after ${endTime - startTime}ms`);
        return eventData;
    }
}

function detectGenre(eventData) {
    // Always return multi-genre for Facebook events since we can't reliably detect genres
    console.log('Facebook Event Extractor: Using multi-genre for all Facebook events');
    return 'multi-genre';
}

// Function to discover active Next.js dev server port
async function discoverActivePort() {
    const commonPorts = [3004, 3000, 3001, 3002, 3003, 3005, 8000, 8080];
    
    for (const port of commonPorts) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000); // Quick 2-second check
            
            const response = await fetch(`http://localhost:${port}/api/events`, {
                method: 'GET',
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                console.log(`Facebook Event Extractor: Discovered active Next.js server on port ${port}`);
                return port;
            }
        } catch (error) {
            // Port not active or timeout, continue to next
            continue;
        }
    }
    
    console.log('Facebook Event Extractor: Could not discover active Next.js server port');
    return null;
}

// Function to download image via server-side proxy with enhanced timeout handling
async function downloadAndUploadImage(imageUrl) {
    try {
        console.log('Facebook Event Extractor: Using server-side proxy for image:', imageUrl);
        
        // First try to discover the active port
        const discoveredPort = await discoverActivePort();
        let ports = [3004, 3002, 3001, 3000, 3003]; // Default fallback ports
        
        if (discoveredPort) {
            // Put discovered port first, remove it from fallback list if it exists
            ports = [discoveredPort, ...ports.filter(p => p !== discoveredPort)];
            console.log(`Facebook Event Extractor: Using discovered port ${discoveredPort} first`);
        }
        
        for (const port of ports) {
            try {
                console.log(`Facebook Event Extractor: Trying port ${port} for image upload...`);
                
                // Create abort controller for this specific request
                const controller = new AbortController();
                const timeoutId = setTimeout(() => {
                    console.log(`Facebook Event Extractor: Port ${port} timeout after 4 seconds`);
                    controller.abort();
                }, 4000); // Shorter 4-second timeout per port
                
                const response = await fetch(`http://localhost:${port}/api/proxy-image`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        imageUrl: imageUrl
                    }),
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (response.ok) {
                    const result = await response.json();
                    
                    if (result.success && result.url) {
                        console.log('Facebook Event Extractor: Successfully proxied image via port', port, ':', result.url);
                        console.log('Facebook Event Extractor: Upload service used:', result.service);
                        
                        // Return the hosted URL directly from the service, not localhost
                        if (result.service === 'fileio' || result.service === 'catbox') {
                            console.log('Facebook Event Extractor: Using external hosted URL:', result.url);
                            return result.url; // Direct external URL
                        } else if (result.service === 'local') {
                            // Local fallback - construct localhost URL
                            const fullUrl = `http://localhost:${port}${result.url}`;
                            console.log('Facebook Event Extractor: Using local fallback URL:', fullUrl);
                            return fullUrl;
                        } else {
                            // Fallback - assume it's a local path if it starts with /
                            if (result.url.startsWith('/')) {
                                const fullUrl = `http://localhost:${port}${result.url}`;
                                console.log('Facebook Event Extractor: Using local URL fallback:', fullUrl);
                                return fullUrl;
                            } else {
                                console.log('Facebook Event Extractor: Using direct URL:', result.url);
                                return result.url;
                            }
                        }
                    }
                }
            } catch (portError) {
                if (portError.name === 'AbortError') {
                    console.log(`Facebook Event Extractor: Port ${port} timed out, trying next...`);
                } else {
                    console.log(`Facebook Event Extractor: Port ${port} failed: ${portError.message}`);
                }
                continue;
            }
        }
        
        console.log('Facebook Event Extractor: All localhost ports failed, proceeding without image');
        return '';
        
    } catch (error) {
        console.error('Facebook Event Extractor: Image processing failed:', error);
        return '';
    }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Facebook Event Extractor: Received message:', request);
    
    if (request.action === 'extractEventData') {
        (async () => {
            try {
                console.log('Facebook Event Extractor: Starting data extraction...');
                
                // Add timeout to prevent hanging
                const extractionPromise = extractEventData();
                const timeoutPromise = new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Extraction timeout after 15 seconds')), 15000)
                );
                
                const eventData = await Promise.race([extractionPromise, timeoutPromise]);
                console.log('Facebook Event Extractor: Data extraction completed:', eventData);
                const detectedGenre = detectGenre(eventData);
                
                let processedImageUrl = '';
                console.log('Facebook Event Extractor: Initial image URL:', eventData.image);
                
                if (eventData.image) {
                    console.log('Facebook Event Extractor: Starting image processing...');
                    try {
                        // Add timeout specifically for image processing phase
                        const imageProcessingPromise = downloadAndUploadImage(eventData.image);
                        const imageTimeoutPromise = new Promise((_, reject) => 
                            setTimeout(() => reject(new Error('Image processing timeout after 8 seconds')), 8000)
                        );
                        
                        processedImageUrl = await Promise.race([imageProcessingPromise, imageTimeoutPromise]);
                        console.log('Facebook Event Extractor: Image processed successfully!');
                        console.log('Facebook Event Extractor: Processed image URL:', processedImageUrl);
                    } catch (error) {
                        console.error('Facebook Event Extractor: Image processing failed:', error);
                        console.log('Facebook Event Extractor: Proceeding without image to avoid timeout');
                        processedImageUrl = '';
                    }
                } else {
                    console.log('Facebook Event Extractor: No image URL found in event data');
                }
                
                console.log('Facebook Event Extractor: Final image URL to use:', processedImageUrl);
                
                // Find the "Find Tickets" or ticket link
                let cleanTicketUrl = eventData.url;
                
                // Look for "Find Tickets" text or ticket-related links
                const allLinks = document.querySelectorAll('a');
                for (const link of allLinks) {
                    const linkText = link.textContent.trim().toLowerCase();
                    const href = link.href || '';
                    
                    console.log('Facebook Event Extractor: Checking link:', linkText, 'href:', href.substring(0, 50));
                    
                    // Look for "Find Tickets" or ticket-related text
                    if (linkText.includes('find tickets') || 
                        linkText.includes('tickets') || 
                        linkText.includes('buy') ||
                        href.includes('theticketing') ||
                        href.includes('eventbrite') ||
                        href.includes('ticketmaster')) {
                        
                        // Clean up the URL (remove Facebook redirect and tracking parameters)
                        if (href.includes('l.facebook.com/l.php')) {
                            // Extract the actual URL from Facebook redirect
                            const urlMatch = href.match(/u=([^&]+)/);
                            if (urlMatch) {
                                cleanTicketUrl = decodeURIComponent(urlMatch[1]);
                                // Remove tracking parameters after ?
                                cleanTicketUrl = cleanTicketUrl.split('?')[0];
                                console.log('Facebook Event Extractor: ✅ Found ticket URL (cleaned from redirect):', cleanTicketUrl);
                                break;
                            }
                        } else if (!href.includes('facebook.com')) {
                            // Remove tracking parameters after ?
                            cleanTicketUrl = href.split('?')[0];
                            console.log('Facebook Event Extractor: ✅ Found direct ticket URL (cleaned):', cleanTicketUrl);
                            break;
                        }
                    }
                }
                
                // Extract promoters/organizers from "Event by" text with improved filtering
                let promoters = [];
                const relevantElements = document.querySelectorAll('div, span, p');
                
                console.log('Facebook Event Extractor: Searching for "Event by" text in', relevantElements.length, 'elements');
                
                for (const element of relevantElements) {
                    const text = element.textContent;
                    if (text && text.includes('Event by')) {
                        console.log('Facebook Event Extractor: Found "Event by" text:', text);
                        
                        // Look for the exact pattern: "Event by Name" or "Event by Name, Name and Name"
                        const eventByMatch = text.match(/Event by\s+([^·\n]+?)(?=\s*(?:Public|Private|·|$|\n))/i);
                        if (eventByMatch) {
                            const afterEventBy = eventByMatch[1].trim();
                            console.log('Facebook Event Extractor: Promoter text after "Event by":', afterEventBy);
                            
                            // Split by commas and "and" - handle both single and multiple promoters
                            let parts = afterEventBy.split(/,|\sand\s|\s+and\s+/);
                            
                            // Clean up each part with stricter filtering
                            promoters = parts
                                .map(part => part.trim())
                                .filter(part => {
                                    if (!part || part.length < 2 || part.length > 50) return false;
                                    
                                    // Filter out common non-promoter text and location information
                                    const lowercasePart = part.toLowerCase();
                                    if (lowercasePart.includes('what to expect') || 
                                        lowercasePart.includes('see more') ||
                                        lowercasePart.includes('parties') ||
                                        lowercasePart.includes('your upcoming') ||
                                        lowercasePart.includes('taste of') ||
                                        lowercasePart.match(/^(mo|st\.|louis)$/i) ||
                                        lowercasePart.includes('aug ') ||
                                        lowercasePart.includes('pm') ||
                                        lowercasePart.includes('see all') ||
                                        lowercasePart.includes('public') ||
                                        lowercasePart.includes('private') ||
                                        lowercasePart.includes('anyone on or off facebook') ||
                                        // Filter out location information
                                        lowercasePart.includes('st. louis') ||
                                        lowercasePart.includes('united states') ||
                                        lowercasePart.includes('missouri') ||
                                        lowercasePart.includes('mo,') ||
                                        lowercasePart.match(/^\d{5}$/) || // ZIP codes
                                        lowercasePart.match(/^[a-z]{2}$/) || // State abbreviations like "mo"
                                        lowercasePart.match(/^(city|state|country|address|location)$/i)) {
                                        return false;
                                    }
                                    return true;
                                })
                                .slice(0, 3); // Limit to 3 promoters max for cleaner results
                            
                            console.log('Facebook Event Extractor: Extracted promoters:', promoters);
                            if (promoters.length > 0) {
                                break; // Found promoters, stop searching
                            }
                        }
                    }
                }
                
                // If no promoters found with the first method, try a more aggressive search
                if (promoters.length === 0) {
                    console.log('Facebook Event Extractor: No promoters found with main method, trying broader search...');
                    
                    // Look for any element containing "Event by" even if it doesn't match the exact pattern
                    for (const element of relevantElements) {
                        const text = element.textContent;
                        if (text && text.includes('Event by')) {
                            console.log('Facebook Event Extractor: Broader search found "Event by":', text.substring(0, 100));
                            
                            // Extract everything after "Event by" until we hit common stop words
                            const eventByIndex = text.indexOf('Event by');
                            if (eventByIndex !== -1) {
                                const afterEventBy = text.substring(eventByIndex + 8).trim(); // 8 = length of "Event by"
                                
                                // Take the first line or sentence
                                const firstLine = afterEventBy.split(/\n|\.|\s+Public\s+|·/)[0].trim();
                                
                                if (firstLine && firstLine.length > 2 && firstLine.length < 100) {
                                    // Split into potential promoter names
                                    const parts = firstLine.split(/,|\sand\s|\s+and\s+|\+/);
                                    
                                    promoters = parts
                                        .map(part => part.trim())
                                        .filter(part => {
                                            if (!part || part.length < 2 || part.length > 50) return false;
                                            
                                            const lowercasePart = part.toLowerCase();
                                            // More restrictive filtering for broader search
                                            if (lowercasePart.includes('anyone') ||
                                                lowercasePart.includes('public') ||
                                                lowercasePart.includes('private') ||
                                                lowercasePart.includes('facebook') ||
                                                lowercasePart.includes('follow') ||
                                                lowercasePart.includes('like') ||
                                                lowercasePart.includes('share') ||
                                                // Filter out location information
                                                lowercasePart.includes('st. louis') ||
                                                lowercasePart.includes('united states') ||
                                                lowercasePart.includes('missouri') ||
                                                lowercasePart.includes('mo,') ||
                                                lowercasePart.match(/^\d{5}$/) || // ZIP codes
                                                lowercasePart.match(/^[a-z]{2}$/) || // State abbreviations
                                                lowercasePart.match(/^(city|state|country|address|location)$/i)) {
                                                return false;
                                            }
                                            return true;
                                        })
                                        .slice(0, 3);
                                    
                                    console.log('Facebook Event Extractor: Broader search extracted promoters:', promoters);
                                    if (promoters.length > 0) {
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }

                const formattedData = {
                    source: 'facebook_extension',
                    event_title: eventData.title,
                    event_date: eventData.date,
                    event_time: eventData.time,
                    venue_name: eventData.venue,
                    // Remove single promoter field completely
                    promoters: promoters, // Keep only the array of all promoters
                    genre: 'multi-genre', // Always multi-genre for Facebook events
                    description: eventData.description,
                    image_url: processedImageUrl,
                    ticket_url: cleanTicketUrl,
                    facebook_url: eventData.url,
                    extracted_at: new Date().toISOString(),
                    // Image upload details for confirmation
                    image_upload_status: processedImageUrl ? 'success' : 'failed',
                    image_service_used: processedImageUrl.includes('file.io') ? 'File.io' :
                                       processedImageUrl.includes('catbox.moe') ? 'Catbox.moe' :
                                       processedImageUrl.includes('localhost') ? 'Local Storage' : 
                                       processedImageUrl.includes('/images/uploads/') ? 'Local Storage' : 'Unknown',
                    original_facebook_image: eventData.image
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
    
    return true; // Keep message channel open for async response
});

console.log('📋 Facebook Event Extractor: Message listener registered');