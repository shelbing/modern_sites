/**
 * Colors Configuration for Hotel Stern
 * 
 * This file imports color configuration from colors.yaml and provides
 * utility functions for accessing colors throughout the application.
 * 
 * Moving the color configuration to YAML helps separate configuration from code
 * and makes it easier to modify colors without touching the codebase.
 */

// Import required libraries
import yaml from 'js-yaml';

// Create an isServer flag to conditionally execute Node.js-specific code
const isServer = typeof window === 'undefined';

// Conditionally import Node.js modules
let fs, path, fileURLToPath, dotenv;
if (isServer) {
  // Dynamic imports for Node.js environment only
  fs = await import('fs');
  path = await import('path');
  const url = await import('url');
  fileURLToPath = url.fileURLToPath;
  dotenv = await import('dotenv');
}

// Load environment variables from both .env and .env.local
dotenv.config();

// Explicitly load .env.local which has priority
try {
  const __filename = fileURLToPath(import.meta.url);
  const projectRoot = path.resolve(path.dirname(__filename), '../..');
  const envLocalPath = path.join(projectRoot, '.env.local');
  
  if (fs.existsSync(envLocalPath)) {
    const envLocalContent = fs.readFileSync(envLocalPath, 'utf8');
    const envLocalVars = dotenv.parse(envLocalContent);
    
    // Add .env.local variables to process.env
    for (const key in envLocalVars) {
      process.env[key] = envLocalVars[key];
    }
    console.log('Loaded .env.local variables');
  }
} catch (error) {
  console.error('Error loading .env.local:', error);
}

// Debug environment variables
console.log('Environment variables after loading .env.local:');
console.log('PROPERTY:', process.env.PROPERTY);

// Get current file directory (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base directory for config files
const srcConfigDir = path.resolve(process.cwd(), 'src/config');

// Determine which YAML file to load based on PROPERTY environment variable
let yamlFilePath = path.join(srcConfigDir, 'colors.yaml'); // Default path

// Check if property-specific config exists
const propertyCode = process.env.PROPERTY;
console.log('Property code from environment:', propertyCode);

if (propertyCode) {
  const propertyConfigPath = path.join(srcConfigDir, `${propertyCode}.colors.yaml`);
  console.log('Looking for property-specific file at:', propertyConfigPath);
  
  // Check if the property-specific file exists
  const fileExists = fs.existsSync(propertyConfigPath);
  console.log('File exists:', fileExists);
  
  if (fileExists) {
    console.log(`Loading property-specific colors for: ${propertyCode}`);
    yamlFilePath = propertyConfigPath;
  } else {
    console.log(`No property-specific colors found for: ${propertyCode}, using default`);
    // List files in directory for debugging
    console.log('Files in directory:');
    const files = fs.readdirSync(__dirname);
    console.log(files);
  }
} else {
  console.log('No property code found in environment variables');
}

// Load the selected YAML configuration
console.log('Loading YAML file from:', yamlFilePath);

// Declare variables outside the try block for broader scope
let yamlContent;
let colorConfig;

try {
  yamlContent = fs.readFileSync(yamlFilePath, 'utf8');
  console.log('YAML content loaded, first 100 characters:', yamlContent.substring(0, 100));
  colorConfig = yaml.load(yamlContent);
  console.log('YAML parsed successfully');
} catch (error) {
  console.error('Error loading or parsing YAML file:', error);
  console.log('Falling back to default colors');
  // Fall back to default colors
  const defaultYamlPath = path.join(srcConfigDir, 'colors.yaml');
  try {
    yamlContent = fs.readFileSync(defaultYamlPath, 'utf8');
    colorConfig = yaml.load(yamlContent);
  } catch (fallbackError) {
    console.error('Could not load default colors yaml file:', fallbackError);
    colorConfig = { themeColors: {}, colors: {} }; // Empty defaults as last resort
  }
}

// Extract theme colors and base colors from configuration
const themeColors = colorConfig.themeColors;
const colors = colorConfig.colors;

/**
 * Get a specific color by key
 * @param {string} key - The color key (e.g., 'primary-light', 'hero-background-light')
 * @returns {string|undefined} The color value
 */
