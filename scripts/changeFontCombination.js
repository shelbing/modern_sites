#!/usr/bin/env node

/**
 * Font Combination Switcher for Hotel Stern
 * 
 * This script allows you to easily switch between font combinations
 * by setting the FONT_COMBINATION environment variable and regenerating
 * the Tailwind configuration.
 * 
 * Usage: node scripts/changeFontCombination.js [combination-number]
 */

import { execSync } from 'child_process';
import fontCombinations from '../src/config/fontCombinations.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Load environment variables from .env file
dotenv.config({ path: path.join(rootDir, '.env') });

// Get the font combination number from command line arguments
const args = process.argv.slice(2);
const combinationNumber = parseInt(args[0], 10);

if (isNaN(combinationNumber) || combinationNumber < 1 || combinationNumber > fontCombinations.length) {
  console.log('\x1b[31mError: Please provide a valid font combination number (1-16)\x1b[0m');
  console.log('\nAvailable font combinations:');
  
  fontCombinations.forEach((combo, index) => {
    console.log(`\x1b[36m${index + 1}:\x1b[0m ${combo.name} (${combo.heading}/${combo.body})`);
  });
  
  process.exit(1);
}

// Update or create .env file with the new font combination
try {
  const envPath = path.join(rootDir, '.env');
  let envContent = '';
  
  // Read existing .env file if it exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
    
    // Replace or add FONT_COMBINATION
    if (envContent.includes('FONT_COMBINATION=')) {
      envContent = envContent.replace(/FONT_COMBINATION=\d+/, `FONT_COMBINATION=${combinationNumber}`);
    } else {
      envContent += `\nFONT_COMBINATION=${combinationNumber}\n`;
    }
  } else {
    // Create new .env file
    envContent = `FONT_COMBINATION=${combinationNumber}\n`;
  }
  
  // Write to .env file
  fs.writeFileSync(envPath, envContent);
  
  // Get the selected font combination
  const selectedCombo = fontCombinations[combinationNumber - 1];
  
  console.log(`\x1b[32mFont combination changed to: \x1b[0m`);
  console.log(`\x1b[36m${combinationNumber}:\x1b[0m ${selectedCombo.name}`);
  console.log(`  Heading: ${selectedCombo.heading}`);
  console.log(`  Body: ${selectedCombo.body}`);
  
  // Set the environment variable for the current process
  process.env.FONT_COMBINATION = combinationNumber.toString();
  
  // Regenerate Tailwind config
  console.log('\nRegenerating Tailwind configuration...');
  execSync('node generateTailwindConfig.js', { 
    stdio: 'inherit', 
    cwd: rootDir,
    env: { ...process.env, FONT_COMBINATION: combinationNumber.toString() }
  });
  
  console.log('\x1b[32m\nDone! Restart the development server to see the changes.\x1b[0m');
  
} catch (error) {
  console.error('\x1b[31mError updating font combination:\x1b[0m', error);
  process.exit(1);
}
