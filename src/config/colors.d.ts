/**
 * Type definitions for colors
 */

export interface ThemeColorItem {
  light: string;
  dark: string;
}

export interface SectionColors {
  background: string;
  darkModeBackground: string;
  borderColor: string;
  darkModeBorderColor: string;
}

export interface Colors {
  primary: ThemeColorItem;
  secondary: ThemeColorItem;
  background: ThemeColorItem;
  paper: ThemeColorItem;
  text: ThemeColorItem;
  textSecondary: ThemeColorItem;
  accent: ThemeColorItem;
  primarybutton: ThemeColorItem;
  primarybuttontext: ThemeColorItem;
  secondarybutton: ThemeColorItem;
  secondarybuttontext: ThemeColorItem;
  heading: ThemeColorItem;
  menu: ThemeColorItem;
  menutext: ThemeColorItem;
  menuaccent: ThemeColorItem;
  sectionheader: ThemeColorItem;
  sectionsubheader: ThemeColorItem;
  team: {
    name: {
      color: string;
      darkModeColor: string;
    };
    title: {
      color: string;
      darkModeColor: string;
    };
  };
  sections: {
    default: SectionColors;
    team: SectionColors;
    faq: SectionColors;
    pictureGallery: SectionColors;
    rooms: SectionColors;
    services: SectionColors;
    testimonials: SectionColors;
    contact: SectionColors;
    chatbot: SectionColors;
    map: SectionColors;
    [key: string]: SectionColors;
  };
  "pictureGallery-caption-bg": string;
  "pictureGallery-caption-text": string;
  pictureGallery: {
    caption: {
      borderColor: string;
      darkModeBorder: string;
      background: string;
      darkModeBackground: string;
      textColor: string;
      darkModeTextColor: string;
    };
  };
}

export function getColor(key: string): string | undefined;
export function getAllColors(): Colors;

declare const colors: Colors;
export default colors;
