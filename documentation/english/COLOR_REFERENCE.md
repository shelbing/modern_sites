# Hotel Stern Color Reference

This document provides a complete reference of all colors defined in the Hotel Stern color system (`src/config/colors.js`). Use this reference when developing new components or modifying existing ones to ensure color consistency throughout the application.

## Table of Contents

1. [Theme Colors](#theme-colors)
2. [Section-Specific Colors](#section-specific-colors)
3. [Usage Guidelines](#usage-guidelines)
4. [Dark Mode Considerations](#dark-mode-considerations)

## Theme Colors

These are the core colors defined in the `themeColors` object that serve as the foundation for the entire color system.

### Primary and Secondary Colors

| Token | Light Mode | Dark Mode | Description |
|-------|------------|-----------|-------------|
| `primary` | `#305F85` | `#6B9AC4` | Refined navy blue (light) and lighter blue (dark) |
| `secondary` | `#38A18C` | `#FFEB3B` (temporarily for debugging) | Rich teal (light) and bright yellow for debugging (dark) |

### Background Colors

| Token | Light Mode | Dark Mode | Description |
|-------|------------|-----------|-------------|
| `background` | `#D8D0C8` | `#0F161F` | Warm taupe (light) and nearly black blue (dark) |
| `paper` | `#F8F8F8` | `#1F2937` | Off-white (light) and darker blue-gray (dark) |

### Text Colors

| Token | Light Mode | Dark Mode | Description |
|-------|------------|-----------|-------------|
| `text` | `#2C3E50` | `#E2E8F0` (currently `#9C27B0` for debugging) | Deep navy-charcoal (light) and soft white (dark) |
| `textSecondary` | `#566573` | `#A0AEC0` | Slate gray (light) and muted blue-gray (dark) |

### Accent Colors

| Token | Light Mode | Dark Mode | Description |
|-------|------------|-----------|-------------|
| `accent` | `#D4A15A` | `#F6C066` | Muted gold (light) and lighter gold (dark) |

### Button Colors

| Token | Light Mode | Dark Mode | Description |
|-------|------------|-----------|-------------|
| `primarybutton` | `#305F85` | `#3A6B96` | Match primary (light) and darker blue (dark) |
| `primarybuttontext` | `#FFFFFF` | `#FFFFFF` | White text for both modes |
| `secondarybutton` | `#FFFFFF` | `#253649` | White (light) and dark paper (dark) |
| `secondarybuttontext` | `#305F85` | `#E2E8F0` | Primary color (light) and light text (dark) |
| `button` | `#F0F8FF` | `#1F354A` | Very light blue (light) and darker navy (dark) |
| `buttontext` | `#305F85` | `#E2F0FF` | Primary blue (light) and brighter blue (dark) |

### Header and Menu Colors

| Token | Light Mode | Dark Mode | Description |
|-------|------------|-----------|-------------|
| `heading` | `#2C3E50` | `#E2E8F0` | Deep navy-charcoal (light) and soft white (dark) |
| `menu` | `#F9F7F2` | `#1A2639` | Light background (light) and dark background (dark) |
| `menutext` | `#2C3E50` | `#E2E8F0` | Text for menu items in light and dark modes |
| `menuaccent` | `#305F85` | `#6B9AC4` | Primary accent for menus in both modes |

### Section Header Colors

| Token | Light Mode | Dark Mode | Description |
|-------|------------|-----------|-------------|
| `sectionheader` | `#305F85` | `#6B9AC4` | Primary blue for headers in both modes |
| `sectionsubheader` | `#38A18C` | `#67D5B5` | Secondary teal for subheaders in both modes |

## Section-Specific Colors

The color system includes specialized colors for various sections of the website.

### Hero Section

| Component | Property | Light Mode | Dark Mode |
|-----------|----------|------------|-----------|
| Main Text | Background | `secondary-light` | `primary-dark` |
| Main Text | Opacity | `85%` | `90%` |
| Main Text | Text Color | `paper-light` | `paper-light` |
| Sub Title | Background | `paper-light` | `accent-dark` |
| Sub Title | Opacity | `85%` | `85%` |
| Sub Title | Text Color | `text-light` | `paper-light` |

### Section Block

| Component | Property | Light Mode | Dark Mode |
|-----------|----------|------------|-----------|
| Header | Color | `sectionheader-light` | `sectionheader-dark` |
| Subheader | Color | `sectionsubheader-light` | `sectionsubheader-dark` |

### FAQ Section

| Component | Property | Light Mode | Dark Mode |
|-----------|----------|------------|-----------|
| Question | Background | `paper-light` | `paper-dark` |
| Question | Text Color | `text-light` | `text-dark` |
| Question | Border Color | `accent-light` | `accent-dark` |
| Question (Opened) | Background | `secondary-light` | `secondary-dark` |
| Question (Opened) | Text Color | `paper-light` | `paper-light` |
| Question (Opened) | Border Color | `secondary-light` | `secondary-dark` |
| Answer | Background | `paper-light` | `paper-dark` |
| Answer | Text Color | `text-light` | `text-dark` |
| Answer | Border Color | `accent-light` | `accent-dark` |

### Chatbot Section

| Component | Property | Light Mode | Dark Mode |
|-----------|----------|------------|-----------|
| User Message | Background | `primary-light` | `background-dark` |
| User Message | Text Color | `primarybuttontext-light` | `primarybuttontext-dark` |
| User Message | Time Color | `text-light` | `gray-300` |
| Bot Message | Background | `primary-light` | `secondary-dark` |
| Bot Message | Text Color | `primarybuttontext-light` | `primarybuttontext-dark` |
| Bot Message | Time Color | `text-light` | `gray-300` |
| Container | Background | `paper-light` | `paper-dark` |
| Container | Border Color | `secondary-light` | `secondary-dark` |
| Input Field | Background | `paper-light` | `paper-dark` |
| Input Field | Text Color | `text-light` | `text-dark` |
| Input Field | Border Color | `secondary-light` | `secondary-dark` |

## Usage Guidelines

1. **Always use semantic tokens**: Instead of using raw color values (like `#305F85`), use the semantic tokens (like `text-primary-light`).

2. **Include dark mode variants**: Always pair light mode styles with their dark mode equivalents:
   ```css
   text-text-light dark:text-text-dark
   ```

3. **Follow established patterns**: For common UI elements like buttons, cards, and form inputs, follow the established styling patterns.

4. **Use section-specific colors when appropriate**: Many sections have specialized color schemes; use them when working within those contexts.

5. **Check contrast for accessibility**: Ensure sufficient contrast between text and background colors for readability and WCAG compliance.

## Dark Mode Considerations

1. **Current Debug Setting**: Note that the `text-dark` color is temporarily set to purple (`#9C27B0`) for debugging purposes. In production, it will be restored to the soft white (`#E2E8F0`).

2. **Dark mode is implemented using Tailwind's dark mode variant**: Elements will automatically switch to their dark mode variants when the parent HTML element has the `dark` class.

3. **Test both modes**: Always test your changes in both light and dark modes to ensure proper color application.

4. **Avoid hard-coding colors**: If you need a new color, consult with the design team and add it to the centralized color system in `src/config/colors.js`.
