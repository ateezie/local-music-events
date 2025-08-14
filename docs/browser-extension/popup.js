// Popup script for the browser extension

document.addEventListener('DOMContentLoaded', function() {
    const extractBtn = document.getElementById('extract');
    const sendBtn = document.getElementById('send');
    const copyBtn = document.getElementById('copy');
    const statusDiv = document.getElementById('status');
    const eventDataTextarea = document.getElementById('eventData');
    
    let extractedData = null;

    // Check if we're on a Facebook event page or an edit page
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        const currentTab = tabs[0];
        const url = currentTab.url;
        
        const isEventPage = (url.includes('facebook.com/events/') || url.includes('www.facebook.com/events/')) &&
                           url.match(/\/events\/\d+/) &&
                           !url.includes('/events/?') &&
                           !url.includes('/events/discover') &&
                           !url.includes('/events/calendar');
                           
        const isEditPage = url && url.includes('localhost') && url.includes('/admin/events/') && url.includes('/edit');
        
        if (isEventPage) {
            showStatus('Ready to extract from Facebook event page', 'info');
        } else if (isEditPage) {
            // Check if we have extracted data from storage
            chrome.storage.local.get(['extractedEventData'], function(result) {
                if (result.extractedEventData) {
                    extractedData = result.extractedEventData;
                    eventDataTextarea.value = JSON.stringify(extractedData, null, 2);
                    eventDataTextarea.style.display = 'block';
                    sendBtn.style.display = 'block';
                    sendBtn.textContent = '📝 Populate Form';
                    copyBtn.style.display = 'block';
                    showStatus('Ready to populate form with extracted data!', 'success');
                } else {
                    showStatus('Extract data from Facebook event page first, then return here', 'info');
                }
            });
            extractBtn.disabled = true;
            extractBtn.textContent = '📝 On Edit Page';
        } else {
            showStatus('Navigate to Facebook event page to extract, or edit page to populate', 'error');
            extractBtn.disabled = true;
            extractBtn.textContent = 'Wrong Page Type';
        }
    });

    extractBtn.addEventListener('click', function() {
        extractBtn.textContent = '📊 Extracting...';
        extractBtn.disabled = true;
        
        // Send message to content script
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const tabId = tabs[0].id;
            
            // First try to send message to existing content script
            chrome.tabs.sendMessage(tabId, {action: 'extractEventData'}, function(response) {
                if (chrome.runtime.lastError) {
                    // Content script not loaded, try to inject it
                    console.log('Content script not found, injecting...');
                    
                    chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        files: ['content.js']
                    }, function() {
                        if (chrome.runtime.lastError) {
                            showStatus('❌ Failed to inject content script: ' + chrome.runtime.lastError.message, 'error');
                            extractBtn.textContent = '📊 Extract Event Data';
                            extractBtn.disabled = false;
                            return;
                        }
                        
                        // Wait a moment for script to load, then try again
                        setTimeout(() => {
                            chrome.tabs.sendMessage(tabId, {action: 'extractEventData'}, function(response) {
                                handleExtractResponse(response);
                            });
                        }, 500);
                    });
                } else {
                    handleExtractResponse(response);
                }
            });
        });
        
        function handleExtractResponse(response) {
            if (chrome.runtime.lastError) {
                showStatus('❌ Error: ' + chrome.runtime.lastError.message, 'error');
                extractBtn.textContent = '📊 Extract Event Data';
                extractBtn.disabled = false;
                return;
            }
            
            if (response && response.success) {
                extractedData = response.data;
                
                // Save to Chrome storage for use on edit pages
                chrome.storage.local.set({extractedEventData: extractedData});
                
                eventDataTextarea.value = JSON.stringify(extractedData, null, 2);
                eventDataTextarea.style.display = 'block';
                sendBtn.style.display = 'block';
                copyBtn.style.display = 'block';
                
                // Show image upload confirmation
                showImageUploadStatus(extractedData);
                
                // Show manual image section
                document.getElementById('imageSection').style.display = 'block';
                
                // Pre-populate image URL if found
                const imageUrlInput = document.getElementById('imageUrl');
                if (extractedData.image_url) {
                    imageUrlInput.value = extractedData.image_url;
                } else {
                    imageUrlInput.placeholder = 'Right-click event image → Copy image address → paste here';
                }
                
                showStatus(`✅ Extracted: "${response.data.event_title || 'Untitled Event'}"`, 'success');
                extractBtn.textContent = '🔄 Re-extract';
                extractBtn.disabled = false;
            } else {
                showStatus('❌ Failed to extract event data from this page', 'error');
                extractBtn.textContent = '📊 Extract Event Data';
                extractBtn.disabled = false;
            }
        }
    });

    sendBtn.addEventListener('click', function() {
        if (!extractedData) {
            showStatus('No data to send. Extract first.', 'error');
            return;
        }

        sendBtn.textContent = '📤 Sending...';
        sendBtn.disabled = true;

        // Check if user is on an admin edit page
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const activeTab = tabs[0];
            console.log('Extension: Current tab URL:', activeTab.url);
            
            const isEditPage = activeTab.url && activeTab.url.includes('localhost') && activeTab.url.includes('/admin/events/') && activeTab.url.includes('/edit');
            console.log('Extension: Is edit page?', isEditPage);
            
            // ALWAYS use import system - it's more reliable and handles images properly
            console.log('Extension: Using import system for reliable image handling');
            sendToImportSystem();
        });
        
        function populateEditForm(tab) {
            // Inject script to populate the edit form
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: (data) => {
                    console.log('Chrome Extension: Populating form with data:', data);
                    
                    // Wait for form to be ready
                    function waitForForm() {
                        return new Promise(resolve => {
                            const checkForm = () => {
                                const titleInput = document.querySelector('input[type="text"]');
                                if (titleInput) {
                                    resolve(true);
                                } else {
                                    setTimeout(checkForm, 100);
                                }
                            };
                            checkForm();
                        });
                    }
                    
                    return waitForForm().then(() => {
                        let populated = 0;
                        
                        // 1. Populate title field
                        if (data.event_title) {
                            const titleInputs = document.querySelectorAll('input[type="text"]');
                            for (const input of titleInputs) {
                                const label = input.previousElementSibling;
                                if (label && label.textContent && label.textContent.includes('Event Title')) {
                                    console.log('Chrome Extension: Setting title to:', data.event_title);
                                    input.value = data.event_title;
                                    input.dispatchEvent(new Event('input', { bubbles: true }));
                                    input.dispatchEvent(new Event('change', { bubbles: true }));
                                    populated++;
                                    break;
                                }
                            }
                        }
                        
                        // 2. Populate description field
                        if (data.description) {
                            const descTextarea = document.querySelector('textarea');
                            if (descTextarea) {
                                console.log('Chrome Extension: Setting description');
                                descTextarea.value = data.description;
                                descTextarea.dispatchEvent(new Event('input', { bubbles: true }));
                                descTextarea.dispatchEvent(new Event('change', { bubbles: true }));
                                populated++;
                            }
                        }
                        
                        // 3. Populate venue name
                        if (data.venue_name) {
                            const venueInputs = document.querySelectorAll('input[type="text"]');
                            for (const input of venueInputs) {
                                const label = input.previousElementSibling;
                                if (label && label.textContent && label.textContent.includes('Venue Name')) {
                                    console.log('Chrome Extension: Setting venue to:', data.venue_name);
                                    input.value = data.venue_name;
                                    input.dispatchEvent(new Event('input', { bubbles: true }));
                                    input.dispatchEvent(new Event('change', { bubbles: true }));
                                    populated++;
                                    break;
                                }
                            }
                        }
                        
                        // 4. Handle image population - image is already processed by content script
                        if (data.image_url) {
                            console.log('Chrome Extension: Setting banner image to:', data.image_url);
                            console.log('Chrome Extension: Image URL starts with:', data.image_url.substring(0, 50));
                            
                            // The content script has already downloaded and uploaded the image
                            // So we can directly use the processed URL
                            const imageEvent = new CustomEvent('populateEventImage', {
                                detail: { imageUrl: data.image_url }
                            });
                            console.log('Chrome Extension: Dispatching populateEventImage event');
                            window.dispatchEvent(imageEvent);
                            
                            // Also set global variable as backup
                            window.extensionImageData = {
                                imageUrl: data.image_url,
                                timestamp: Date.now()
                            };
                            console.log('Chrome Extension: Set window.extensionImageData');
                            
                            // Additional fallback - set a pending image URL directly
                            window.pendingExtensionImageUrl = data.image_url;
                            console.log('Chrome Extension: Set window.pendingExtensionImageUrl for immediate fallback');
                            
                            populated++;
                        } else {
                            console.log('Chrome Extension: No image_url found in data');
                        }
                        
                        console.log('Chrome Extension: Populated', populated, 'fields');
                        return { 
                            success: true, 
                            populated: populated,
                            hasImage: !!data.image_url,
                            imageUrl: data.image_url 
                        };
                    });
                },
                args: [extractedData]
            }, (results) => {
                if (chrome.runtime.lastError) {
                    showStatus('❌ Failed to populate form: ' + chrome.runtime.lastError.message, 'error');
                    sendBtn.textContent = '❌ Failed';
                    sendBtn.disabled = false;
                } else {
                    const result = results[0].result;
                    console.log('Chrome Extension: Population result:', result);
                    showStatus(`✅ Populated ${result.populated} fields${result.hasImage ? ' + image' : ''}!`, 'success');
                    sendBtn.textContent = '✅ Populated!';
                    sendBtn.style.background = '#28a745';
                    
                    setTimeout(() => {
                        sendBtn.textContent = '📤 Send to Import Review';
                        sendBtn.disabled = false;
                        sendBtn.style.background = '';
                    }, 3000);
                }
            });
        }
        
        function sendToImportSystem() {
            // Check if user provided a manual image URL
            const imageUrlInput = document.getElementById('imageUrl');
            const manualImageUrl = imageUrlInput ? imageUrlInput.value.trim() : '';
            
            // Use manual image URL if provided, otherwise use extracted one
            const finalData = { ...extractedData };
            if (manualImageUrl) {
                console.log('Extension: Using manual image URL:', manualImageUrl);
                finalData.image_url = manualImageUrl;
            }
            
            console.log('Extension: Sending to import system with data:', finalData);
            
            // Get the current tab's origin to build the API URL dynamically
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                const currentOrigin = new URL(tabs[0].url).origin;
                // Try multiple possible ports for development
                const possibleUrls = [
                    currentOrigin.includes('localhost') ? currentOrigin : null,
                    'http://localhost:3000',
                    'http://localhost:3001', 
                    'http://localhost:3002',
                    'http://localhost:3003'
                ].filter(Boolean);
                
                console.log('Extension: Trying API URLs:', possibleUrls);
                
                // Try each URL until one works
                async function tryUrls() {
                    for (const apiUrl of possibleUrls) {
                        try {
                            console.log(`Extension: Trying ${apiUrl}/api/events/import-from-email`);
                            
                            const response = await fetch(`${apiUrl}/api/events/import-from-email`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(finalData)
                            });
                            
                            if (response.ok) {
                                console.log(`Extension: Success with ${apiUrl}`);
                                return response.json();
                            } else {
                                console.log(`Extension: Failed with ${apiUrl}:`, response.status);
                            }
                        } catch (error) {
                            console.log(`Extension: Error with ${apiUrl}:`, error.message);
                        }
                    }
                    throw new Error('All API endpoints failed');
                }
                
                tryUrls()
                .then(data => {
                    if (data.success) {
                        showStatus('✅ Successfully sent to import system!', 'success');
                        sendBtn.textContent = '✅ Sent!';
                        sendBtn.style.background = '#28a745';
                        
                        setTimeout(() => {
                            sendBtn.textContent = '📤 Send to Import Review';
                            sendBtn.disabled = false;
                            sendBtn.style.background = '';
                        }, 3000);
                    } else {
                        showStatus('❌ Failed to send to system: ' + (data.error || 'Unknown error'), 'error');
                        sendBtn.textContent = '❌ Failed';
                        sendBtn.disabled = false;
                    }
                })
                .catch(error => {
                    showStatus('❌ Network error: ' + error.message, 'error');
                    sendBtn.textContent = '❌ Network Error';
                    sendBtn.disabled = false;
                });
            });
        }
    });

    copyBtn.addEventListener('click', function() {
        eventDataTextarea.select();
        document.execCommand('copy');
        
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    });

    function showStatus(message, type) {
        statusDiv.textContent = message;
        statusDiv.className = `status ${type}`;
        statusDiv.style.display = 'block';
    }

    function showImageUploadStatus(data) {
        const statusDiv = document.getElementById('imageUploadStatus');
        const iconDiv = document.getElementById('imageStatusIcon');
        const textDiv = document.getElementById('imageStatusText');
        const serviceDiv = document.getElementById('imageServiceInfo');
        const linkDiv = document.getElementById('imagePreviewLink');
        
        if (data.image_upload_status === 'success' && data.image_url) {
            // Success - show green confirmation
            statusDiv.style.backgroundColor = '#d4edda';
            statusDiv.style.border = '1px solid #c3e6cb';
            statusDiv.style.color = '#155724';
            
            iconDiv.textContent = '✅ Image Upload Successful';
            iconDiv.style.color = '#155724';
            
            textDiv.textContent = `Image uploaded to ${data.image_service_used}`;
            
            if (data.image_service_used === 'File.io') {
                serviceDiv.textContent = '📡 Hosted on File.io - temporary file hosting (expires after 14 days)';
                linkDiv.innerHTML = `<a href="${data.image_url}" target="_blank" style="color: #007bff; text-decoration: none; font-size: 11px;">🔗 View uploaded image</a>`;
            } else if (data.image_service_used === 'Catbox.moe') {
                serviceDiv.textContent = '🌐 Hosted on Catbox.moe - reliable permanent file hosting';
                linkDiv.innerHTML = `<a href="${data.image_url}" target="_blank" style="color: #007bff; text-decoration: none; font-size: 11px;">🔗 View uploaded image</a>`;
            } else if (data.image_service_used === 'Local Storage') {
                serviceDiv.textContent = '💾 Saved to local storage (external services unavailable)';
                linkDiv.innerHTML = `<span style="color: #666; font-size: 11px;">🔗 Image saved locally</span>`;
            }
        } else {
            // Failed - show red warning
            statusDiv.style.backgroundColor = '#f8d7da';
            statusDiv.style.border = '1px solid #f5c6cb';
            statusDiv.style.color = '#721c24';
            
            iconDiv.textContent = '❌ Image Upload Failed';
            iconDiv.style.color = '#721c24';
            
            if (data.original_facebook_image) {
                textDiv.textContent = 'Facebook image detected but upload failed';
                serviceDiv.textContent = 'You can manually copy the image URL below if needed';
                linkDiv.innerHTML = `<span style="color: #666; font-size: 11px;">Original: ${data.original_facebook_image.substring(0, 50)}...</span>`;
            } else {
                textDiv.textContent = 'No image detected on this Facebook event';
                serviceDiv.textContent = 'You can manually add an image URL in the field below';
                linkDiv.textContent = '';
            }
        }
        
        statusDiv.style.display = 'block';
    }
});