/**
 * Type definitions for Image component
 */

// Badge position options
export type BadgePosition = 'upper-left' | 'upper-right' | 'lower-left' | 'lower-right';

// Badge properties interface
export interface BadgeProps {
  text?: string;
  position?: BadgePosition;
  color?: string;
  textColor?: string;
  darkModeColor?: string;
  darkModeTextColor?: string;
}

// Image component props
export interface ImageProps {
  imageId?: string;
  alt?: string;
  width?: string | number;
  height?: string | number;
  transformMode?: string;
  quality?: number;
  class?: string;
  link?: string;
  headerText?: string;
  badges?: BadgeProps[];
  backgroundRemoval?: boolean;
}
