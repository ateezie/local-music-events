# 🛠️ CORS Workarounds for Facebook Event Extractor

The browser security block (CORS) prevents the bookmarklet from sending data directly from Facebook to localhost. Here are **4 working solutions**:

## 🏆 **Option 1: Browser Extension (RECOMMENDED)**

**✅ Pros:** Most reliable, no CORS issues, professional  
**❌ Cons:** Requires loading as unpacked extension

### Installation:
1. **Open Chrome** → `chrome://extensions/`
2. **Enable** "Developer mode" (top right toggle)
3. **Click** "Load unpacked"
4. **Select** the `/docs/browser-extension/` folder
5. **Pin** the extension to toolbar

### Usage:
1. **Go** to any Facebook event page  
2. **Click** the extension icon
3. **Click** "Extract Event Data"
4. **Click** "Send to System" - works without CORS errors!

---

## ⚡ **Option 2: CORS Proxy Server**

**✅ Pros:** Works with existing bookmarklet, simple setup  
**❌ Cons:** Need to run additional server

### Setup:
```bash
cd /Users/alexthip/Projects/local-music-events/docs
node cors-proxy-server.js
```

### Updated Bookmarklet:
Use the bookmarklet from `/docs/facebook-bookmarklet-with-proxy.js` - it has both Direct and Proxy send options.

### Usage:
1. **Start proxy server** (see above)
2. **Use bookmarklet** on Facebook event page
3. **Click "Proxy Send"** instead of "Direct Send"

---

## 🚀 **Option 3: Disable CORS Temporarily**

**✅ Pros:** Makes original bookmarklet work perfectly  
**⚠️ Cons:** Security risk - only use for testing!

### macOS Setup:
```bash
# Run the script to open Chrome with CORS disabled
./docs/disable-cors-chrome.sh
```

### Manual Command:
```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --disable-web-security \
  --user-data-dir=/tmp/chrome-cors-disabled \
  https://facebook.com/events/
```

### Usage:
1. **Close all Chrome windows**
2. **Run the script** above
3. **Use original bookmarklet** - works without CORS errors
4. **Close this Chrome** when done (your normal Chrome is unaffected)

---

## 📋 **Option 4: Manual Copy/Paste (Fallback)**

**✅ Pros:** Always works, no setup required  
**❌ Cons:** Manual process

### Process:
1. **Use any bookmarklet** to extract data
2. **Click "Copy Data"** when CORS fails
3. **Go to** `http://localhost:3001/admin/import-review`
4. **Manually paste** the JSON data

---

## 🎯 **Which Option Should You Use?**

### **For Regular Use:**
- **Browser Extension** (Option 1) - Most reliable

### **For Quick Testing:**
- **CORS Proxy** (Option 2) - Easy setup with existing bookmarklet
- **Disable CORS** (Option 3) - Works immediately with original bookmarklet

### **As Backup:**
- **Manual Copy** (Option 4) - Always works

---

## 📁 **Files Created:**

```
docs/
├── browser-extension/          # Chrome extension (Option 1)
│   ├── manifest.json
│   ├── popup.html
│   ├── popup.js
│   └── content.js
├── cors-proxy-server.js        # Proxy server (Option 2)
├── disable-cors-chrome.sh      # CORS disable script (Option 3)
├── facebook-bookmarklet-with-proxy.js  # Updated bookmarklet
└── CORS-WORKAROUNDS.md         # This guide
```

---

## 🔧 **Testing Steps:**

1. **Make sure** your dev server is running: `npm run dev`
2. **Choose** one of the options above
3. **Go** to any Facebook event page
4. **Extract** event data
5. **Send** to system using your chosen method
6. **Check** `http://localhost:3001/admin/import-review` to see imported events

---

## 🛡️ **Security Notes:**

- **Browser Extension**: Safest option, only works on Facebook event pages
- **CORS Proxy**: Only runs locally, no external connections
- **Disable CORS**: ⚠️ **WARNING** - Only use for testing, close when done
- **Manual Copy**: No security concerns

Choose the option that best fits your workflow! The browser extension is recommended for regular use.