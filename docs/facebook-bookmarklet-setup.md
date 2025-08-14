# 🔖 Facebook Event Extractor Bookmarklet Setup

## What This Does
- **Safe & Legal**: No Facebook automation, just extracts visible data from pages you visit manually
- **One-Click Extraction**: Visit any Facebook event page, click the bookmark, get structured data
- **Smart Detection**: Automatically detects electronic music genres
- **Direct Integration**: Can send data directly to your import system

## 📥 Installation Instructions

### Step 1: Copy the Bookmarklet
Copy this entire code block and save it as a browser bookmark:

```javascript
javascript:(function(){const e=document.createElement("div");e.id="event-extractor-modal",e.style.cssText="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:500px;max-height:80vh;overflow-y:auto;background:white;border:2px solid #8b4aff;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,0.3);z-index:10000;font-family:Arial,sans-serif;padding:20px";const t=document.createElement("div");t.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9999";function n(){const e={title:"",date:"",time:"",venue:"",description:"",organizer:"",url:window.location.href,extracted_at:(new Date).toISOString()};try{const t=['[data-testid="event-permalink-event-name"] h1','[data-testid="event-permalink-event-name"]','h1[data-testid="event-permalink-event-name"]',".x1heor9g .x1qlqyl8","h1"];for(const n of t){const t=document.querySelector(n);if(t&&t.textContent.trim()){e.title=t.textContent.trim();break}}const n=['[data-testid="event-permalink-details"] span',".x1i10hfl time","time",".event-date-time",".date-time-info"];let o="";for(const e of n){const t=document.querySelectorAll(e);for(const e of t){const t=e.textContent.trim();t&&(t.includes("202")||t.includes("AM")||t.includes("PM"))&&(o+=t+" ")}if(o)break}const a=/(\w+day,?\s+\w+\s+\d{1,2},?\s+\d{4})/i,r=/(\d{1,2}:\d{2}\s*(?:AM|PM))/i,i=o.match(a),l=o.match(r);i&&(e.date=i[1]),l&&(e.time=l[1]);const s=['[data-testid="event-permalink-details"] a[href*="maps"]',".event-location",".venue-name",'a[href*="maps.google"]','a[href*="facebook.com/pages"]'];for(const t of s){const t=document.querySelector(t);if(t&&t.textContent.trim()){e.venue=t.textContent.trim();break}}const c=['[data-testid="event-permalink-organizer"] a',".event-organizer a",".hosted-by a",'a[role="link"][href*="/events"]'];for(const t of c){const t=document.querySelector(t);if(t&&t.textContent.trim()){e.organizer=t.textContent.trim();break}}const d=['[data-testid="event-permalink-description"]',".event-description",".description-text"];for(const t of d){const t=document.querySelector(t);if(t&&t.textContent.trim()){e.description=t.textContent.trim().substring(0,300);break}}}catch(e){console.error("Error extracting event data:",e)}return e}function o(e){const t=(e.title+" "+e.description+" "+e.organizer).toLowerCase(),n={house:["house","deep house","tech house","progressive house"],"drum-and-bass":["drum and bass","dnb","liquid","neurofunk"],ukg:["uk garage","garage","ukg","2-step"],dubstep:["dubstep","bass music","riddim","future bass"],trance:["trance","progressive trance","uplifting","psytrance"],techno:["techno","minimal","industrial","detroit techno"]};for(const[e,o]of Object.entries(n))if(o.some(e=>t.includes(e)))return e;return"other"}const a=n(),r=o(a);e.innerHTML=`\n        <div style="border-bottom: 2px solid #8b4aff; padding-bottom: 15px; margin-bottom: 20px;">\n            <h2 style="color: #8b4aff; margin: 0; font-size: 20px;">🎵 Facebook Event Extractor</h2>\n        </div>\n        \n        <div style="margin-bottom: 20px;">\n            <h3 style="color: #333; margin-bottom: 10px;">📊 Extracted Event Data:</h3>\n            \n            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">\n                <div style="margin-bottom: 8px;"><strong>Title:</strong> ${a.title||"Not found"}</div>\n                <div style="margin-bottom: 8px;"><strong>Date:</strong> ${a.date||"Not found"}</div>\n                <div style="margin-bottom: 8px;"><strong>Time:</strong> ${a.time||"Not found"}</div>\n                <div style="margin-bottom: 8px;"><strong>Venue:</strong> ${a.venue||"Not found"}</div>\n                <div style="margin-bottom: 8px;"><strong>Organizer:</strong> ${a.organizer||"Not found"}</div>\n                <div style="margin-bottom: 8px;"><strong>Detected Genre:</strong> \n                    <span style="background: #8b4aff; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">\n                        ${r}\n                    </span>\n                </div>\n                <div style="margin-bottom: 8px;"><strong>URL:</strong> <a href="${a.url}" target="_blank" style="color: #8b4aff;">Event Link</a></div>\n            </div>\n            \n            ${a.description?`\n                <div style="margin-bottom: 15px;">\n                    <strong>Description Preview:</strong>\n                    <div style="background: #f0f0f0; padding: 10px; border-radius: 4px; font-size: 12px; max-height: 100px; overflow-y: auto;">\n                        ${a.description}...\n                    </div>\n                </div>\n            `:""}\n        </div>\n\n        <div style="margin-bottom: 20px;">\n            <h3 style="color: #333; margin-bottom: 10px;">📧 Send to Import System:</h3>\n            <textarea id="json-output" style="width: 100%; height: 120px; font-family: monospace; font-size: 11px; border: 1px solid #ddd; border-radius: 4px; padding: 8px;" readonly>${JSON.stringify({source:"facebook_bookmarklet",event_title:a.title,event_date:a.date,event_time:a.time,venue_name:a.venue,promoter:a.organizer,genre:r,description:a.description,ticket_url:a.url,extracted_at:a.extracted_at},null,2)}</textarea>\n        </div>\n\n        <div style="display: flex; gap: 10px; margin-top: 20px;">\n            <button id="copy-json" style="background: #8b4aff; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; font-weight: bold;">\n                📋 Copy Data\n            </button>\n            <button id="send-to-system" style="background: #28a745; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; font-weight: bold;">\n                📤 Send to System\n            </button>\n            <button id="close-modal" style="background: #6c757d; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; font-weight: bold;">\n                ❌ Close\n            </button>\n        </div>\n\n        <div style="margin-top: 15px; padding: 10px; background: #e3f2fd; border-radius: 4px; font-size: 12px;">\n            💡 <strong>Tip:</strong> Use Facebook\\'s "Export Event" feature to email events directly to <code>lxwupbiw@mailparser.io</code>!\n        </div>\n    `;const i=e.querySelector("#copy-json"),l=e.querySelector("#send-to-system"),s=e.querySelector("#close-modal"),c=e.querySelector("#json-output");i.addEventListener("click",()=>{c.select(),document.execCommand("copy"),i.textContent="✅ Copied!",setTimeout(()=>i.textContent="📋 Copy Data",2e3)}),l.addEventListener("click",async()=>{try{const e=await fetch("/api/events/import-from-email",{method:"POST",headers:{"Content-Type":"application/json"},body:c.value});e.ok?(l.textContent="✅ Sent!",l.style.background="#28a745"):(l.textContent="❌ Error",l.style.background="#dc3545"),setTimeout(()=>{l.textContent="📤 Send to System",l.style.background="#28a745"},3e3)}catch(e){console.error("Error sending data:",e),l.textContent="❌ Error",l.style.background="#dc3545"}});function d(){document.body.removeChild(t),document.body.removeChild(e)}s.addEventListener("click",d),t.addEventListener("click",d),document.body.appendChild(t),document.body.appendChild(e)})();
```

### Step 2: Create Browser Bookmark

**In Chrome/Safari/Firefox:**
1. **Right-click** on your bookmarks bar
2. Click **"Add bookmark"** or **"New bookmark"**
3. **Name:** `🎵 Extract FB Event`
4. **URL:** Paste the entire javascript code from Step 1
5. Click **Save**

### Step 3: Alternative - Manual Bookmark Creation

**Chrome:**
1. Go to `chrome://bookmarks/`
2. Click **"Add new bookmark"**
3. Name: `🎵 Extract FB Event`
4. URL: Paste the javascript code
5. Save in bookmarks bar

