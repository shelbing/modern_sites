#!/usr/bin/env node

/**
 * Font Combination Testing Script
 * 
 * This script cycles through all font combinations in the system,
 * allowing you to preview each one for a specified amount of time.
 * 
 * Usage:
 *   node scripts/testAllFonts.js [options]
 * 
 * Options:
 *   --delay=<seconds>   Time to display each font (default: 3 seconds)
 *   --start=<number>    Starting font combination (default: 1)
 *   --end=<number>      Ending font combination (default: 22)
 *   --loop              Loop through fonts continuously (default: false)
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '../');

// Load environment variables
dotenv.config({ path: path.join(rootDir, '.env') });

// Parse command line arguments
const args = process.argv.slice(2);
let delay = 3; // Default delay in seconds
let startFont = 1;
let endFont = 22;
let loop = false;

args.forEach(arg => {
  if (arg.startsWith('--delay=')) {
    delay = parseInt(arg.split('=')[1], 10);
  } else if (arg.startsWith('--start=')) {
    startFont = parseInt(arg.split('=')[1], 10);
  } else if (arg.startsWith('--end=')) {
    endFont = parseInt(arg.split('=')[1], 10);
  } else if (arg === '--loop') {
    loop = true;
  }
});

// Validate input
if (isNaN(delay) || delay < 1) {
  console.error('Error: Delay must be a positive number');
  process.exit(1);
}

if (isNaN(startFont) || startFont < 1 || startFont > 22) {
  console.error('Error: Start font must be between 1 and 22');
  process.exit(1);
}

if (isNaN(endFont) || endFont < 1 || endFont > 22 || endFont < startFont) {
  console.error('Error: End font must be between start font and 22');
  process.exit(1);
}

// Function to change font
function changeFont(fontId) {
  try {
    console.log(`\n🔄 Changing to font combination #${fontId}...`);
    execSync(`node ${path.join(__dirname, 'changeFontCombination.js')} ${fontId}`, { 
      stdio: 'inherit',
      env: { ...process.env, FONT_COMBINATION: fontId.toString() }
    });
    console.log(`✅ Font combination #${fontId} activated`);
    
    // Get the font combination details from the .env file
    const envConfig = dotenv.parse(fs.readFileSync(path.join(rootDir, '.env')));
    const fontName = envConfig.FONT_NAME || 'Unknown';
    const headingFont = envConfig.FONT_HEADING || 'Unknown';
    const bodyFont = envConfig.FONT_BODY || 'Unknown';
    
    console.log(`\n📝 Current Font Details:`);
    console.log(`   Name: ${fontName}`);
    console.log(`   Heading: ${headingFont}`);
    console.log(`   Body: ${bodyFont}`);
    console.log(`\n⏱️  Waiting for ${delay} seconds...\n`);
  } catch (error) {
    console.error(`❌ Error changing font: ${error.message}`);
  }
}

// Main function to cycle through fonts
async function cycleFonts() {
  console.log('\n🔤 Font Combination Testing Tool 🔤');
  console.log('====================================');
  console.log(`Testing font combinations from #${startFont} to #${endFont}`);
  console.log(`Each font will display for ${delay} seconds`);
  console.log(`Loop mode: ${loop ? 'ON' : 'OFF'}`);
  console.log('====================================\n');
  
  do {
    for (let fontId = startFont; fontId <= endFont; fontId++) {
      changeFont(fontId);
      await new Promise(resolve => setTimeout(resolve, delay * 1000));
    }
  } while (loop);
  
  console.log('\n✨ Font testing complete!');
  console.log('To keep the last font active, no further action is needed.');
  console.log('To return to your previous font, run:');
  console.log('npm run font <your-preferred-font-number>\n');
}

// Run the script
cycleFonts().catch(error => {
  console.error(`❌ Error: ${error.message}`);
  process.exit(1);
});
