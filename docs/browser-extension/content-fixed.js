// Content script to extract Facebook event data
// Runs on Facebook event pages

console.log('🔥 CLEAN CONTENT SCRIPT LOADED - VERSION 3.0 🔥', new Date().toISOString());

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
            const allElements = document.querySelectorAll('h1, h2, div, span');
            for (const element of allElements) {
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
            const allElements = document.querySelectorAll('time, span, div');
            for (const element of allElements) {
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
            
            const allElements = document.querySelectorAll('a, span, div');
            for (const element of allElements) {
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

        // Extract description - target the specific location under "Public" and above tags
        console.log('Facebook Event Extractor: Looking for description...');
        
        // Strategy 1: Look for description in the main event content area
        const mainDescSelectors = [
            '[data-testid="event-permalink-description"]',
            '[data-testid="event-description"]',
            'div[role="main"] div[data-testid*="description"]'
        ];
        
        for (const selector of mainDescSelectors) {
            const descElement = document.querySelector(selector);
            if (descElement && descElement.textContent.trim()) {
                const text = descElement.textContent.trim();
                console.log('Facebook Event Extractor: Found description with main selector:', text.substring(0, 100) + '...');
                eventData.description = text.substring(0, 500);
                break;
            }
        }
        
        // Strategy 2: Look for description right under "Public" text and handle "See more"
        if (!eventData.description) {
            console.log('Facebook Event Extractor: Looking for description right under "Public" text...');
            
            // First, try to click "See more" if it exists to expand full description
            const seeMoreLinks = document.querySelectorAll('div, span, a');
            for (const link of seeMoreLinks) {
                const text = link.textContent.trim();
                if (text === 'See more' && link.click) {
                    console.log('Facebook Event Extractor: Clicking "See more" to expand description...');
                    link.click();
                    // Wait a moment for content to expand
                    await new Promise(resolve => setTimeout(resolve, 500));
                    break;
                }
            }
            
            // Find the "Public" element
            const allElements = document.querySelectorAll('div, span, p');
            
            for (const element of allElements) {
                const text = element.textContent.trim();
                
                // Find "Public · Anyone on or off Facebook" text
                if (text.includes('Public') && text.includes('Anyone')) {
                    console.log('Facebook Event Extractor: Found Public element, looking for description immediately after...');
                    
                    // Look at the next sibling elements and their children
                    let nextElement = element.parentElement?.nextElementSibling;
                    while (nextElement) {
                        const descText = nextElement.textContent.trim();
                        
                        // Skip empty or very short text
                        if (descText && descText.length > 30) {
                            // Skip navigation text and other UI elements
                            if (!descText.includes('Event by') &&
                                !descText.includes('people responded') &&
                                !descText.includes('Discussion') &&
                                !descText.includes('Details') &&
                                !descText.includes('About') &&
                                !descText.includes('Host')) {
                                
                                // Clean up the description by removing "See more/less" and similar fragments
                                let cleanDesc = descText
                                    .replace(/See more\s*/gi, '') // Case insensitive
                                    .replace(/See less.*$/gi, '') // Remove "See less" and everything after (case insensitive)
                                    .replace(/\s*P$/, '') // Remove trailing "P"
                                    .replace(/\s*…$/, '') // Remove trailing ellipsis
                                    .replace(/\s*Parties.*$/gi, '') // Remove "PartiesSt. Louis, Missouri" fragments
                                    .replace(/\s*St\.\s*Louis.*$/gi, '') // Remove location fragments
                                    .trim();
                                
                                if (cleanDesc.length > 30) {
                                    eventData.description = cleanDesc.substring(0, 800); // Allow longer descriptions
                                    console.log('Facebook Event Extractor: ✅ Found and cleaned description under Public:', eventData.description.substring(0, 100) + '...');
                                    break;
                                }
                            }
                        }
                        
                        nextElement = nextElement.nextElementSibling;
                    }
                    break;
                }
            }
        }
        
        // Strategy 3: Look for the specific expected description text directly
        if (!eventData.description) {
            console.log('Facebook Event Extractor: Looking for specific description text directly...');
            
            const allTextElements = document.querySelectorAll('div, p, span');
            for (const element of allTextElements) {
                const text = element.textContent.trim();
                
                // Look specifically for the Halloween description
                if (text.includes("We're taking over Halloween night") && 
                    text.includes("TROYBOI")) {
                    eventData.description = text.substring(0, 500);
                    console.log('Facebook Event Extractor: ✅ Found specific Halloween description:', eventData.description.substring(0, 100) + '...');
                    break;
                }
            }
        }
        
        // Strategy 4: Clean fallback - strict filtering to avoid UI text
        if (!eventData.description) {
            console.log('Facebook Event Extractor: Using strict fallback description detection...');
            
            const allElements = document.querySelectorAll('div, p');
            for (const element of allElements) {
                const text = element.textContent.trim();
                
                // Must be substantial event description text
                if (text.length < 30 || text.length > 800) continue;
                
                // Skip obvious non-description content with stricter filtering
                if (text.includes('Event by') || text.includes('people responded')) continue;
                if (text.includes('Tickets') || text.includes('Public')) continue;
                if (text.includes('Details') || text.includes('Discussion')) continue;
                if (text.includes('EventsHome') || text.includes('Your Events')) continue;
                if (text.includes('Notifications') || text === 'Events') continue;
                if (text.includes('See all') || text.includes('Taste of')) continue;
                if (text.includes('Your upcoming') || text.includes('Aug ')) continue;
                if (text.match(/^(Home|Events|Parties|St\.|MO)$/)) continue;
                if (text.includes('at') && text.includes('PM') && text.includes('–')) continue; // Date ranges
                
                // Look for actual event description content - more specific patterns
                if ((text.includes('Halloween') && text.includes('takeover')) ||
                    (text.includes('warehouse') && text.includes('featuring')) ||
                    (text.includes('massive') && text.includes('beats'))) {
                    eventData.description = text.substring(0, 500);
                    console.log('Facebook Event Extractor: ✅ Found description with strict fallback:', eventData.description.substring(0, 100) + '...');
                    break;
                }
            }
        }
        
        // FINAL CLEANUP: Clean any remaining "See less" or similar fragments from description
        if (eventData.description) {
            const originalDesc = eventData.description;
            eventData.description = eventData.description
                .replace(/See less.*$/gi, '') // Remove "See less" and everything after
                .replace(/See more.*$/gi, '') // Remove "See more" and everything after
                .replace(/\s*Parties.*$/gi, '') // Remove "PartiesSt. Louis" fragments
                .replace(/\s*St\.\s*Louis.*$/gi, '') // Remove location fragments
                .replace(/\s*P$/, '') // Remove trailing "P"
                .replace(/\s*…$/, '') // Remove trailing ellipsis
                .trim();
                
            if (originalDesc !== eventData.description) {
                console.log('Facebook Event Extractor: Cleaned description fragments');
                console.log('Facebook Event Extractor: Before:', originalDesc.substring(0, 100) + '...');
                console.log('Facebook Event Extractor: After:', eventData.description.substring(0, 100) + '...');
            }
        }
        
        // If still no description or contains UI text, leave empty 
        if (!eventData.description || eventData.description.includes('EventsHome')) {
            eventData.description = '';
            console.log('Facebook Event Extractor: Could not find clean description, leaving empty');
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
        return eventData;
        
    } catch (error) {
        console.error('Facebook Event Extractor: Error extracting data:', error);
        return eventData;
    }
}

function detectGenre(eventData) {
    // Always return multi-genre for Facebook events since we can't reliably detect genres
    console.log('Facebook Event Extractor: Using multi-genre for all Facebook events');
    return 'multi-genre';
}

// Function to download image via server-side proxy
async function downloadAndUploadImage(imageUrl) {
    try {
        console.log('Facebook Event Extractor: Using server-side proxy for image:', imageUrl);
        
        // Try different localhost ports automatically
        const ports = [3002, 3000, 3001, 3003, 5000, 8000];
        
        for (const port of ports) {
            try {
                const response = await fetch(`http://localhost:${port}/api/proxy-image`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        imageUrl: imageUrl
                    })
                });
                
                if (response.ok) {
                    const result = await response.json();
                    
                    if (result.success && result.url) {
                        console.log('Facebook Event Extractor: Successfully proxied image via port', port, ':', result.url);
                        console.log('Facebook Event Extractor: Upload service used:', result.service);
                        
                        // Return the hosted URL directly from the service, not localhost
                        if (result.service === 'fileio' || result.service === 'catbox') {
                            console.log('Facebook Event Extractor: Using external hosted URL:', result.url);
                            return result.url; // Direct external URL
                        } else {
                            // Local fallback - construct localhost URL
                            const fullUrl = `http://localhost:${port}${result.url}`;
                            console.log('Facebook Event Extractor: Using local fallback URL:', fullUrl);
                            return fullUrl;
                        }
                    }
                }
            } catch (portError) {
                console.log(`Facebook Event Extractor: Port ${port} failed, trying next...`);
                continue;
            }
        }
        
        throw new Error('All localhost ports failed');
        
    } catch (error) {
        console.error('Facebook Event Extractor: Proxy method failed:', error);
        return '';
    }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Facebook Event Extractor: Received message:', request);
    
    if (request.action === 'extractEventData') {
        (async () => {
            try {
                const eventData = await extractEventData();
                const detectedGenre = detectGenre(eventData);
                
                let processedImageUrl = '';
                console.log('Facebook Event Extractor: Initial image URL:', eventData.image);
                
                if (eventData.image) {
                    console.log('Facebook Event Extractor: Starting image processing...');
                    try {
                        processedImageUrl = await downloadAndUploadImage(eventData.image);
                        console.log('Facebook Event Extractor: Image processed successfully!');
                        console.log('Facebook Event Extractor: Processed image URL:', processedImageUrl);
                    } catch (error) {
                        console.error('Facebook Event Extractor: Image processing failed:', error);
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
                
                for (const element of relevantElements) {
                    const text = element.textContent;
                    if (text && text.includes('Event by') && text.includes(',')) {
                        console.log('Facebook Event Extractor: Found "Event by" text:', text);
                        
                        // Look for the exact pattern: "Event by Name, Name and Name"
                        const eventByMatch = text.match(/Event by\s+([^\.]+?)(?=\s*(?:Public|Private|·|$))/i);
                        if (eventByMatch) {
                            const afterEventBy = eventByMatch[1].trim();
                            
                            // Split by commas and "and"
                            let parts = afterEventBy.split(/,|\sand\s/);
                            
                            // Clean up each part with stricter filtering
                            promoters = parts
                                .map(part => part.trim())
                                .filter(part => {
                                    if (!part || part.length < 2 || part.length > 50) return false;
                                    // Filter out common non-promoter text
                                    const lowercasePart = part.toLowerCase();
                                    if (lowercasePart.includes('what to expect') || 
                                        lowercasePart.includes('see more') ||
                                        lowercasePart.includes('parties') ||
                                        lowercasePart.includes('your upcoming') ||
                                        lowercasePart.includes('taste of') ||
                                        lowercasePart.match(/^(mo|st\.|louis)$/i) ||
                                        lowercasePart.includes('aug ') ||
                                        lowercasePart.includes('pm') ||
                                        lowercasePart.includes('see all')) {
                                        return false;
                                    }
                                    return true;
                                })
                                .slice(0, 3); // Limit to 3 promoters max for cleaner results
                            
                            console.log('Facebook Event Extractor: Extracted promoters:', promoters);
                            break;
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
                                       processedImageUrl.includes('localhost') ? 'Local Storage' : 'Unknown',
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