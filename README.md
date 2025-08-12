# Chang Cookbook 🍜

A modern, responsive recipe website built with Next.js, TypeScript, and Tailwind CSS. Features an Asian-fusion focus with 20+ carefully curated recipes, search functionality, and mobile-first design.

## ✨ Features

- **20+ Diverse Recipes** - Appetizers, main courses, desserts, quick meals, and Asian fusion
- **Advanced Search** - Find recipes by name, ingredients, or dietary preferences
- **Category Filtering** - Browse by meal type, cuisine, or cooking time
- **Responsive Design** - Optimized for all devices from mobile to desktop
- **Interactive Recipe Pages** - Ingredient checklists, cooking timers, and sharing
- **SEO Optimized** - Rich metadata and structured data for search engines
- **Accessibility** - WCAG AA compliant with keyboard navigation and screen reader support

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17 or later
- npm or yarn package manager

### Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd E:\Projects\chang-cookbook
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the website.

## 📁 Project Structure

```
chang-cookbook/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── page.tsx           # Homepage
│   │   ├── recipes/           # Recipe pages
│   │   │   ├── page.tsx      # Recipe browsing
│   │   │   └── [slug]/       # Individual recipe pages
│   │   ├── search/           # Search functionality
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/            # Reusable UI components
│   │   ├── Header.tsx        # Navigation header
│   │   ├── Footer.tsx        # Site footer
│   │   ├── Hero.tsx          # Homepage hero section
│   │   ├── RecipeCard.tsx    # Recipe preview cards
│   │   ├── SearchBar.tsx     # Search input component
│   │   └── CategoryFilter.tsx # Category filtering
│   ├── lib/                  # Utility functions
│   │   ├── recipes.ts        # Recipe data handling
│   │   └── metadata.ts       # SEO metadata generation
│   ├── types/                # TypeScript type definitions
│   │   ├── recipe.ts         # Recipe interface
│   │   └── index.ts          # Type exports
│   └── data/                 # Static data files
│       └── recipes.json      # Recipe database
├── public/                   # Static assets
├── design-system.md          # Design specifications
├── wireframes.md            # UI wireframes
└── component-specifications.md # Component docs
```

## 🛠️ Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# TypeScript type checking
npm run type-check

# Code linting
npm run lint

# Fix linting issues
npm run lint:fix
```

### Adding New Recipes

1. **Edit the recipe data file:**
   ```bash
   src/data/recipes.json
   ```

2. **Add your recipe object:**
   ```json
   {
     "id": "unique-recipe-slug",
     "title": "Recipe Name",
     "description": "Brief description",
     "category": "main-courses",
     "ingredients": ["ingredient 1", "ingredient 2"],
     "instructions": ["Step 1", "Step 2"],
     "prepTime": 15,
     "cookTime": 30,
     "totalTime": 45,
     "servings": 4,
     "difficulty": "Easy",
     "imageUrl": "https://example.com/image.jpg",
     "tags": ["tag1", "tag2"]
   }
   ```

3. **The recipe will automatically appear on the website**

### Customizing the Design

The website uses a custom Tailwind CSS configuration with the following color palette:

```css
/* Primary Colors */
--orange: #FF6B35        /* CTAs and highlights */
--warm-red: #E74C3C      /* Accent color */
--deep-sage: #7D8471     /* Navigation and secondary */
--warm-beige: #F5F1E8    /* Background */

/* Supporting Colors */
--charcoal: #2C3E50      /* Text and headers */
--warm-gray: #95A5A6     /* Secondary text */
--cream: #FEFCF9         /* Cards and content */
```

Edit `tailwind.config.js` to customize colors, fonts, or spacing.

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Follow the prompts to deploy your site**

### Deploy to Netlify

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Deploy the `out` folder to Netlify**

### Deploy to Other Platforms

For other hosting platforms, build the project and deploy the generated files:

```bash
npm run build
npm start
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file for environment-specific settings:

```bash
# Optional: Analytics tracking ID
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# Optional: API endpoints for future features
NEXT_PUBLIC_API_URL=https://api.example.com
```

### Next.js Configuration

The `next.config.js` file includes optimizations for:
- Image optimization
- Static export capabilities
- Performance enhancements

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## ♿ Accessibility

The website follows WCAG AA guidelines:
- Semantic HTML structure
- Keyboard navigation support
- Screen reader compatibility
- High contrast color ratios
- Touch-friendly interactive elements (44px minimum)

## 🧪 Testing

### Manual Testing Checklist

- [ ] Homepage loads correctly
- [ ] Recipe browsing and filtering works
- [ ] Search functionality returns accurate results
- [ ] Individual recipe pages display properly
- [ ] Mobile responsiveness across devices
- [ ] Navigation and accessibility features

### Automated Testing (Future Enhancement)

Consider adding:
- Unit tests with Jest and Testing Library
- End-to-end tests with Playwright
- Accessibility testing with axe-core

## 🤝 Contributing

### Development Workflow

1. Create a new branch for your feature
2. Make your changes following the existing code style
3. Test your changes across different screen sizes
4. Update documentation if needed
5. Submit your changes

### Code Style

- Use TypeScript for type safety
- Follow the existing component structure
- Use Tailwind CSS for styling
- Ensure mobile-first responsive design
- Add proper ARIA labels for accessibility

## 📄 License

This project is created for educational and demonstration purposes.

## 📞 Support

For questions or issues:
- Check the existing documentation
- Review the design system and component specifications
- Ensure all dependencies are properly installed

## 🚀 Future Enhancements

Potential features to add:
- User accounts and recipe saving
- Recipe ratings and reviews
- Shopping list generation
- Nutrition calculator
- Recipe sharing on social media
- Multi-language support
- Advanced search filters
- Recipe recommendations

---

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS