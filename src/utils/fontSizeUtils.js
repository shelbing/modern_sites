/**
 * Font Size Utility Functions
 * 
 * This file provides utility functions to help with font size management
 * and migration from hardcoded values to the centralized font size system.
 */

import { getFontSize, getAllFontSizes } from '../config/fontSizes.js';

/**
 * Converts a pixel value to rem units based on the base font size (20px)
 * @param {number} px - The pixel value to convert
 * @returns {string} - The equivalent rem value as a string with 'rem' suffix
 */
export function pxToRem(px) {
  const baseSize = 20; // Base font size in pixels
  return `${px / baseSize}rem`;
}

/**
 * Converts a rem value to pixels based on the base font size (20px)
 * @param {number|string} rem - The rem value to convert (can be a number or string with 'rem' suffix)
 * @returns {number} - The equivalent pixel value
 */
export function remToPx(rem) {
  const baseSize = 20; // Base font size in pixels
  
  // If rem is a string with 'rem' suffix, extract the numeric value
  if (typeof rem === 'string') {
    rem = parseFloat(rem.replace('rem', ''));
  }
  
  return rem * baseSize;
}

/**
 * Gets a font size by key and returns it as a CSS variable reference
 * @param {string} key - The font size key (e.g., 'h1', 'body.base')
 * @returns {string} - CSS variable reference (e.g., 'var(--font-size-h1)')
 */
export function getCssFontSize(key) {
  // Convert nested keys (e.g., 'body.base') to CSS variable format (e.g., 'body-base')
  const cssKey = key.replace(/\./g, '-');
  return `var(--font-size-${cssKey})`;
}

/**
 * Gets a font size by key and returns the actual rem value
 * @param {string} key - The font size key (e.g., 'h1', 'body.base')
 * @returns {string} - The font size value in rem units
 */
export function getFontSizeValue(key) {
  return getFontSize(key);
}

/**
 * Determines if a value is likely a font size
 * @param {string} value - The value to check
 * @returns {boolean} - True if the value is likely a font size
 */
export function isFontSize(value) {
  // Check for common font size patterns
  return (
    // Check for rem units
    /^\d+(\.\d+)?rem$/.test(value) ||
    // Check for pixel units
    /^\d+(\.\d+)?px$/.test(value) ||
    // Check for em units
    /^\d+(\.\d+)?em$/.test(value) ||
    // Check for percentage
    /^\d+(\.\d+)?%$/.test(value) ||
    // Check for viewport units
    /^\d+(\.\d+)?v[wh]$/.test(value)
  );
}

/**
 * Suggests the closest matching font size key for a given value
 * @param {string} value - The font size value to match
 * @returns {string|null} - The closest matching font size key or null if no match
 */
export function suggestFontSizeKey(value) {
  // Convert value to rem for comparison
  let remValue;
  
  if (value.endsWith('px')) {
    remValue = pxToRem(parseFloat(value));
  } else if (value.endsWith('rem')) {
    remValue = value;
  } else {
    return null; // Can't suggest for non-px/rem values
  }
  
  // Get all font sizes
  const allSizes = getAllFontSizeValues();
  
  // Find the closest match
  let closestKey = null;
  let smallestDiff = Infinity;
  
  for (const [key, sizeValue] of Object.entries(allSizes)) {
    const diff = Math.abs(parseFloat(remValue) - parseFloat(sizeValue));
    
    if (diff < smallestDiff) {
      smallestDiff = diff;
      closestKey = key;
    }
  }
  
  // Only suggest if the difference is small enough
  return smallestDiff < 0.2 ? closestKey : null;
}

/**
 * Gets all font size values as a flattened object
 * @returns {Object} - Flattened object with all font size keys and values
 */
function getAllFontSizeValues() {
  const result = {};
  
  // Add heading sizes
  for (let i = 1; i <= 6; i++) {
    result[`h${i}`] = getFontSize(`h${i}`);
  }
  
  // Add body sizes
  const bodySizes = ['xs', 'sm', 'base', 'lg', 'xl'];
  for (const size of bodySizes) {
    result[`body.${size}`] = getFontSize(`body.${size}`);
  }
  
  // Add special sizes
  const specialSizes = [
    'button', 'caption', 'label', 'price', 'badge', 'debug'
  ];
  
  for (const size of specialSizes) {
    result[size] = getFontSize(size);
  }
  
  // Only add rich text sizes if they exist in the config
  try {
    if (getFontSize('rich.desktop')) {
      result['rich.desktop'] = getFontSize('rich.desktop');
      result['rich.tablet'] = getFontSize('rich.tablet');
      result['rich.mobile'] = getFontSize('rich.mobile');
    }
  } catch (e) {
    // Rich text sizes not available, skip them
  }
  
  return result;
}

export default {
  pxToRem,
  remToPx,
  getCssFontSize,
  getFontSizeValue,
  isFontSize,
  suggestFontSizeKey
};
