#!/bin/bash

# Chrome with CORS disabled - for testing the bookmarklet locally
# ⚠️ WARNING: Only use for testing! Never browse the internet with CORS disabled!

echo "🚀 Starting Chrome with CORS disabled for local testing..."
echo "⚠️  WARNING: This disables important security features!"
echo "🔒 Only use this for testing the Facebook bookmarklet, then close it!"

# macOS Chrome with CORS disabled
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
  --disable-web-security \
  --disable-features=VizDisplayCompositor \
  --user-data-dir=/tmp/chrome-cors-disabled \
  --new-window \
  https://facebook.com/events/

echo ""
echo "✅ Chrome started with CORS disabled"
echo "📝 Instructions:"
echo "   1. Navigate to a Facebook event page"
echo "   2. Use the bookmarklet - it should work without CORS errors"
echo "   3. Close this Chrome window when done testing"
echo ""
echo "🔐 Your normal Chrome profile is unaffected"