// generateSafelist.js
import fs from 'fs/promises';
import path from 'path';
import colors from './src/config/colors.js';

/**
 * Extract all color references from colors.js that match Tailwind pattern
 * This will find colors like 'red-500', 'blue-600', etc.
 */
async function generateSafelist() {
  try {
    // Read the colors.js file as text
    const colorsFilePath = path.join(process.cwd(), 'src', 'config', 'colors.js');
    const colorsFileContent = await fs.readFile(colorsFilePath, 'utf8');
    
    // Regular expression to find all tailwind color references
    // This looks for patterns like 'red-500', 'blue-600', etc.
    const colorRegex = /'([a-z]+-[0-9]+)'/g;
    const colorMatches = [...colorsFileContent.matchAll(colorRegex)];
    
    // Extract all unique tailwind colors
    const uniqueColors = new Set();
    colorMatches.forEach(match => {
      uniqueColors.add(match[1]);
    });
    
    // Also add all colors explicitly defined in our object (recursive function)
    function findColorValues(obj) {
      if (!obj || typeof obj !== 'object') return;
      
      Object.values(obj).forEach(value => {
        if (typeof value === 'string' && value.match(/^[a-z]+-[0-9]+$/)) {
          uniqueColors.add(value);
        } else if (typeof value === 'object') {
          findColorValues(value);
        }
      });
    }
    
    // Apply the recursive function to the colors object
    findColorValues(colors);
    
    console.log(`Found ${uniqueColors.size} unique Tailwind colors in colors.js`);
    
    // Generate bg- and dark:bg- classes for each color
    const safelist = [];
    uniqueColors.forEach(color => {
      safelist.push(`bg-${color}`);
      safelist.push(`dark:bg-${color}`);
      // Also add border colors 
      safelist.push(`border-${color}`);
      safelist.push(`dark:border-${color}`);
      // Add text colors too
      safelist.push(`text-${color}`);
      safelist.push(`dark:text-${color}`);
    });
    
    console.log('Generated safelist with classes:', safelist);
    
    // Read the current tailwind.config.mjs file
    const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.mjs');
    const tailwindConfig = await fs.readFile(tailwindConfigPath, 'utf8');
    
    // Check if safelist already exists in the config
    if (tailwindConfig.includes('"safelist":')) {
      // Replace existing safelist
      const updatedConfig = tailwindConfig.replace(
        /("safelist":\s*\[)[^\]]*(\])/s,
        `$1\n    ${safelist.map(cls => `'${cls}'`).join(',\n    ')}\n  $2`
      );
      await fs.writeFile(tailwindConfigPath, updatedConfig);
    } else {
      // Add new safelist after content
      const updatedConfig = tailwindConfig.replace(
        /("content":\s*\[[^\]]*\],)/,
        `$1\n  "safelist": [\n    ${safelist.map(cls => `'${cls}'`).join(',\n    ')}\n  ],`
      );
      await fs.writeFile(tailwindConfigPath, updatedConfig);
    }
    
    console.log('Updated tailwind.config.mjs with safelist');
  } catch (error) {
    console.error('Error generating safelist:', error);
  }
}

generateSafelist();
