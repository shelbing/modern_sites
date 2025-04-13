/**
 * Type definitions for font combinations
 */

export interface FontCombination {
  name: string;
  heading: string;
  body: string;
  headingWeights: string;
  bodyWeights: string;
  googleFontsUrl: string;
}

declare const fontCombinations: FontCombination[];

export function getSelectedFontCombination(): FontCombination;

export default fontCombinations;
