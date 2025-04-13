# Font Size System

This document outlines the centralized font size management system for the Hotel Stern website.

## Overview

The Hotel Stern website uses a centralized font size management system to ensure consistent typography across the entire application. This system provides:

1. **Centralized Configuration**: All font sizes are defined in a single location
2. **Consistent Scaling**: Font sizes scale consistently across different screen sizes
3. **Easy Maintenance**: Font sizes can be updated in one place and automatically propagate throughout the application
4. **Developer Tools**: Utilities for working with font sizes and migrating from hardcoded values

## Font Size Configuration

Font sizes are defined in `/src/config/fontSizes.js`. This file exports a configuration object with all font sizes organized by category:

```javascript
// Example structure (simplified)
{
  // Heading sizes
  h1: "2.5rem",  // 50px
  h2: "2rem",    // 40px
  h3: "1.75rem", // 35px
  // ...

  // Body text sizes
  body: {
    xs: "0.75rem",   // 15px
    sm: "0.875rem",  // 17.5px
    base: "1rem",    // 20px
    lg: "1.125rem",  // 22.5px
    xl: "1.25rem",   // 25px
  },
  
  // Special element sizes
  button: "1rem",
  price: "1.25rem",
  // ...
}
```

## Using Font Sizes

### In CSS

Font sizes are available as CSS variables:

```css
/* Using heading font sizes */
h1 { font-size: var(--font-size-h1); }

/* Using body font sizes */
.small-text { font-size: var(--font-size-body-sm); }

/* Using special element font sizes */
.price-tag { font-size: var(--font-size-price); }
```

### In JavaScript

Font sizes can be accessed in JavaScript using utility functions:

```javascript
import { getFontSize } from '../config/fontSizes.js';

// Get a specific font size
const h1Size = getFontSize('h1');           // "2.5rem"
const bodyBaseSize = getFontSize('body.base'); // "1rem"
```

### In Tailwind CSS

Font sizes are automatically integrated with Tailwind CSS:

```html
<!-- Using Tailwind font size classes -->
<h1 class="text-h1">Hotel Stern</h1>
<p class="text-body-base">Welcome to our luxury hotel.</p>
<span class="text-price">€199</span>
```

## Utility Functions

The system provides utility functions in `/src/utils/fontSizeUtils.js`:

```javascript
import { 
  pxToRem, 
  remToPx, 
  getCssFontSize, 
  getFontSizeValue 
} from '../utils/fontSizeUtils.js';

// Convert between units
pxToRem(20);  // "1rem"
remToPx("1rem");  // 20

// Get CSS variable reference
getCssFontSize('h1');  // "var(--font-size-h1)"

// Get actual value
getFontSizeValue('body.base');  // "1rem"
```

## Debug Tools

In development mode, you can use the font size debug panel:

1. Press `Shift+Alt+F` to toggle the debug panel
2. The panel shows all available font sizes with their values

## Migration Guide

When migrating from hardcoded font sizes to the centralized system:

1. **Identify hardcoded font sizes** in your components
2. **Replace with CSS variables** or Tailwind classes:
   ```css
   /* Before */
   .element { font-size: 20px; }
   
   /* After - CSS Variable */
   .element { font-size: var(--font-size-body-base); }
   
   /* After - Tailwind Class */
   <div class="text-body-base">Content</div>
   ```
3. **Use utility functions** for dynamic values:
   ```javascript
   // Before
   const fontSize = "1.25rem";
   
   // After
   import { getFontSize } from '../config/fontSizes.js';
   const fontSize = getFontSize('body.xl');
   ```

## Best Practices

1. **Never hardcode font sizes** - always use the centralized system
2. **Use semantic size names** - choose sizes based on their purpose, not their value
3. **Maintain the hierarchy** - headings should be larger than body text
4. **Consider responsive design** - font sizes should scale appropriately on different devices
5. **Document custom sizes** - if you add new sizes, document their purpose

## Extending the System

To add new font sizes:

1. Update `/src/config/fontSizes.js` with your new sizes
2. Document the new sizes in this file
3. Use the new sizes in your components

## Responsive Font Sizes

The font size system automatically handles responsive sizing through:

1. **Base font size**: 20px (1rem) on desktop
2. **Tailwind breakpoints**: Font sizes adjust at different screen widths
3. **Special responsive sizes**: Some elements have specific sizes for different devices

## Related Documentation

- [Font Combination System](./FONT_SYSTEM.md)
- [Font Guide](./FONT_GUIDE.md)
- [README-FONTS](./README-FONTS.md)
