/**
 * Font Combinations for Hotel Stern
 * 
 * This file contains 23 carefully selected font combinations for the hotel website.
 * Each combination includes a heading font (serif) and a body font (sans-serif).
 * 
 * Usage: Font combination is now configured in fontCombination.yaml or
 * property-specific {propertyCode}.fontCombination.yaml files
 */

// Import required libraries
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const fontCombinations = [
  // 1. Classic Luxury (Default)
  {
    name: "Classic Luxury",
    heading: "Playfair Display",
    body: "Roboto",
    headingWeights: "400;500;600;700",
    bodyWeights: "300;400;500;700",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap&subset=latin,latin-ext"
  },
  
  // 2. Modern Elegance
  {
    name: "Modern Elegance",
    heading: "Cormorant Garamond",
    body: "Montserrat",
    headingWeights: "400;500;600;700",
    bodyWeights: "300;400;500;600",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Montserrat:wght@300;400;500;600&display=swap&subset=latin,latin-ext"
  },
  
  // 3. Boutique Hotel
  {
    name: "Boutique Hotel",
    heading: "Libre Baskerville",
    body: "Source Sans Pro",
    headingWeights: "400;700",
    bodyWeights: "300;400;600",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Sans+Pro:wght@300;400;600&display=swap&subset=latin,latin-ext"
  },
  
  // 4. Contemporary Resort
  {
    name: "Contemporary Resort",
    heading: "Prata",
    body: "Work Sans",
    headingWeights: "400",
    bodyWeights: "300;400;500;600",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Prata&family=Work+Sans:wght@300;400;500;600&display=swap&subset=latin,latin-ext"
  },
  
  // 5. Alpine Retreat
  {
    name: "Alpine Retreat",
    heading: "Lora",
    body: "Open Sans",
    headingWeights: "400;500;600;700",
    bodyWeights: "300;400;600",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Open+Sans:wght@300;400;600&display=swap&subset=latin,latin-ext"
  },
  
  // 6. Urban Chic
  {
    name: "Urban Chic",
    heading: "DM Serif Display",
    body: "Nunito Sans",
    headingWeights: "400",
    bodyWeights: "300;400;600;700",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Nunito+Sans:wght@300;400;600;700&display=swap&subset=latin,latin-ext"
  },
  
  // 7. Seaside Resort
  {
    name: "Seaside Resort",
    heading: "Spectral",
    body: "Karla",
    headingWeights: "400;500;600;700",
    bodyWeights: "400;500;700",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Spectral:wght@400;500;600;700&family=Karla:wght@400;500;700&display=swap&subset=latin,latin-ext"
  },
  
  // 8. Heritage Hotel
  {
    name: "Heritage Hotel",
    heading: "Crimson Text",
    body: "Raleway",
    headingWeights: "400;600;700",
    bodyWeights: "300;400;500;600",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Crimson+Text:wght@400;600;700&family=Raleway:wght@300;400;500;600&display=swap&subset=latin,latin-ext"
  },
  
  // 9. Business Traveler
  {
    name: "Business Traveler",
    heading: "Merriweather",
    body: "IBM Plex Sans",
    headingWeights: "400;700",
    bodyWeights: "300;400;500;600",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap&subset=latin,latin-ext"
  },
  
  // 10. Wellness Spa
  {
    name: "Wellness Spa",
    heading: "Cardo",
    body: "Quicksand",
    headingWeights: "400;700",
    bodyWeights: "300;400;500;700",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Cardo:wght@400;700&family=Quicksand:wght@300;400;500;700&display=swap&subset=latin,latin-ext"
  },
  
  // 11. Mountain Lodge
  {
    name: "Mountain Lodge",
    heading: "Vollkorn",
    body: "Assistant",
    headingWeights: "400;500;600;700",
    bodyWeights: "300;400;600;700",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Vollkorn:wght@400;500;600;700&family=Assistant:wght@300;400;600;700&display=swap&subset=latin,latin-ext"
  },
  
  // 12. Luxury Chateau
  {
    name: "Luxury Chateau",
    heading: "Cormorant",
    body: "Outfit",
    headingWeights: "400;500;600;700",
    bodyWeights: "300;400;500;600",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Cormorant:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap&subset=latin,latin-ext"
  },
  
  // 13. Minimalist Design
  {
    name: "Minimalist Design",
    heading: "Tenor Sans",
    body: "Inter",
    headingWeights: "400",
    bodyWeights: "300;400;500;600",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Tenor+Sans&family=Inter:wght@300;400;500;600&display=swap&subset=latin,latin-ext"
  },
  
  // 14. Historic Inn
  {
    name: "Historic Inn",
    heading: "EB Garamond",
    body: "Cabin",
    headingWeights: "400;500;600;700",
    bodyWeights: "400;500;600;700",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500;600;700&family=Cabin:wght@400;500;600;700&display=swap&subset=latin,latin-ext"
  },
  
  // 15. Artisan Boutique
  {
    name: "Artisan Boutique",
    heading: "Fraunces",
    body: "Rubik",
    headingWeights: "400;500;600;700",
    bodyWeights: "300;400;500;600",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;600;700&family=Rubik:wght@300;400;500;600&display=swap&subset=latin,latin-ext"
  },
  
  // 16. German-Optimized
  {
    name: "German-Optimized",
    heading: "Noto Serif",
    body: "Noto Sans",
    headingWeights: "400;500;600;700",
    bodyWeights: "300;400;500;700",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Noto+Sans:wght@300;400;500;700&family=Noto+Serif:wght@400;500;600;700&display=swap&subset=latin,latin-ext"
  },
  
  // 17. Bohemian Flair
  {
    name: "Bohemian Flair",
    heading: "Abril Fatface",
    body: "Poppins",
    headingWeights: "400",
    bodyWeights: "300;400;500;600",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Poppins:wght@300;400;500;600&display=swap&subset=latin,latin-ext"
  },
  
  // 18. Nordic Minimalism
  {
    name: "Nordic Minimalism",
    heading: "Josefin Slab",
    body: "Josefin Sans",
    headingWeights: "400;600;700",
    bodyWeights: "300;400;500;600",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;500;600&family=Josefin+Slab:wght@400;600;700&display=swap&subset=latin,latin-ext"
  },
  
  // 19. Art Deco Revival
  {
    name: "Art Deco Revival",
    heading: "Poiret One",
    body: "Didact Gothic",
    headingWeights: "400",
    bodyWeights: "400",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Didact+Gothic&family=Poiret+One&display=swap&subset=latin,latin-ext"
  },
  
  // 20. Rustic Charm
  {
    name: "Rustic Charm",
    heading: "Amatic SC",
    body: "Quattrocento Sans",
    headingWeights: "400;700",
    bodyWeights: "400;700",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&family=Quattrocento+Sans:wght@400;700&display=swap&subset=latin,latin-ext"
  },
  
  // 21. Vintage Typewriter
  {
    name: "Vintage Typewriter",
    heading: "Special Elite",
    body: "Courier Prime",
    headingWeights: "400",
    bodyWeights: "400;700",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Special+Elite&display=swap&subset=latin,latin-ext"
  },
  
  // 22. Swiss Precision
  {
    name: "Swiss Precision",
    heading: "Bebas Neue",
    body: "Roboto Mono",
    headingWeights: "400",
    bodyWeights: "300;400;500;700",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto+Mono:wght@300;400;500;700&display=swap&subset=latin,latin-ext"
  },
  
  // 23. Elegant Simplicity
  {
    name: "Elegant Simplicity",
    heading: "Lora",
    body: "Inter",
    headingWeights: "400;500;600;700",
    bodyWeights: "300;400;500;600",
    googleFontsUrl: "https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap&subset=latin,latin-ext"
  }
];