export function getColor(key) {
  // First check in themeColors for direct match
  if (themeColors[key]) return themeColors[key];

  // Check for theme color with light/dark variant (e.g., 'hero-background-light')
  if (key && key.includes && key.includes('-')) {
    // Extract the base color name and the variant (light/dark)
    const lastDashIndex = key.lastIndexOf('-');
    if (lastDashIndex > 0) {
      const baseName = key.substring(0, lastDashIndex);
      const variant = key.substring(lastDashIndex + 1);
      
      // Check if this is a valid theme color with light/dark variant
      if (themeColors[baseName] && themeColors[baseName][variant]) {
        console.log(`Resolved ${key} to theme color:`, themeColors[baseName][variant]);
        return themeColors[baseName][variant];
      }
    }
  }

  // Handle nested properties with dot notation
  if (key && key.includes && key.includes('.')) {
    const parts = key.split('.');
    let result = colors;

    for (const part of parts) {
      if (result[part] === undefined) {
        return undefined;
      }
      result = result[part];
    }

    return result;
  }

  // Check in the colors object
  return colors[key];
}

/**
 * Get all colors
 * @returns {Object} All colors
 */
export function getAllColors() {
  return { ...colors, ...themeColors };
}

/**
 * Get the hero section configuration directly from the loaded config
 * This provides a more direct way to access hero section styles without
 * relying on dynamic class generation
 */
export function getHeroConfig() {
  return colors.hero || {};
}

/**
 * Generate Tailwind color classes for a specific section
 * @param {string} section - The section name (e.g., 'hero')
 * @returns {Object} An object with color class names
 */
