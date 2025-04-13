# Hotel Stern Developer Guide

## Commands
- Build: `npm run build` (runs prebuild, generates Tailwind config and builds site)
- Dev: `npm run dev` (starts dev server with hot reloading)
- Preview: `npm run preview` (previews build locally)
- Font tools: `npm run font` (change font combination), `npm run font:test` (test all fonts)

## Code Style Guidelines
- **Imports**: Named imports preferred. External libs first, internal modules after.
- **Components**: Astro components use frontmatter, Svelte uses script blocks. Props at top.
- **Naming**: camelCase for vars/functions, PascalCase for components/classes, descriptive names.
- **Styling**: Tailwind CSS for styling with consistent class patterns.
- **Types**: Use TypeScript interfaces for data structures, explicit typing for parameters.
- **Error Handling**: Try/catch around async operations, specific error types with detailed messages.
- **State Management**: Svelte stores for shared state, custom store factories with additional methods.
- **Translations**: Translation strings in dedicated files organized by language (see src/lib/translations/).
- **Organization**: Feature-based directory structure, clear separation of concerns.

When editing, maintain existing patterns in each file and follow the established project structure.