#!/usr/bin/env node

/**
 * Fix Tailwind Config Font Families
 * 
 * This script fixes the tailwind.config.mjs file to use the correct font families
 * from the selected font combination.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import fontCombinations from '../src/config/fontCombinations.js';
import dotenv from 'dotenv';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Load environment variables from .env file
dotenv.config({ path: path.join(rootDir, '.env') });

async function fixTailwindConfig() {
  try {
    // Get the font combination number from environment variable
    const combinationNumber = parseInt(process.env.FONT_COMBINATION || '1', 10);
    const validIndex = Math.max(0, Math.min(combinationNumber - 1, fontCombinations.length - 1));
    const selectedFontCombination = fontCombinations[validIndex];
    
    console.log(`Using font combination: ${combinationNumber}`);
    console.log(`Selected font combination: ${selectedFontCombination.name}`);
    console.log(`Heading font: ${selectedFontCombination.heading}`);
    console.log(`Body font: ${selectedFontCombination.body}`);
    
    // Read the current tailwind.config.mjs file
    const configPath = path.join(rootDir, 'tailwind.config.mjs');
    let configContent = await fs.readFile(configPath, 'utf8');
    
    // Check if the font families are hardcoded
    const fontFamilyRegex = /"fontFamily":\s*{\s*"sans":\s*\[\s*"([^"]+)"\s*\],\s*"serif":\s*\[\s*"([^"]+)"\s*\]/;
    const match = configContent.match(fontFamilyRegex);
    
    if (match) {
      const currentSans = match[1];
      const currentSerif = match[2];
      
      console.log(`Current sans font in tailwind config: "${currentSans}"`);
      console.log(`Current serif font in tailwind config: "${currentSerif}"`);
      
      // Check if they match the selected font combination
      if (currentSans !== selectedFontCombination.body || currentSerif !== selectedFontCombination.heading) {
        console.log('Font families in tailwind config do not match the selected font combination. Fixing...');
        
        // Replace the font families
        const updatedConfig = configContent.replace(
          fontFamilyRegex,
          `"fontFamily": {\n      "sans": [\n        "${selectedFontCombination.body}"\n      ],\n      "serif": [\n        "${selectedFontCombination.heading}"\n      ]`
        );
        
        // Write the updated config back to the file
        await fs.writeFile(configPath, updatedConfig);
        
        console.log('Tailwind config updated successfully!');
      } else {
        console.log('Font families in tailwind config already match the selected font combination.');
      }
    } else {
      console.error('Could not find font family configuration in tailwind.config.mjs');
    }
  } catch (error) {
    console.error('Error fixing tailwind config:', error);
  }
}

// Run the function
fixTailwindConfig();
