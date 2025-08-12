# 🚀 Import Your HTML Recipes to Chang Cookbook

## ✅ **Setup Complete!**

Your Chang Cookbook is now ready to import HTML recipes! Here's what I've prepared:

### **📁 What's Ready:**
- ✅ **HTML Recipe Parser** (`import-html-recipes.js`) - Smart parser that extracts recipes from HTML
- ✅ **Empty Recipe Database** - All placeholder recipes removed
- ✅ **JSDOM Library** - Installed for HTML parsing
- ✅ **Backup System** - Your existing data will be backed up before import

## 🗂️ **Step 1: Organize Your HTML Files**

Create a folder called `recipes-html` in your project root and put all your HTML recipe files there:

```
E:\Projects\chang-cookbook\
├── recipes-html\           ← Create this folder
│   ├── recipe1.html       ← Put your HTML files here
│   ├── recipe2.html
│   ├── recipe3.html
│   └── ...
├── import-html-recipes.js
└── src\data\recipes.json
```

## ⚡ **Step 2: Run the Import**

```bash
# Navigate to your project directory
cd E:\Projects\chang-cookbook

# Run the HTML import tool
node import-html-recipes.js
```

## 🤖 **What the Parser Does Automatically**

### **Extracts Recipe Data:**
- ✅ **Title** - From `<title>`, `<h1>`, or filename
- ✅ **Ingredients** - From lists, ingredient sections
- ✅ **Instructions** - From numbered lists, paragraphs
- ✅ **Times** - Detects prep time, cook time, total time
- ✅ **Servings** - Finds serving size information
- ✅ **Categories** - Auto-categorizes based on content
- ✅ **Tags** - Adds relevant tags (quick, healthy, etc.)

### **Smart Detection:**
- **Categories**: Automatically detects appetizers, main course, desserts, etc.
- **Difficulty**: Sets reasonable difficulty levels
- **Nutrition**: Estimates basic nutrition info
- **Images**: Creates branded placeholder images (you can replace later)

## 📋 **Supported HTML Formats**

The parser works with many HTML formats:

```html
<!-- Ingredients in lists -->
<ul class="ingredients">
  <li>2 cups flour</li>
  <li>1 tsp salt</li>
</ul>

<!-- Instructions in ordered lists -->
<ol class="instructions">
  <li>Preheat oven to 350°F</li>
  <li>Mix dry ingredients</li>
</ol>

<!-- Time information -->
<p>Prep time: 15 minutes</p>
<p>Cook time: 30 minutes</p>
<p>Serves: 4 people</p>
```

## 🎯 **Customization Options**

Edit `import-html-recipes.js` to customize:

```javascript
const CONFIG = {
  htmlFolder: './recipes-html',     // Your HTML folder
  outputFile: './src/data/recipes.json',
  
  defaults: {
    difficulty: 'medium',           // Default difficulty
    rating: 4.0,                   // Default rating
    chef: {
      name: 'Your Name Here',       // Your chef name
      avatar: '/images/chefs/you.jpg'
    }
  }
};
```

## 🔍 **Example HTML Recipe**

Here's what a typical HTML recipe might look like:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Chocolate Chip Cookies</title>
</head>
<body>
    <h1>Best Chocolate Chip Cookies</h1>
    <p>Soft and chewy cookies perfect for any occasion.</p>
    
    <p>Prep time: 15 minutes | Cook time: 12 minutes | Serves: 24 cookies</p>
    
    <h2>Ingredients</h2>
    <ul>
        <li>2¼ cups all-purpose flour</li>
        <li>1 cup butter, softened</li>
        <li>¾ cup brown sugar</li>
        <li>2 large eggs</li>
        <li>2 cups chocolate chips</li>
    </ul>
    
    <h2>Instructions</h2>
    <ol>
        <li>Preheat oven to 375°F.</li>
        <li>Cream butter and sugars until light and fluffy.</li>
        <li>Beat in eggs and vanilla.</li>
        <li>Gradually mix in flour.</li>
        <li>Fold in chocolate chips.</li>
        <li>Bake 9-11 minutes until golden brown.</li>
    </ol>
</body>
</html>
```

## 🧪 **After Import**

1. **Review Results**: Check `src/data/recipes.json` for imported recipes
2. **Add Images**: Replace placeholder images with your own photos
3. **Restart Server**: `npm run dev` to see your recipes
4. **Fine-tune**: Edit any recipes that need adjustments

## 🎨 **Adding Your Recipe Images**

After import, replace placeholder images:

1. Create: `public/images/recipes/`
2. Add your photos: `chocolate-chip-cookies.jpg`
3. Update recipe JSON: `"image": "/images/recipes/chocolate-chip-cookies.jpg"`

## 🔧 **Troubleshooting**

**Parser not finding ingredients?**
- Check if ingredients are in `<ul>` or `<li>` elements
- Try adding class names like `ingredients` or `ingredient-list`

**Instructions missing?**
- Ensure instructions are in `<ol>`, `<li>`, or numbered paragraphs
- The parser looks for cooking-related keywords

**Wrong category assigned?**
- Edit the `categoryKeywords` in the script
- Manually adjust categories in the output JSON

## 📊 **Expected Output**

After running the import, you'll see:

```
🍳 Chang Cookbook HTML Recipe Importer

📁 Found 25 HTML files
💾 Backed up existing recipes to recipes-backup.json
📝 Parsing 1/25: chocolate-chip-cookies.html
📝 Parsing 2/25: beef-stew.html
...

✅ Import complete!
   📊 23/25 recipes imported successfully
   📁 Saved to: src/data/recipes.json
   📋 Categories created: 6

Next steps:
   1. Review the imported recipes
   2. Add your own images to replace placeholders
   3. Restart development server: npm run dev
   4. Visit http://localhost:3002 to see your recipes!
```

Ready to import your recipes? Just create the `recipes-html` folder, add your HTML files, and run the importer! 🍳✨