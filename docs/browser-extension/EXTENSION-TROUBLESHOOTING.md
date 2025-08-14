# Chrome Extension Troubleshooting Guide

## ❌ "Could not establish connection. Receiving end does not exist."

This error typically occurs when the content script is not properly loaded or the extension needs refreshing.

### **Quick Fix Steps:**

#### **1. Reload Extension (Most Common Fix)**
```
1. Open new tab → chrome://extensions/
2. Find "Facebook Event Extractor"  
3. Click the refresh/reload icon ↻
4. Verify "Enabled" toggle is ON
5. Check for any error messages in red
```

#### **2. Refresh Facebook Page**
```
1. Go to Facebook event page (must be: facebook.com/events/123456789)
2. Press F5 or Ctrl+R to completely refresh
3. Wait for page to fully load (2-3 seconds)
4. Try extension again
```

#### **3. Verify Correct Page Type**
The extension ONLY works on specific Facebook event URLs:
- ✅ `https://facebook.com/events/123456789`
- ✅ `https://www.facebook.com/events/123456789` 
- ❌ `https://facebook.com/events/` (events listing)
- ❌ `https://facebook.com/events/discover` (discover page)
- ❌ `https://facebook.com/profile/events` (profile events)

#### **4. Check Extension Popup Debug**
```
1. Right-click extension icon → "Inspect popup"
2. Look for errors in Console tab
3. Should see "Ready to extract from Facebook event page"
4. If popup is blank, extension needs reload
```

#### **5. Check Content Script Loading**
```
1. On Facebook event page, press F12 → Console tab
2. Look for: "🔥 UPDATED CONTENT SCRIPT LOADED - VERSION 2.0 🔥"
3. If not present, extension didn't load properly
4. Reload extension and refresh page
```

### **Advanced Debugging:**

#### **Check Extension Permissions**
```
1. chrome://extensions/ → Facebook Event Extractor → Details
2. Verify permissions include:
   - facebook.com/*
   - www.facebook.com/*
   - localhost:*/*
3. If missing, reload extension
```

#### **Test Manual Content Script Injection**
```
1. On Facebook event page, press F12 → Console
2. Type: chrome.runtime.sendMessage({action: 'test'})
3. Should get response or proper error message
```

#### **Check Facebook URL Format**
The extension looks for this exact pattern: `/events/\d+/`
- Event ID must be numeric (no letters/special chars)
- Must not have query parameters that confuse detection

### **If Still Not Working:**

#### **Complete Reset:**
```
1. chrome://extensions/
2. Remove "Facebook Event Extractor" completely
3. Click "Load unpacked" 
4. Select: /Users/alexthip/Projects/local-music-events/docs/browser-extension/
5. Go to fresh Facebook event page
6. Try again
```

#### **Test with Sample Event:**
Try with a known working Facebook event URL format like:
`https://www.facebook.com/events/1234567890123456/`

### **Success Indicators:**

When working properly, you should see:
- ✅ Extension popup shows "Ready to extract from Facebook event page"  
- ✅ Console shows content script loaded message
- ✅ Click "Extract Event Data" → shows extraction progress
- ✅ Image detection logs appear in console
- ✅ Event data populates in popup textarea

### **Emergency Fallback:**

If extension completely fails:
1. Use **manual image input** field in popup
2. Right-click Facebook event image → "Copy image address"  
3. Paste URL in "🖼️ Image URL (optional)" field
4. Fill event details manually
5. Click "📤 Send to Import Review"

---

## 🎯 **Most Common Solution: Extension Reload**

**90% of connection errors are fixed by simply reloading the extension at chrome://extensions/**