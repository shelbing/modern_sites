// generateTailwindConfig.js
import fs from "fs/promises";
import fontCombinations, { getSelectedFontCombination } from "./src/config/fontCombinations.js";
import { getTailwindFontSizes } from "./src/config/fontSizes.js";
import { getTailwindColorClasses, getThemeColors } from "./src/config/colors.js";
import dotenv from 'dotenv';
import fsSync from 'fs';
import path from 'path';
import yaml from 'js-yaml';

// Load environment variables
try {
  if (fsSync.existsSync('.env.local')) {
    console.log('Loaded .env.local variables');
    dotenv.config({ path: '.env.local' });
    console.log('Environment variables after loading .env.local:');
    console.log(`PROPERTY: ${process.env.PROPERTY}`);
  }
} catch (e) {
  console.error('Error loading .env.local:', e);
}

// Get property code from environment variables
const propertyCode = process.env.PROPERTY || 'default';
console.log(`Property code from environment: ${propertyCode}`);

// Check if there's a property-specific font sizes YAML file
const fontSizesFilePath = path.resolve(`src/config/${propertyCode}.fontSizes.yaml`);
console.log(`Looking for property-specific font sizes at: ${fontSizesFilePath}`);
const fontSizesFileExists = fsSync.existsSync(fontSizesFilePath);
console.log(`Property-specific font sizes file exists: ${fontSizesFileExists}`);

// Store property-specific font sizes for direct use in Tailwind config
let propertyFontSizes = null;

if (fontSizesFileExists) {
  console.log(`Loading property-specific font sizes for: ${propertyCode}`);
  try {
    const fontSizesYaml = fsSync.readFileSync(fontSizesFilePath, 'utf8');
    console.log(`Font sizes YAML loaded from ${fontSizesFilePath}`);
    
    // Parse the YAML content
    propertyFontSizes = yaml.load(fontSizesYaml);
    console.log(`Property font sizes parsed successfully from YAML:`);
    console.log(JSON.stringify(propertyFontSizes, null, 2));
  } catch (error) {
    console.error(`Error reading font sizes YAML file: ${error.message}`);
  }
}

// Get font combination from YAML configuration (with property-specific support)
const selectedFontCombination = getSelectedFontCombination();

// Set fonts based on the selected font combination
console.log(`Selected font combination: ${selectedFontCombination.name}`);
console.log(`Heading font: ${selectedFontCombination.heading}`);
console.log(`Body font: ${selectedFontCombination.body}`);

// Set fonts based on the selected font combination
const headerFont = selectedFontCombination.heading;
const bodyFont = selectedFontCombination.body;

// Get theme colors from our local configuration
const themeColors = getThemeColors();

// Extract colors for cleaner code and easier reference (using flattened theme colors)
const primaryColorLight = themeColors['primary-light'];
const primaryColorDark = themeColors['primary-dark'];
const secondaryColorLight = themeColors['secondary-light'];
const secondaryColorDark = themeColors['secondary-dark'];
const backgroundLight = themeColors['background-light'];
const backgroundDark = themeColors['background-dark']; // Fixed variable name spelling
const paperLight = themeColors['paper-light'];
const paperDark = themeColors['paper-dark'];
const textLight = themeColors['text-light'];
const textDark = themeColors['text-dark'];
const accentLight = themeColors['accent-light'];
const accentDark = themeColors['accent-dark'];
const buttonColorLight = themeColors['primarybutton-light'];
const buttonColorDark = themeColors['primarybutton-dark'];
const buttonTextColorLight = themeColors['primarybuttontext-light'];
const buttonTextColorDark = themeColors['primarybuttontext-dark'];
const secondaryButtonColorLight = themeColors['secondarybutton-light'];
const secondaryButtonColorDark = themeColors['secondarybutton-dark'];
const secondaryButtonTextColorLight = themeColors['secondarybuttontext-light'];
const secondaryButtonTextColorDark = themeColors['secondarybuttontext-dark'];
const headerColorLight = themeColors['heading-light'];
const headerColorDark = themeColors['heading-dark'];
const menuColorLight = themeColors['menu-light'];
const menuColorDark = themeColors['menu-dark'];
const menuTextColorLight = themeColors['menutext-light'];
const menuTextColorDark = themeColors['menutext-dark'];
const menuAccentColorLight = themeColors['menuaccent-light'];
const menuAccentColorDark = themeColors['menuaccent-dark'];
const sectionHeaderColorLight = themeColors['sectionheader-light'];
const sectionHeaderColorDark = themeColors['sectionheader-dark'];
const sectionSubheaderColorLight = themeColors['sectionsubheader-light'];
const sectionSubheaderColorDark = themeColors['sectionsubheader-dark'];