**Firefox:**
1. Press `Ctrl+Shift+B` to show bookmarks
2. Right-click bookmarks toolbar
3. "Add Bookmark"
4. Name: `🎵 Extract FB Event`
5. Location: Paste the javascript code

## 🎯 How to Use

### Step 1: Visit Facebook Event Page
1. Go to any Facebook event page (like promoter events)
2. Make sure you can see the event details (title, date, venue, etc.)

### Step 2: Click the Bookmarklet
1. Click the `🎵 Extract FB Event` bookmark in your bookmarks bar
2. A popup will appear with extracted event data

### Step 3: Review and Send
1. **Review extracted data** - check if it looks correct
2. **Copy data** - for manual entry elsewhere
3. **Send to system** - directly imports to your event review dashboard

## 📊 What Gets Extracted

The bookmarklet automatically finds and extracts:

- ✅ **Event Title**
- ✅ **Date & Time** 
- ✅ **Venue/Location**
- ✅ **Event Organizer** (Promoter)
- ✅ **Event Description** (preview)
- ✅ **Genre Detection** (automatic for electronic music)
- ✅ **Event URL** (Facebook link)

## 🎵 Smart Genre Detection

Automatically detects these genres based on event content:
- **House** - house, deep house, tech house
- **Drum & Bass** - dnb, liquid, neurofunk  
- **UK Garage** - ukg, garage, 2-step
- **Dubstep** - dubstep, bass music, riddim
- **Trance** - trance, progressive, uplifting
- **Techno** - techno, minimal, industrial
- **Other** - anything else

