# Background Color Configuration System

This document explains the centralized background color configuration system for the Hotel Stern website. This system allows for both global and component-specific background color customization while maintaining a consistent approach across different sections.

## Overview

The background color system provides:

1. **Centralized configuration** in `src/config/colors.js`
2. **Component-level override** via props
3. **Consistent styling** across all sections
4. **Dark mode support** with separate colors for light and dark modes
5. **Border configuration** for visual separation between sections

## How It Works

### 1. Centralized Configuration

All section background colors are defined in `src/config/colors.js` under the `sections` object:

```js
// Example from colors.js
sections: {
  default: {
    background: 'background-light',
    darkModeBackground: 'background-dark',
    borderColor: 'gray-200',
    darkModeBorderColor: 'gray-700'
  },
  faq: {
    background: 'blue-50',
    darkModeBackground: 'blue-950',
    borderColor: 'blue-200',
    darkModeBorderColor: 'blue-800'
  },
  // Additional section types...
}
```

Each section type has:
- `background`: Light mode background color 
- `darkModeBackground`: Dark mode background color
- `borderColor`: Light mode border color (optional)
- `darkModeBorderColor`: Dark mode border color (optional)

### 2. Using Section Types

The `SectionBlock` component takes a `sectionType` prop that determines which color configuration to use:

```astro
<SectionBlock 
  header="FAQ Section" 
  subHeader="Frequently Asked Questions"
  sectionType="faq"
>
  <!-- Content -->
</SectionBlock>
```

### 3. Component-Level Override

Components can override the centralized configuration by passing a custom `backgroundColorClass`:

```astro
<SectionBlock 
  header="Custom Background" 
  subHeader="With custom background color"
  backgroundColorClass="bg-yellow-100 dark:bg-yellow-900"
>
  <!-- Content -->
</SectionBlock>
```

### 4. Border Configuration

Sections can have optional borders for visual separation:

```astro
<SectionBlock 
  header="Bordered Section" 
  subHeader="With border"
  sectionType="faq"
  withBorder={true}
>
  <!-- Content -->
</SectionBlock>
```

Custom border colors can be specified with `borderColorClass`:

```astro
<SectionBlock 
  header="Custom Border" 
  subHeader="With custom border"
  withBorder={true}
  borderColorClass="border-red-300 dark:border-red-700"
>
  <!-- Content -->
</SectionBlock>
```

### 5. Storyblok Integration

Section components can accept custom background colors from Storyblok:

```astro
<!-- Example from FAQ.astro -->
<SectionBlock 
  header={header} 
  subHeader={subHeader}
  sectionType="faq"
  backgroundColorClass={blok.BackgroundColor} // Custom background from Storyblok
>
  <!-- Content -->
</SectionBlock>
```

## Available Section Types

The following section types are pre-configured:

| Section Type    | Light Mode       | Dark Mode        |
|-----------------|------------------|------------------|
| default         | background-light | background-dark  |
| faq             | blue-50          | blue-950         |
| pictureGallery  | gray-50          | gray-900         |
| rooms           | green-50         | green-950        |
| services        | amber-50         | amber-950        |
| testimonials    | rose-50          | rose-950         |
| contact         | purple-50        | purple-950       |
| chatbot         | sky-50           | sky-950          |

## Room Card Configuration

Room cards have special configuration based on room type:

```js
// From colors.js
roomCard: {
  background: 'white',
  darkModeBackground: 'gray-800',
  textColor: 'gray-900',
  darkModeTextColor: 'gray-100',
  borderColor: 'gray-200',
  darkModeBorderColor: 'gray-700',
  // Variations for different room types
  standard: {
    background: 'white',
    darkModeBackground: 'gray-800'
  },
  deluxe: {
    background: 'amber-50',
    darkModeBackground: 'amber-900'
  },
  suite: {
    background: 'emerald-50',
    darkModeBackground: 'emerald-900'
  }
}
```

## Best Practices

1. **Use section types whenever possible** to maintain consistency
2. **Only override colors when necessary** for specific design requirements
3. **Consider dark mode** in all color choices
4. **Test all color combinations** for accessibility and readability
5. **Add new section types** to the centralized configuration rather than using custom classes everywhere
6. **Document any custom color decisions** in component comments

## Adding New Section Types

To add a new section type:

1. Add the new section type to the `sections` object in `colors.js`
2. Include background and border colors for both light and dark modes
3. Use the new section type in your component via the `sectionType` prop

## Example

```astro
<!-- Example of a new hero section using the centralized config -->
<SectionBlock
  header="Welcome to Hotel Stern"
  subHeader="Luxury accommodations in the heart of the city"
  sectionType="hero"
  withBorder={true}
>
  <div class="flex flex-col items-center">
    <!-- Hero content -->
  </div>
</SectionBlock>
```