async function generateConfig() {
  // Get font sizes with property-specific overrides if available
  const fontSizes = getTailwindFontSizes(propertyFontSizes);
  console.log('Font sizes being applied to Tailwind:');
  console.log(JSON.stringify(fontSizes, null, 2));
  
  // Use storyblokData to customize your Tailwind config
  const tailwindConfig = {
    darkMode: "class",
    content: [
      "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
      "./node_modules/flowbite/**/*.js",
    ],
    theme: {
      fontFamily: {
        sans: [bodyFont],
        serif: [headerFont],
      },
      fontSize: fontSizes,
      extend: {
        // Add our semantic colors to Tailwind's default colors
        colors: {
          // Debug what theme colors are being included
          ...(function() {
            // Restructure theme colors to handle multi-hyphenated names
            const processedColors = {};
            
            // Process each theme color
            Object.entries(themeColors).forEach(([key, value]) => {
              // Handle colors with hyphens like 'hero-background-light'
              if (key.endsWith('-light') || key.endsWith('-dark')) {
                // Determine if it's a light or dark variant
                const suffix = key.endsWith('-light') ? 'light' : 'dark';
                // Get the base name by removing the suffix
                const baseName = key.substring(0, key.length - (suffix.length + 1));
                
                // Create nested structure for hyphenated categories
                if (!processedColors[baseName]) {
                  processedColors[baseName] = {};
                }
                
                processedColors[baseName][suffix] = value;
              } else {
                // Regular colors without hyphens
                processedColors[key] = value;
              }
            });
            
            // Return processed colors for Tailwind's theme
            return processedColors;
          })(),
          
          // Default section and component colors
          sectionheader: {
            light: sectionHeaderColorLight,
            dark: sectionHeaderColorDark,
          },
          sectionsubheader: {
            light: sectionSubheaderColorLight,
            dark: sectionSubheaderColorDark,
          },
          menu: {
            light: menuColorLight,
            dark: menuColorDark,
          },
          menutext: {
            light: menuTextColorLight,
            dark: menuTextColorDark,
          },
          menuaccent: {
            light: menuAccentColorLight,
            dark: menuAccentColorDark,
          },
          button: {
            light: buttonColorLight,
            dark: buttonColorDark,
          },
          buttontext: {
            light: buttonTextColorLight,
            dark: buttonTextColorDark,
          },
          secondarybutton: {
            light: secondaryButtonColorLight,
            dark: secondaryButtonColorDark,
          },
          secondarybuttontext: {
            light: secondaryButtonTextColorLight,
            dark: secondaryButtonTextColorDark,
          },
          heading: {
            light: headerColorLight,
            dark: headerColorDark,
          },
          primary: {
            light: primaryColorLight,
            dark: primaryColorDark,
          },
          secondary: {
            light: secondaryColorLight,
            dark: secondaryColorDark,
          },
          background: {
            light: backgroundLight,
            dark: backgroundDark,
          },
          paper: {
            light: paperLight,
            dark: paperDark,
          },
          text: {
            light: textLight,
            dark: textDark,
          },
          accent: {
            light: accentLight,
            dark: accentDark,
          },
        },
        // Add grid row utilities
        gridRow: {
          "span-1": "span 1 / span 1",
          "span-2": "span 2 / span 2",
          "span-3": "span 3 / span 3",
          "span-4": "span 4 / span 4",
          "span-5": "span 5 / span 5",
          "span-6": "span 6 / span 6",
          // Add more as needed
        },
      },
      // Custom section color classes
      heroSection: getTailwindColorClasses('hero'),
      sectionBlock: getTailwindColorClasses('sectionBlock'),
    },
    plugins: [{ name: "flowbite/plugin" }],
  };

  const configString = `import flowbitePlugin from "flowbite/plugin.js";

const tailwindConfig = ${JSON.stringify(tailwindConfig, null, 2)};

// Replace the placeholder plugin with the actual flowbitePlugin
tailwindConfig.plugins = [flowbitePlugin];

export default tailwindConfig;
`;

  await fs.writeFile("tailwind.config.mjs", configString);
}

generateConfig();
