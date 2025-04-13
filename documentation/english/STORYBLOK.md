# Storyblok Integration Documentation

This document provides a comprehensive guide to the Storyblok Content Management System (CMS) integration in the Hotel Stern website project. It covers the technical implementation, component interaction, and data override mechanisms.

## Table of Contents

1. [Overview](#overview)
2. [Configuration](#configuration)
3. [Content Structure](#content-structure)
4. [Storyblok Components](#storyblok-components)
5. [Data Flow](#data-flow)
6. [Overridable Settings](#overridable-settings)
7. [API Integration](#api-integration)
8. [Multilingual Support](#multilingual-support)
9. [Development Workflow](#development-workflow)
10. [Best Practices](#best-practices)

## Overview

The Hotel Stern website utilizes Storyblok as its headless CMS solution. This integration allows for:

- Content management by non-technical team members
- Multilingual content support
- Component-based content modeling
- Live preview capabilities
- Version control for content

The architecture follows a clear separation between content (managed in Storyblok) and presentation (built with Astro.js and Svelte), allowing for flexible content delivery across multiple channels.

## Configuration

### Core Configuration

The Storyblok integration is configured in `storyblokConfig.js` at the project root:

```javascript
// Initializes the Storyblok JavaScript client with your access token
const Storyblok = new StoryblokClient({
  accessToken: env.STORYBLOK_TOKEN,
  cache: {
    clear: "auto",
    type: "memory",
  },
});

// Core function to retrieve Storyblok data with language support
export default async function getStoryblokConfig(lang="de") {
  try {
    const { data } = await Storyblok.get(
      "cdn/stories/" + hotel + "/grunddaten",
      {
        version: process.env.NODE_ENV === "development" ? "draft" : "published",
        language: lang,
      }
    );

    return data;
  } catch (error) {
    console.error("Error fetching Storyblok data:", error);
    return null;
  }
}
```

### Environment Variables

The following environment variables control the Storyblok integration:

- `STORYBLOK_TOKEN`: Your Storyblok access token
- `PROPERTY`: Hotel property identifier used in Storyblok content structure
- `NODE_ENV`: Controls whether draft or published content is displayed

## Content Structure

### Story Organization

Content in Storyblok is organized in a hierarchical structure:

1. **Property Level**: Top-level folder named by the hotel property identifier
2. **Page Content**: Individual pages stored as "stories" 
3. **Basic Data**: Core hotel information stored in "grunddaten" story
4. **Component Blocks**: Modular content blocks within each story

### Core Content Types

| Content Type | Purpose | Example Usage |
|--------------|---------|---------------|
| Grunddaten | Core hotel information | Contact details, address, legal info |
| Pages | Individual website pages | Home page, About, Rooms |
| Rooms | Room descriptions | Room types, amenities, pricing |
| Sections | Reusable content sections | Hero banners, testimonials |

## Storyblok Components

The integration uses component mapping to render Storyblok content blocks as Astro/Svelte components:

### Core Components

#### Page Component (`src/components/storyblok/Page.astro`)

```astro
<main {...storyblokEditable(blok)}>
  {
    blok.body?.map((blok: SbBlokData) => {
      return <StoryblokComponent language={language} blok={blok} />
    })
  }
</main>
```

This component serves as the root container for Storyblok page content, mapping nested content blocks to their respective components.

### Section Components

The following components receive and render Storyblok content:

| Component | Purpose | Storyblok Fields |
|-----------|---------|------------------|
| `GoogleMap.astro` | Displays a Google Map | Location, Header |
| `PictureGallery.astro` | Image gallery | Header, Subheader, Images, Rows, Columns |
| `PDFDownloadSection.astro` | PDF downloads | Header, Subheader, ButtonText, File |
| `ZimmerListe.astro` | Lists room options | BackgroundColor, Zimmer[] |
| `StorySection.astro` | General content section | Header, SubHeader, Text, Image1, Image2, Ausrichtung |
| `FAQ.astro` | FAQ accordions | Header, SubHeader, faqItems[] |
| `SliderSection.astro` | Image/content slider | Various slider options |
| `TeamSection.astro` | Team member display | Header, SubHeader, team[] |
| `Footer.astro` | Site footer | Grunddaten content |

### Utility Components

| Component | Purpose |
|-----------|---------|
| `RichText.astro` | Renders Storyblok rich text fields |
| `Image.astro` | Handles Storyblok image assets with optimizations |
| `Grid.astro` | Layout component for Storyblok nested content |

## Data Flow

The data flow between Storyblok and the website follows this pattern:

1. **Story Retrieval**: 
   - Dynamic routes (`[...path].astro`) fetch content based on the URL
   - Data is retrieved via the Storyblok API

2. **Content Rendering**:
   - Content is passed to the `StoryblokComponent`
   - Components are dynamically mapped and rendered
   - Rich text is parsed and rendered with `renderRichText`

3. **Asset Handling**:
   - Images from Storyblok are processed through the `Image` component
   - Files (PDFs, etc.) are served from Storyblok's CDN

## Overridable Settings

Certain Storyblok content can be overridden by local settings. These include:

### 1. Visual Appearance

| Storyblok Setting | Local Override | Override Method |
|-------------------|----------------|-----------------|
| Background Colors | Tailwind config | Settings in `tailwind.config.js` take precedence |
| Font Settings | Environment variables | `FONT_COMBINATION` in .env file |
| Component Styling | CSS variables | Custom properties in CSS files |

### 2. Content Display

| Storyblok Content | Local Override | Override Method |
|-------------------|----------------|-----------------|
| Hotel Information | Environment variables | Properties defined in .env files |
| API Endpoints | Configuration files | Settings in API configuration |
| Text Content | Language files | Localization files for static text |

### 3. Component Behavior

Some components allow behavior overrides through local settings:

- **ZimmerListe**: Room display order can be customized locally
- **SliderSection**: Animation settings can be adjusted in component props
- **Footer**: Contact information can be overridden with environment variables

## API Integration

The Storyblok API is utilized in several ways:

### Basic Content Fetching

```javascript
// Getting a single story
const { data } = await storyblokApi.get('cdn/stories/'+hotel+'/'+story, {
  language: lang,
  version: import.meta.env.DEV ? "draft" : "published",
});
```

### Static Path Generation

The project uses Storyblok to generate static paths for prerendering:

```javascript
// Getting all possible page paths
const links = await storyblokApi.getAll('cdn/links', {
  version: (preview || isLocalhost) ? "draft" : "published",
});
```

### Rich Text Rendering

Rich text fields from Storyblok are rendered using:

```javascript
import { renderRichText } from "@storyblok/astro";
const text = renderRichText(blok.Text);
```

## Multilingual Support

The Storyblok integration supports multiple languages through:

1. **Language Parameter**: Content is requested with the appropriate language code
   ```javascript
   const { data } = await storyblokApi.get('cdn/stories/'+hotel+'/grunddaten', {
     language: lang,
   });
   ```

2. **URL Structure**: Language is embedded in the URL path (`[lang]/[...slug]`)

3. **Component Propagation**: Language parameter is passed to all components
   ```astro
   <StoryblokComponent language={lang} blok={blok} />
   ```

## Development Workflow

### Content Editing Cycle

1. Update content in Storyblok visual editor
2. Content changes are immediately visible in development mode
3. Changes are published to production through Storyblok's publishing workflow

### Adding New Components

To add a new component type to Storyblok:

1. Create the component in Storyblok's schema editor
2. Create a matching Astro component in `src/components/`
3. Implement the component to receive and render Storyblok data
4. Test in development mode with real content

## Best Practices

### Content Modeling

- Use nested components for complex layouts
- Limit rich text field usage for better structure
- Create reusable content blocks when possible

### Performance Optimization

- Enable Storyblok caching for production
- Use the image component for optimized assets
- Implement incremental static regeneration when possible

### Development Tips

- Use the Storyblok preview environment for testing
- Create mock data for component development
- Document component schemas for content editors

---

This documentation provides a comprehensive overview of the Storyblok integration in the Hotel Stern website. For specific implementation details, refer to the corresponding component files and the Storyblok schema documentation.
