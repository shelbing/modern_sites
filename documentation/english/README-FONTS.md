# Hotel Stern Font System Guide

## Overview

The Hotel Stern website uses a flexible font system that allows you to easily switch between 23 different font combinations. Each combination includes a heading font (serif) and a body font (sans-serif), carefully selected to work well together and provide optimal readability, including proper rendering of German umlauts (ä, ö, ü, Ä, Ö, Ü).

## Changing Font Combinations

### Method 1: Using the Font Script (Recommended)

The easiest way to change font combinations is to use the provided npm script:

```bash
npm run font <number>
```

Where `<number>` is the number of the font combination you want to use (1-23).

For example:
- `npm run font 1` - Classic Luxury (Playfair Display/Roboto)
- `npm run font 5` - Alpine Retreat (Lora/Open Sans)
- `npm run font 16` - German-Optimized (Noto Serif/Noto Sans)
- `npm run font 20` - Rustic Charm (Amatic SC/Quattrocento Sans)

After running this script, restart your development server to see the changes:

```bash
npm run dev
```

The script will:
1. Update the `.env` file with your chosen font combination
2. Regenerate the Tailwind configuration
3. Show you which fonts will be used

### Method 2: Using the Font Preview Page

The website now includes a visual font preview page that allows you to see and select fonts directly from the browser:

1. Visit `/font-preview` in your browser
2. Browse through all available font combinations
3. Click the "Activate Font" button on any font combination you want to use
4. The page will refresh with the new font applied

### Method 3: Using the Font Management Page

For more detailed font management, visit the admin fonts page:

1. Go to `/admin/fonts` in your browser
2. View popular font combinations and font system information
3. Access the full font preview page from there

### Method 4: Manually Editing the .env File

You can manually edit the `.env` file:

1. Open the `.env` file
2. Change the `FONT_COMBINATION` value to a number between 1-23
3. Save the file
4. Restart the development server

## Available Font Combinations

1. **Classic Luxury**: Playfair Display / Roboto
2. **Modern Elegance**: Cormorant Garamond / Montserrat
3. **Boutique Hotel**: Libre Baskerville / Source Sans Pro
4. **Contemporary Resort**: Prata / Work Sans
5. **Alpine Retreat**: Lora / Open Sans
6. **Urban Chic**: DM Serif Display / Nunito Sans
7. **Seaside Resort**: Spectral / Karla
8. **Heritage Hotel**: Crimson Text / Raleway
9. **Business Traveler**: Merriweather / IBM Plex Sans
10. **Wellness Spa**: Cardo / Quicksand
11. **Mountain Lodge**: Vollkorn / Assistant
12. **Luxury Chateau**: Cormorant / Outfit
13. **Minimalist Design**: Tenor Sans / Inter
14. **Historic Inn**: EB Garamond / Cabin
15. **Artisan Boutique**: Fraunces / Rubik
16. **German-Optimized**: Noto Serif / Noto Sans
17. **Bohemian Flair**: Abril Fatface / Poppins
18. **Nordic Minimalism**: Josefin Slab / Josefin Sans
19. **Art Deco Revival**: Poiret One / Didact Gothic
20. **Rustic Charm**: Amatic SC / Quattrocento Sans
21. **Vintage Typewriter**: Special Elite / Courier Prime
22. **Swiss Precision**: Bebas Neue / Roboto Mono
23. **Elegant Simplicity**: Lora / Inter

## Font Testing Tools

### Automated Font Testing

The system now includes tools to help you test and compare different font combinations:

```bash
# Test all fonts (3 seconds per font)
npm run font:test

# Test all fonts with custom delay
npm run font:test -- --delay=5

# Test a specific range of fonts
npm run font:test -- --start=10 --end=15

# Loop continuously through all fonts
npm run font:test:loop

# Loop through a specific range with custom delay
npm run font:test:loop -- --start=17 --end=22 --delay=10
```

### Font Showcase Component

You can use the `FontShowcase` component in your pages to display the current font:

```astro
---
import FontShowcase from '../components/FontShowcase.astro';
---

<FontShowcase />
```

Options:
- `showName={true|false}` - Show/hide the font name
- `showInfo={true|false}` - Show/hide font details
- `compact={true|false}` - Use compact display mode

## Umlaut Support

All font combinations now include the Latin Extended character set, which ensures proper display of umlauts and other special characters. The German-Optimized combination (#16) is specifically designed for excellent umlaut rendering.

## Technical Details

When you change the font combination:

1. The `scripts/changeFontCombination.js` script updates the `.env` file
2. The `generateTailwindConfig.js` script reads this value and updates the Tailwind configuration
3. The `CustomFonts.astro` component loads the appropriate Google Fonts
4. The `Fonts.astro` component sets CSS variables for the fonts
5. The CSS in `custom-fonts.css` applies these fonts to different elements

## Troubleshooting

If you're experiencing issues with font combinations:

1. **Font not changing**: Make sure to restart the development server after changing the font combination
2. **Environment variable not being read**: Check that the `.env` file has the correct `FONT_COMBINATION` value
3. **Umlauts not displaying correctly**: Ensure you're using a font combination that supports Latin Extended characters
4. **Preview page not working**: Make sure your development server is running and the API endpoint is accessible

## Adding New Font Combinations

To add a new font combination:

1. Edit `src/config/fontCombinations.js`
2. Add a new entry to the array following the existing pattern
3. Make sure to include the Latin Extended subset for proper umlaut support
4. Update the `.env.example` file with the new combination