export function getTailwindColorClasses(section) {
  // Debug output for tracking
  console.log(`\n[DEBUG] Getting Tailwind classes for section: ${section}`);
  console.log(`[DEBUG] Theme colors available:`, themeColors);

  // Special case for pictureGallery caption classes
  if (section === 'pictureGallery') {
    const colorClasses = {};
    colorClasses['pictureGallery-caption-bg'] = colors['pictureGallery-caption-bg'];
    colorClasses['pictureGallery-caption-text'] = colors['pictureGallery-caption-text'];
    return colorClasses;
  }

  const sectionColors = colors[section];
  if (!sectionColors) {
    console.log(`[DEBUG] No section colors found for: ${section}`);
    return {};
  }
  
  console.log(`[DEBUG] Section colors for ${section}:`, JSON.stringify(sectionColors, null, 2));

  const classes = {};

  // Process each element in the section
  Object.entries(sectionColors).forEach(([element, colorConfig]) => {
    // Handle different color config formats based on the section type
    if (section === 'sectionBlock') {
      // Section block uses light/dark mode variants
      const className = `${section}-${element}`;
      classes[className] = `text-${colorConfig.color} dark:text-${colorConfig.darkModeColor}`;
    } else {
      // Standard handling for other sections (like hero)
      // Create background class if background is defined
      if (colorConfig.background) {
        const bgClassName = `${section}-${element}-bg`;
        
        // Process background color - handle bracket notation and theme color references
        let lightBgColor = colorConfig.background;
        
        // Check if using bracket notation for multi-hyphenated colors
        if (lightBgColor.startsWith('[') && lightBgColor.endsWith(']')) {
          // Remove brackets for direct Tailwind usage
          lightBgColor = lightBgColor.substring(1, lightBgColor.length - 1);
        } else if (!lightBgColor.includes('-light') && !lightBgColor.includes('-dark')) {
          // Try to resolve as theme color
          const resolvedColor = getColor(lightBgColor);
          lightBgColor = resolvedColor || lightBgColor;
        }
        
        // Process dark mode background color
        let darkBgColor = null;
        if (colorConfig.darkModeBackground) {
          darkBgColor = colorConfig.darkModeBackground;
          
          // Check if using bracket notation for multi-hyphenated colors
          if (darkBgColor.startsWith('[') && darkBgColor.endsWith(']')) {
            // Remove brackets for direct Tailwind usage
            darkBgColor = darkBgColor.substring(1, darkBgColor.length - 1);
          } else if (!darkBgColor.includes('-light') && !darkBgColor.includes('-dark')) {
            // Try to resolve as theme color
            darkBgColor = getColor(darkBgColor) || darkBgColor;
          }
        }

        // Include dark mode background if available
        if (darkBgColor) {
          // Handle opacity if it exists
          if (colorConfig.opacity) {
            // Special case for hero-background to ensure it matches our working hardcoded approach
            if (lightBgColor === 'hero-background-light' || darkBgColor === 'hero-background-dark') {
              classes[bgClassName] = `bg-${lightBgColor} bg-opacity-${colorConfig.opacity} dark:bg-${darkBgColor} dark:bg-opacity-${colorConfig.darkModeOpacity || colorConfig.opacity}`;
            } else {
              classes[bgClassName] = `bg-${lightBgColor} bg-opacity-${colorConfig.opacity} dark:bg-${darkBgColor} dark:bg-opacity-${colorConfig.darkModeOpacity || colorConfig.opacity}`;
            }
          } else {
            classes[bgClassName] = `bg-${lightBgColor} dark:bg-${darkBgColor}`;
          }
        } else {
          // Handle opacity if it exists
          if (colorConfig.opacity) {
            classes[bgClassName] = `bg-${lightBgColor} bg-opacity-${colorConfig.opacity}`;
          } else {
            classes[bgClassName] = `bg-${lightBgColor}`;
          }
        }
      }

      // Create text color class if textColor is defined
      if (colorConfig.textColor) {
        const textClassName = `${section}-${element}-text`;
        
        // Process text color - handle bracket notation and theme color references
        let lightTextColor = colorConfig.textColor;
        
        // Check if using bracket notation for multi-hyphenated colors
        if (lightTextColor.startsWith('[') && lightTextColor.endsWith(']')) {
          // Remove brackets for direct Tailwind usage
          lightTextColor = lightTextColor.substring(1, lightTextColor.length - 1);
        } else if (!lightTextColor.includes('-light') && !lightTextColor.includes('-dark')) {
          // Try to resolve as theme color
          lightTextColor = getColor(lightTextColor) || lightTextColor;
        }
        
        // Process dark mode text color
        let darkTextColor = null;
        if (colorConfig.darkModeTextColor) {
          darkTextColor = colorConfig.darkModeTextColor;
          
          // Check if using bracket notation for multi-hyphenated colors
          if (darkTextColor.startsWith('[') && darkTextColor.endsWith(']')) {
            // Remove brackets for direct Tailwind usage
            darkTextColor = darkTextColor.substring(1, darkTextColor.length - 1);
          } else if (!darkTextColor.includes('-light') && !darkTextColor.includes('-dark')) {
            // Try to resolve as theme color
            darkTextColor = getColor(darkTextColor) || darkTextColor;
          }
        }

        // Include dark mode text color if available
        if (darkTextColor) {
          classes[textClassName] = `text-${lightTextColor} dark:text-${darkTextColor}`;
        } else {
          classes[textClassName] = `text-${lightTextColor}`;
        }
      }

      // Create border color class if borderColor is defined
      if (colorConfig.borderColor) {
        const borderClassName = `${section}-${element}-border`;

        // Include dark mode border color if available
        if (colorConfig.darkModeBorderColor) {
          classes[borderClassName] = `border-${colorConfig.borderColor} dark:border-${colorConfig.darkModeBorderColor}`;
        } else {
          classes[borderClassName] = `border-${colorConfig.borderColor}`;
        }
      }
    }
  });

  return classes;
}

// Export theme colors for use in Tailwind config
export function getThemeColors() {
  // Create a flattened version of themeColors with proper naming convention
  const flattenedColors = {};
  
  // Process each theme color and its light/dark variants
  Object.entries(themeColors).forEach(([colorName, variants]) => {
    // Check if the color has light/dark variants
    if (variants && typeof variants === 'object' && (variants.light || variants.dark)) {
      // Add light variant with proper naming convention
      if (variants.light) {
        flattenedColors[`${colorName}-light`] = variants.light;
      }
      
      // Add dark variant with proper naming convention
      if (variants.dark) {
        flattenedColors[`${colorName}-dark`] = variants.dark;
      }
    } else {
      // Not a light/dark variant format, just copy it directly
      flattenedColors[colorName] = variants;
    }
  });
  
  console.log('Processed theme colors for Tailwind:', flattenedColors);
  return flattenedColors;
}

// Add utility functions to the colors object so they can be accessed via default import
colors.getTailwindColorClasses = getTailwindColorClasses;
colors.getColor = getColor;
colors.getAllColors = getAllColors;
colors.getThemeColors = getThemeColors;

// Export the colors object as default export
export default colors;
// Export themeColors for direct access
export { themeColors };
