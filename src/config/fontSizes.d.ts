/**
 * Type definitions for font sizes
 */

export interface FontSizeRecord {
  [key: string]: string | FontSizeRecord;
}

export interface FontSizes {
  xs: FontSizeRecord;
  sm: FontSizeRecord;
  base: FontSizeRecord;
  lg: FontSizeRecord;
  xl: FontSizeRecord;
  '2xl': FontSizeRecord;
  '3xl': FontSizeRecord;
  '4xl': FontSizeRecord;
  '5xl': FontSizeRecord;
  '6xl': FontSizeRecord;
  '7xl': FontSizeRecord;
  '8xl': FontSizeRecord;
  '9xl': FontSizeRecord;
}

declare const fontSizes: FontSizes;

export default fontSizes;