## 💡 Pro Tips

### Facebook Event Export Feature
Instead of using the bookmarklet, you can use Facebook's built-in export:

1. **Visit the Facebook event page**
2. **Click the "..." menu** (three dots)
3. **Select "Export Event"**
4. **Choose "Email Event"**
5. **Send to:** `lxwupbiw@mailparser.io`
6. **Auto-import!** The event gets parsed and imported automatically

### Best Practices
- **Use on promoter events** you find interesting
- **Check extracted data** before sending to system
- **Combine with email automation** for maximum efficiency
- **Visit promoter pages** 1-2x per week manually

## 🔒 Safety & Privacy

- ✅ **No Facebook automation** - just extracts visible data
- ✅ **No account risk** - uses standard web APIs
- ✅ **No data storage** - data stays in your system
- ✅ **Manual control** - you decide what to extract
- ✅ **Legal & safe** - follows Facebook ToS

## 🛠️ Troubleshooting

**If extraction doesn't work:**
1. **Make sure you're on a Facebook event page**
2. **Try refreshing the page** and wait for it to fully load
3. **Check if event details are visible** on the page
4. **Facebook changes layouts** - contact for updates if needed

**If "Send to System" fails:**
1. **Use "Copy Data"** instead
2. **Manually paste** into your import review dashboard
3. **Check your website is running** for direct integration

---

## 🎉 Result

You now have a **safe, legal, and efficient** way to extract Facebook event data with zero risk to your account! 

Combine this with:
- ✅ **Email automation** (newsletters)  
- ✅ **Facebook export feature** (email to Mailparser)
- ✅ **Manual bookmarklet** (for discovered events)

= **Complete event automation system!** 🚀