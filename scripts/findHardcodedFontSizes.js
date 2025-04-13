#!/usr/bin/env node

/**
 * Font Size Migration Helper Script
 * 
 * This script scans the codebase for hardcoded font sizes and suggests
 * replacements using the centralized font size system.
 * 
 * Usage:
 *   node scripts/findHardcodedFontSizes.js [directory]
 * 
 * If no directory is specified, it will scan the src directory.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Import the font size utilities
import { isFontSize, suggestFontSizeKey } from '../src/utils/fontSizeUtils.js';
import { getFontSize } from '../src/config/fontSizes.js';

// File extensions to scan
const EXTENSIONS_TO_SCAN = ['.js', '.jsx', '.ts', '.tsx', '.astro', '.vue', '.svelte', '.css', '.scss', '.less'];

// Directories to exclude
const EXCLUDE_DIRS = ['node_modules', 'dist', 'build', '.git', '.github'];

// Get the directory to scan from command line args or default to src
const dirToScan = process.argv[2] ? path.resolve(process.argv[2]) : path.join(rootDir, 'src');

// Regular expressions for finding font sizes
const CSS_FONT_SIZE_REGEX = /font-size\s*:\s*([^;]+);/g;
const INLINE_STYLE_REGEX = /style=["'].*?font-size\s*:\s*([^;'"]+).*?["']/g;
const TAILWIND_FONT_SIZE_REGEX = /text-\[([\d.]+)(px|rem|em|%|vh|vw)\]/g;

// Counter for statistics
let totalFiles = 0;
let filesWithHardcodedSizes = 0;
let totalHardcodedSizes = 0;

/**
 * Main function to scan files for hardcoded font sizes
 */
async function findHardcodedFontSizes() {
  console.log(chalk.blue('🔍 Scanning for hardcoded font sizes...'));
  console.log(chalk.gray(`📁 Directory: ${dirToScan}`));
  
  try {
    await scanDirectory(dirToScan);
    
    // Print summary
    console.log(chalk.blue('\n📊 Summary:'));
    console.log(chalk.white(`Total files scanned: ${totalFiles}`));
    console.log(chalk.white(`Files with hardcoded font sizes: ${filesWithHardcodedSizes}`));
    console.log(chalk.white(`Total hardcoded font sizes found: ${totalHardcodedSizes}`));
    
    if (totalHardcodedSizes > 0) {
      console.log(chalk.yellow('\n⚠️ Hardcoded font sizes were found. Consider migrating to the centralized font size system.'));
      console.log(chalk.gray('See FONT_SIZE_SYSTEM.md for migration guidelines.'));
    } else {
      console.log(chalk.green('\n✅ No hardcoded font sizes found. Great job!'));
    }
  } catch (error) {
    console.error(chalk.red('Error scanning files:'), error);
    process.exit(1);
  }
}

/**
 * Recursively scan a directory for files
 */
async function scanDirectory(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    
    if (entry.isDirectory()) {
      // Skip excluded directories
      if (EXCLUDE_DIRS.includes(entry.name)) continue;
      
      // Recursively scan subdirectories
      await scanDirectory(fullPath);
    } else if (entry.isFile()) {
      // Check if the file has an extension we want to scan
      const ext = path.extname(entry.name).toLowerCase();
      if (EXTENSIONS_TO_SCAN.includes(ext)) {
        totalFiles++;
        await scanFile(fullPath);
      }
    }
  }
}

/**
 * Scan a single file for hardcoded font sizes
 */
async function scanFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    const relativePath = path.relative(rootDir, filePath);
    
    // Track if this file has any hardcoded sizes
    let fileHasHardcodedSizes = false;
    let hardcodedSizesInFile = 0;
    
    // Find CSS font-size declarations
    const cssFontSizes = findMatches(content, CSS_FONT_SIZE_REGEX, 1);
    
    // Find inline style font-size declarations
    const inlineStyleFontSizes = findMatches(content, INLINE_STYLE_REGEX, 1);
    
    // Find Tailwind arbitrary font sizes
    const tailwindFontSizes = findMatches(content, TAILWIND_FONT_SIZE_REGEX, (match) => {
      return `${match[1]}${match[2]}`;
    });
    
    // Combine all found font sizes
    const allFontSizes = [...cssFontSizes, ...inlineStyleFontSizes, ...tailwindFontSizes];
    
    // Filter out font sizes that are already using CSS variables
    const hardcodedFontSizes = allFontSizes.filter(size => {
      return !size.includes('var(--') && isFontSize(size.trim());
    });
    
    // If we found hardcoded font sizes, report them
    if (hardcodedFontSizes.length > 0) {
      fileHasHardcodedSizes = true;
      hardcodedSizesInFile = hardcodedFontSizes.length;
      
      console.log(chalk.yellow(`\n📄 ${relativePath}`));
      
      hardcodedFontSizes.forEach(size => {
        const trimmedSize = size.trim();
        const suggestion = suggestFontSizeKey(trimmedSize);
        
        console.log(chalk.red(`  ❌ Hardcoded: ${trimmedSize}`));
        
        if (suggestion) {
          const suggestedValue = getFontSize(suggestion);
          console.log(chalk.green(`  ✅ Suggested: var(--font-size-${suggestion.replace('.', '-')}) (${suggestedValue})`));
        } else {
          console.log(chalk.gray(`  ℹ️ No direct match in the font size system`));
        }
      });
    }
    
    // Update statistics
    if (fileHasHardcodedSizes) {
      filesWithHardcodedSizes++;
      totalHardcodedSizes += hardcodedSizesInFile;
    }
  } catch (error) {
    console.error(chalk.red(`Error scanning file ${filePath}:`), error);
  }
}

/**
 * Find all matches of a regex in content
 */
function findMatches(content, regex, extractGroup) {
  const matches = [];
  let match;
  
  while ((match = regex.exec(content)) !== null) {
    const extracted = typeof extractGroup === 'function' 
      ? extractGroup(match) 
      : match[extractGroup];
    
    matches.push(extracted);
  }
  
  return matches;
}

// Run the script
findHardcodedFontSizes();
