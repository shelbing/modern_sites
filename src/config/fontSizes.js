/**
 * Font Sizes Configuration for Hotel Stern
 * 
 * This file contains centralized font size definitions for the hotel website.
 * All font sizes are defined here and can be imported and used throughout the application.
 * 
 * Support for property-specific font sizes via YAML configuration has been added.
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import 'dotenv/config';

// Get the property code from environment variables
const propertyCode = process.env.PROPERTY || 'default';

/**
 * Load font sizes from a property-specific YAML file
 * @param {string} propertyCode - The property code
 * @returns {Object} Font sizes from the YAML file, or null if file doesn't exist
 */
function loadPropertyFontSizes(propertyCode) {
  try {
    // Get the base directory for config files
    const srcConfigDir = path.resolve(process.cwd(), 'src/config');
    
    // Check if a property-specific font sizes file exists
    const filePath = path.join(srcConfigDir, `${propertyCode}.fontSizes.yaml`);
    
    if (fs.existsSync(filePath)) {
      console.log(`Loading property-specific font sizes for: ${propertyCode}`);
      const yamlContent = fs.readFileSync(filePath, 'utf8');
      console.log(`Font sizes YAML loaded for ${propertyCode}`);
      
      // Parse the YAML content
      const fontSizesData = yaml.load(yamlContent);
      console.log(`Property-specific font sizes parsed successfully:`);
      console.log(JSON.stringify(fontSizesData, null, 2));
      return fontSizesData;
    } else {
      console.log(`No property-specific font sizes found for: ${propertyCode}`);
      return null;
    }
  } catch (error) {
    console.error(`Error loading property-specific font sizes: ${error.message}`);
    return null;
  }
}

// Default font sizes in rem (relative to the root font size of 20px)
const defaultFontSizes = {
  // Heading font sizes
  h1: '2.5rem',    // 50px
  h2: '2rem',      // 40px
  h3: '1.75rem',   // 35px
  h4: '1.5rem',    // 30px
  h5: '1.25rem',   // 25px
  h6: '1.1rem',    // 22px

  // Body text sizes
  body: {
    xs: '0.75rem',  // 15px
    sm: '0.875rem', // 17.5px
    base: '1rem',   // 20px
    lg: '1.125rem', // 22.5px
    xl: '1.25rem',  // 25px
  },

  // Responsive text sizes for rich text content
  rich: {
    desktop: '1.6rem',   // 32px for large screens
    tablet: '1.4rem',    // 28px for medium screens
    mobile: '1.2rem',    // 24px for small screens
  },

  // Special element sizes
  button: '1rem',       // 20px
  caption: '0.875rem',  // 17.5px
  label: '0.875rem',    // 17.5px
  price: '1.25rem',     // 25px
  badge: '0.75rem',     // 15px

  // Section header sizes
  section: {
    header: '2.25rem',    // 45px (increased from typical h2)
    subheader: '1.5rem',  // 30px
  },

  // FAQ section sizes
  faq: {
    question: '1rem',  // 22.5px (default size for questions)
    questionMobile: '1rem', // 20px for mobile
    answer: '1rem',     // 22.5px (lg)
    answerMd: '1rem',    // 25px (xl) for medium screens and up
  },

  // Debug and utility sizes
  debug: '0.6rem',      // 12px
};

// Load property-specific font sizes
const propertyFontSizes = loadPropertyFontSizes(propertyCode);

// Use property font sizes if available, otherwise use defaults
// Note: We're no longer doing a shallow merge here, as deepMerge will handle this properly
const fontSizes = propertyFontSizes || defaultFontSizes;

// Log the initial font sizes to verify they're being loaded correctly
console.log(`Initial font sizes (before ensuring completeness):`);
console.log(JSON.stringify(fontSizes, null, 2));

/**
 * Deep merge two objects, preserving custom values from source while ensuring
 * all properties from defaults exist in the result
 * @param {Object} source - The source object (property-specific font sizes)
 * @param {Object} defaults - The default values
 * @returns {Object} Merged object with all required properties
 */
