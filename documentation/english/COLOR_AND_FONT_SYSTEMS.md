# Hotel Stern Color and Font Documentation

This document provides comprehensive documentation for the Hotel Stern website's color and font systems. Both systems were designed to provide consistency, flexibility, and maintainability across the entire application.

## Table of Contents

1. [Color System](#color-system)
   - [Color Organization](#color-organization)
   - [Semantic Color Tokens](#semantic-color-tokens)
   - [Color Palette](#color-palette)
   - [Component Styling Patterns](#component-styling-patterns)
   - [Dark Mode Implementation](#dark-mode-implementation)
   - [Best Practices](#color-best-practices)

2. [Font System](#font-system)
   - [Central Configuration](#central-configuration)
   - [CSS Variables](#css-variables)
   - [Tailwind Integration](#tailwind-integration)
   - [Utility Functions](#utility-functions)
   - [Migration Tools](#migration-tools)
   - [Font Selection System](#font-selection-system)
   - [Debugging Features](#font-debugging-features)
   - [Best Practices](#font-best-practices)

---

## Color System

The Hotel Stern website employs a comprehensive color system that centralizes all color definitions in the Tailwind configuration. This approach ensures consistency across the application while making it easy to update the entire theme from a single location.

### Color Organization

Colors in the Tailwind configuration are organized by their functional purpose rather than merely by color names. This semantic approach makes it easier to maintain a consistent visual language throughout the application.

Categories include:

- **Section headers and titles**: Colors for main headings and subheadings
- **Menu elements**: Colors for navigation items and menus
- **Button styles**: Separate color schemes for primary and secondary buttons
- **Theme colors**: Core brand colors that define the overall visual identity
- **Backgrounds**: Different background colors for cards, sections, and pages
- **Text colors**: Various text colors for primary content, secondary information, etc.
- **Accent colors**: Highlight colors for important elements and interactions
- **Price elements**: Special colors for pricing information
- **Form elements**: Colors for input fields, borders, and focus states

### Semantic Color Tokens

The color system uses semantic tokens to represent colors based on their function rather than their visual appearance. This abstraction allows for easier theme changes and dark mode support.

Key semantic tokens include:

#### Background Colors
```css
bg-background-light dark:bg-background-dark
```

#### Text Colors
Primary text:
```css
text-text-light dark:text-text-dark
```

Secondary text:
```css
text-textSecondary-light dark:text-textSecondary-dark
```

#### Button Colors
Primary buttons:
```css
bg-primarybutton-light text-primarybuttontext-light dark:bg-primarybutton-dark dark:text-primarybuttontext-dark
```

Secondary buttons:
```css
bg-secondarybutton-light text-secondarybuttontext-light dark:bg-secondarybutton-dark dark:text-secondarybuttontext-dark
```

#### Price Elements
```css
text-price-light dark:text-price-dark
```

#### Form Elements
```css
bg-input-light dark:bg-input-dark border-inputBorder-light dark:border-inputBorder-dark focus:border-inputFocus-light dark:focus:border-inputFocus-dark
```

### Color Palette

The color palette emphasizes blues and greens, replacing the previous red and brown colors:

- **Primary buttons**: Blue tones that provide a clear call-to-action
- **Price elements**: Green tones that evoke positive financial associations
- **Background colors**: Lightened paper background for better readability
- **Form elements**: Optimized for both light and dark modes
- **Focus states**: Consistent focus indicators for all interactive elements

### Component Styling Patterns

The color system includes standardized patterns for common UI components:

#### Primary Buttons
```css
px-6 py-3 bg-primarybutton-light text-primarybuttontext-light dark:bg-primarybutton-dark dark:text-primarybuttontext-dark rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:ring-offset-2
```

#### Secondary Buttons
```css
px-6 py-3 border border-gray-300 bg-secondarybutton-light text-secondarybuttontext-light dark:bg-secondarybutton-dark dark:text-secondarybuttontext-dark rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary-light dark:focus:ring-secondary-dark focus:ring-offset-2
```

#### Price Tags
```css
bg-price-light text-white dark:bg-price-dark dark:text-white px-3 py-1 rounded-full text-sm font-semibold
```

#### Card Components
```css
bg-background-light dark:bg-background-dark shadow-md rounded-lg p-6
```

### Dark Mode Implementation

The color system fully supports dark mode through Tailwind's dark mode variants. Each color token has both light and dark mode versions, allowing for a seamless transition between modes.

All components use the `dark:` prefix for dark mode variants:

```jsx
<div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
  Content goes here
</div>
```

The system relies on Tailwind's dark mode implementation, which can be configured to use either:
- Class-based approach: `dark` class on the root element
- Media query approach: based on user's system preferences

### Color Best Practices

1. **Always use semantic tokens**: Instead of using raw color values or general Tailwind colors like `bg-blue-500`, use the semantic tokens provided by the system.

2. **Include both light and dark variants**: Always include both the light and dark mode variants for a complete implementation.

3. **Use consistent patterns**: Refer to the component styling patterns for guidance on styling common UI elements.

4. **Centralize new colors**: If you need a new color, add it to the Tailwind configuration rather than using inline styles or one-off color values.

5. **Check contrast ratios**: Ensure that text colors have sufficient contrast with their backgrounds for accessibility.

---

## Font System

The Hotel Stern website uses a comprehensive centralized font size system that ensures typography consistency while providing flexibility for different design needs.

### Central Configuration

All font sizes are defined in a single location: `/src/config/fontSizes.js`. This central configuration file organizes font sizes by category:

- **Headings**: h1, h2, h3, etc.
- **Body text**: base, sm, lg, etc.
- **Rich text**: For content managed through a CMS
- **Special elements**: For unique UI components

The central configuration provides utility functions:

- `getFontSize(key)`: Retrieves a specific font size by its key
- `getAllFontSizes()`: Returns all available font sizes
- `getTailwindFontSizes()`: Formats font sizes for Tailwind configuration

Example structure:
```javascript
// /src/config/fontSizes.js
export const fontSizes = {
  headings: {
    h1: {
      size: '2.5rem',
      lineHeight: '1.2',
      weight: '700',
      letterSpacing: '-0.02em',
    },
    h2: {
      size: '2rem',
      lineHeight: '1.3',
      weight: '700',
      letterSpacing: '-0.01em',
    },
    // Additional heading sizes...
  },
  body: {
    base: {
      size: '1rem',
      lineHeight: '1.5',
      weight: '400',
      letterSpacing: 'normal',
    },
    sm: {
      size: '0.875rem',
      lineHeight: '1.5',
      weight: '400',
      letterSpacing: 'normal',
    },
    // Additional body text sizes...
  },
  // Other categories...
};

export function getFontSize(key) {
  // Implementation details...
}

export function getAllFontSizes() {
  // Implementation details...
}

export function getTailwindFontSizes() {
  // Implementation details...
}
```

### CSS Variables

Font sizes are available throughout the application as CSS variables through two mechanisms:

#### Static CSS File

The file `/src/styles/font-sizes.css` contains predefined CSS variables for all font sizes:

```css
:root {
  --font-size-h1: 2.5rem;
  --font-size-h2: 2rem;
  --font-size-body-base: 1rem;
  --font-size-body-sm: 0.875rem;
  /* Additional font size variables... */
  
  --line-height-h1: 1.2;
  --line-height-h2: 1.3;
  --line-height-body-base: 1.5;
  /* Additional line height variables... */
  
  --font-weight-h1: 700;
  --font-weight-body-base: 400;
  /* Additional font weight variables... */
  
  --letter-spacing-h1: -0.02em;
  --letter-spacing-body-base: normal;
  /* Additional letter spacing variables... */
}
```

#### Dynamic Generation

The component `/src/components/Scripts/FontSizes.astro` dynamically generates CSS variables from the JavaScript configuration:

```jsx
---
// /src/components/Scripts/FontSizes.astro
import { getAllFontSizes } from '../../config/fontSizes';

const allFontSizes = getAllFontSizes();
---

<script is:inline define:vars={{ allFontSizes }}>
  // Dynamically set CSS variables based on the font configuration
  const rootStyle = document.documentElement.style;
  
  Object.entries(allFontSizes).forEach(([key, value]) => {
    rootStyle.setProperty(`--font-size-${key}`, value.size);
    rootStyle.setProperty(`--line-height-${key}`, value.lineHeight);
    rootStyle.setProperty(`--font-weight-${key}`, value.weight);
    rootStyle.setProperty(`--letter-spacing-${key}`, value.letterSpacing);
  });
</script>
```

### Tailwind Integration

Font sizes are automatically integrated with Tailwind CSS, providing semantic class names:

The file `generateTailwindConfig.js` imports and uses the centralized font sizes:

```javascript
// /src/config/generateTailwindConfig.js
import { getTailwindFontSizes } from './fontSizes';

const fontSizes = getTailwindFontSizes();

module.exports = {
  theme: {
    extend: {
      fontSize: fontSizes,
      // Other theme extensions...
    },
  },
  // Other Tailwind configuration...
};
```

This integration allows for semantic class names in templates:

```jsx
<h1 className="text-h1">Welcome to Hotel Stern</h1>
<p className="text-body-base">Experience luxury in the heart of the city.</p>
```

### Utility Functions

The file `/src/utils/fontSizeUtils.js` provides helper functions for working with font sizes:

#### Unit Conversion
```javascript
export function pxToRem(px, baseFontSize = 16) {
  return `${px / baseFontSize}rem`;
}

export function remToPx(rem, baseFontSize = 16) {
  return parseFloat(rem) * baseFontSize;
}
```

#### CSS Variable Access
```javascript
export function getCssFontSize(key) {
  return `var(--font-size-${key})`;
}
```

#### Font Size Detection
```javascript
export function isFontSize(value) {
  // Implementation to check if a value matches a font size pattern
}

export function suggestFontSizeKey(value) {
  // Implementation to suggest the closest font size key for a given value
}
```

### Migration Tools

To help with migration to the centralized font system, the following tools are provided:

#### Script to Find Hardcoded Font Sizes
```javascript
// /scripts/findHardcodedFontSizes.js
// Implementation to scan codebase for hardcoded font sizes
```

This script can be run with:
```bash
npm run font:sizes
```

### Font Selection System

The Hotel Stern website features a sophisticated font loading system that supports multiple font combinations.

#### Environment Variable Handling

The system intelligently handles environment variables in different contexts:
- In Node.js scripts (like `generateTailwindConfig.js`), it uses `process.env` to read the `FONT_COMBINATION` variable
- In browser/Astro components, it uses `import.meta.env` to access the same variable

```javascript
// /src/utils/fontCombinations.js
export function getSelectedFontCombination() {
  // Check if we're in a Node.js environment
  if (typeof process !== 'undefined' && process.env) {
    return process.env.FONT_COMBINATION || 'classic-luxury';
  }
  
  // Otherwise, we're in a browser/Astro environment
  return import.meta.env.FONT_COMBINATION || 'classic-luxury';
}
```

#### Font Combinations

The system offers 22 different font combinations, with "Classic Luxury" (Playfair Display / Roboto) as the default. Font combinations can be changed using the environment variable in the `.env` file:

```
FONT_COMBINATION=classic-luxury
```

Alternatively, the font combination can be changed using the command:
```bash
npm run font <number>
```

### Font Debugging Features

The font system includes several debugging features:

- **Comprehensive logging** of the font loading process
- **Visual debugging information** in development mode
- **Font loading status verification**
- **Hidden elements** to force font preloading

### Font Best Practices

1. **Use semantic size tokens**: Instead of hardcoding font sizes like `font-size: 16px` or `text-lg`, use the semantic tokens provided by the system (`text-body-base`, `text-h2`, etc.)

2. **Reference CSS variables when needed**: For custom components or styles, reference the CSS variables (`var(--font-size-body-base)`) rather than hardcoding values.

3. **Use utility functions for conversions**: When you need to convert between units, use the provided utility functions (`pxToRem`, `remToPx`).

4. **Run the font size finder regularly**: Periodically run the hardcoded font size finder to catch any instances where the system isn't being used correctly.

5. **Test different font combinations**: When developing new components, test them with different font combinations to ensure they work well with variable font metrics.

6. **Maintain responsive behavior**: Ensure that font sizes respond appropriately to different screen sizes by using the responsive variants provided by Tailwind (e.g., `md:text-h1`).

7. **Update the central configuration**: When new font size requirements arise, update the central configuration rather than creating one-off solutions.

---

## Conclusion

The Hotel Stern website's color and font systems provide a robust foundation for consistent, maintainable, and flexible design. By following the best practices outlined in this document, developers can ensure that new additions to the codebase align with the established design system.

For any questions or suggestions regarding these systems, please contact the development team.

---

**Document Version**: 1.0  
**Last Updated**: March 6, 2025  
**Author**: Hotel Stern Development Team