/**
 * Load font configuration from YAML files
 * @returns {Object} Font configuration object
 */
function loadFontConfig() {
  try {
    // Load environment variables from both .env and .env.local
    dotenv.config();
    
    // Get current file directory (ESM equivalent of __dirname)
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    // Try to load .env.local which has priority
    try {
      const projectRoot = path.resolve(__dirname, '../..');
      const envLocalPath = path.join(projectRoot, '.env.local');
      
      if (fs.existsSync(envLocalPath)) {
        const envLocalContent = fs.readFileSync(envLocalPath, 'utf8');
        const envLocalVars = dotenv.parse(envLocalContent);
        
        // Add .env.local variables to process.env
        for (const key in envLocalVars) {
          process.env[key] = envLocalVars[key];
        }
      }
    } catch (error) {
      console.error('Error loading .env.local:', error);
    }

    // Base directory for config files
    const srcConfigDir = path.resolve(process.cwd(), 'src/config');

    // Determine which YAML file to load based on PROPERTY environment variable
    let yamlFilePath = path.join(srcConfigDir, 'fontCombination.yaml'); // Default path
    
    // Check if property-specific config exists
    const propertyCode = process.env.PROPERTY;
    if (propertyCode) {
      const propertyConfigPath = path.join(srcConfigDir, `${propertyCode}.fontCombination.yaml`);
      
      // Check if the property-specific file exists
      if (fs.existsSync(propertyConfigPath)) {
        console.log(`Loading property-specific font configuration for: ${propertyCode}`);
        yamlFilePath = propertyConfigPath;
      } else {
        console.log(`No property-specific font configuration found for: ${propertyCode}, using default`);
      }
    }
    
    // Load the selected YAML configuration
    console.log('Loading font configuration from:', yamlFilePath);
    const yamlContent = fs.readFileSync(yamlFilePath, 'utf8');
    return yaml.load(yamlContent);
  } catch (error) {
    console.error('Error loading font configuration:', error);
    // Return default configuration if YAML loading fails
    return { selectedFontCombination: 1, debugFonts: false };
  }
}

/**
 * Get the selected font combination from YAML configuration
 * @returns {Object} The selected font combination
 */
export function getSelectedFontCombination() {
  try {
    // Load configuration from YAML
    const fontConfig = loadFontConfig();
    
    // Get selected combination (1-based index)
    const combinationNumber = fontConfig.selectedFontCombination || 1;
    const combinationIndex = combinationNumber - 1;
    
    // Ensure the index is valid (between 0 and length-1)
    const validIndex = Math.max(0, Math.min(combinationIndex, fontCombinations.length - 1));
    
    // Log the font combination being used
    console.log(`Using font combination #${validIndex + 1}: ${fontCombinations[validIndex].name}`);
    
    return fontCombinations[validIndex];
  } catch (error) {
    console.error('Error getting font combination:', error);
    return fontCombinations[0]; // Fallback to default
  }
}

export default fontCombinations;
