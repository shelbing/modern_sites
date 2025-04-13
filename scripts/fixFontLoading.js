#!/usr/bin/env node

/**
 * Fix Font Loading Issues
 * 
 * This script fixes font loading issues in the Hotel Stern web application.
 * It updates the necessary files to ensure fonts are loaded correctly.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

async function fixFontLoading() {
  try {
    console.log('Starting font loading fixes...');
    
    // 1. Update the custom-fonts.css file
    const cssPath = path.join(rootDir, 'src', 'styles', 'custom-fonts.css');
    const cssContent = `/* 
 * Custom Fonts CSS
 * 
 * This file contains CSS for custom fonts loaded from Google Fonts.
 * The actual font loading is handled by CustomFonts.astro and Fonts.astro.
 */

/* Apply heading font to headings */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-family-heading);
}

/* Apply body font to body text */
body {
  font-family: var(--font-family-body);
}

/* Font loading indicator (only in development mode) */
.font-loading-indicator {
  position: fixed;
  bottom: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
  font-size: 12px;
  z-index: 9999;
}

/* Debug styles */
.font-debug {
  font-family: monospace;
  font-size: 12px;
  line-height: 1.4;
  margin: 10px 0;
  padding: 10px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: auto;
  max-height: 300px;
}

.font-debug-success {
  color: green;
}

.font-debug-error {
  color: red;
}
`;
    
    await fs.writeFile(cssPath, cssContent);
    console.log('Updated custom-fonts.css');
    
    // 2. Create a package.json script to fix font loading
    const packageJsonPath = path.join(rootDir, 'package.json');
    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
    
    // Add the font:fix script if it doesn't exist
    if (!packageJson.scripts['font:fix']) {
      packageJson.scripts['font:fix'] = 'node scripts/fixFontLoading.js';
      await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('Added font:fix script to package.json');
    }
    
    console.log('Font loading fixes completed successfully!');
    console.log('\nTo use the fixes:');
    console.log('1. Restart the development server');
    console.log('2. Clear your browser cache');
    console.log('3. Visit the font-preview page to see the debugging information');
    
  } catch (error) {
    console.error('Error fixing font loading:', error);
  }
}

// Run the function
fixFontLoading();