function deepMerge(source, defaults) {
  // Create a new object to avoid mutating the source
  const result = { ...source };
  
  // Make sure all properties from defaults exist in result
  for (const key in defaults) {
    // If key doesn't exist in source, use the default
    if (!(key in source)) {
      result[key] = defaults[key];
    } 
    // If both values are objects, recursively merge them
    else if (
      typeof defaults[key] === 'object' && defaults[key] !== null &&
      typeof source[key] === 'object' && source[key] !== null
    ) {
      result[key] = deepMerge(source[key], defaults[key]);
    }
    // Otherwise, keep the source value (which is the custom override)
  }
  
  return result;
}

// Ensure we have a complete font sizes object by checking for all required properties
function ensureCompleteFontSizes(fontSizes) {
  // Use the deep merge function to properly handle nested objects
  const complete = deepMerge(fontSizes, defaultFontSizes);
  
  // Log the complete font sizes after merging
  console.log('Complete font sizes after deep merging:');
  console.log(JSON.stringify(complete, null, 2));
  
  return complete;
}

// Ensure we have all required font size properties
const completeFontSizes = ensureCompleteFontSizes(fontSizes);

/**
 * Get a specific font size
 * @param {string} key - The font size key (e.g., 'h1', 'body.base')
 * @returns {string} The font size value
 */
export function getFontSize(key) {
  // Handle nested keys like 'body.base'
  if (key.includes('.')) {
    const [category, size] = key.split('.');
    return completeFontSizes[category][size];
  }

  return completeFontSizes[key];
}

/**
 * Get all font sizes
 * @returns {Object} All font sizes
 */
export function getAllFontSizes() {
  return completeFontSizes;
}

/**
 * Generate Tailwind fontSize configuration
 * @param {Object} propertyOverrides - Optional property-specific font size overrides from YAML
 * @returns {Object} Tailwind fontSize configuration
 */
export function getTailwindFontSizes(propertyOverrides = null) {
  // If property-specific overrides are provided, apply them
  let sizes = completeFontSizes;
  
  if (propertyOverrides) {
    console.log('Applying property-specific font size overrides to Tailwind config');
    // Use deep merge to apply the property overrides while preserving defaults for missing values
    sizes = deepMerge(propertyOverrides, defaultFontSizes);
    console.log('Font sizes after applying property overrides:');
    console.log(JSON.stringify(sizes, null, 2));
  }
  // Convert our font sizes to a format Tailwind expects
  const tailwindSizes = {
    'xs': sizes.body.xs,
    'sm': sizes.body.sm,
    'base': sizes.body.base,
    'lg': sizes.body.lg,
    'xl': sizes.body.xl,
    '2xl': sizes.h5,
    '3xl': sizes.h4,
    '4xl': sizes.h3,
    '5xl': sizes.h2,
    '6xl': sizes.h1,
    // Add rich text sizes
    'rich-desktop': sizes.rich.desktop,
    'rich-tablet': sizes.rich.tablet,
    'rich-mobile': sizes.rich.mobile,
    // Add special element sizes
    'button': sizes.button,
    'caption': sizes.caption,
    'label': sizes.label,
    'price': sizes.price,
    'badge': sizes.badge,
    // Add heading sizes with their semantic names
    'h1': sizes.h1,
    'h2': sizes.h2,
    'h3': sizes.h3,
    'h4': sizes.h4,
    'h5': sizes.h5,
    'h6': sizes.h6,
    // Add body sizes with their semantic names
    'body-xs': sizes.body.xs,
    'body-sm': sizes.body.sm,
    'body-base': sizes.body.base,
    'body-lg': sizes.body.lg,
    'body-xl': sizes.body.xl,
    // Add section header sizes
    'section-header': sizes.section.header,
    'section-subheader': sizes.section.subheader,

    // Add FAQ font sizes
    'faq-question': sizes.faq.question,
    'faq-question-mobile': sizes.faq.questionMobile,
    'faq-answer': sizes.faq.answer,
    'faq-answer-md': sizes.faq.answerMd,
  };

  return tailwindSizes;
}

export default completeFontSizes;
