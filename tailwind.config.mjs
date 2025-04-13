import flowbitePlugin from "flowbite/plugin.js";

const tailwindConfig = {
  "darkMode": "class",
  "content": [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
    "./node_modules/flowbite/**/*.js"
  ],
  "theme": {
    "fontFamily": {
      "sans": [
        "Inter"
      ],
      "serif": [
        "Tenor Sans"
      ]
    },
    "fontSize": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.25rem",
      "3xl": "1.3rem",
      "4xl": "1.5rem",
      "5xl": "2rem",
      "6xl": "2rem",
      "rich-desktop": "1.6rem",
      "rich-tablet": "1.4rem",
      "rich-mobile": "1.2rem",
      "button": "1rem",
      "caption": "0.875rem",
      "label": "0.875rem",
      "price": "1.25rem",
      "badge": "0.75rem",
      "h1": "2rem",
      "h2": "2rem",
      "h3": "1.5rem",
      "h4": "1.3rem",
      "h5": "1.25rem",
      "h6": "1.1rem",
      "body-xs": "0.75rem",
      "body-sm": "0.875rem",
      "body-base": "1rem",
      "body-lg": "1.125rem",
      "body-xl": "1.25rem",
      "section-header": "35px",
      "section-subheader": "1.5rem",
      "faq-question": "1rem",
      "faq-question-mobile": "1rem",
      "faq-answer": "1rem",
      "faq-answer-md": "1rem"
    },
    "extend": {
      "colors": {
        "primary": {
          "light": "#305F85",
          "dark": "#6B9AC4"
        },
        "secondary": {
          "light": "#E0E5EC ",
          "dark": "#FFEB3B"
        },
        "hero-background": {
          "light": "#8BC34A",
          "dark": "#FF9500"
        },
        "hero-text": {
          "light": "#000000",
          "dark": "#FFFFFF"
        },
        "background": {
          "light": "#aaaaaa",
          "dark": "#020202"
        },
        "paper": {
          "light": "#dddddd",
          "dark": "#353535"
        },
        "text": {
          "light": "#14365D",
          "dark": "#EFEFEF"
        },
        "textSecondary": {
          "light": "#566573",
          "dark": "#EFEFEF"
        },
        "accent": {
          "light": "#D4A15A",
          "dark": "#F6C066"
        },
        "primarybutton": {
          "light": "#305F85",
          "dark": "#3A6B96"
        },
        "primarybuttontext": {
          "light": "#FFFFFF",
          "dark": "#FFFFFF"
        },
        "secondarybutton": {
          "light": "#FFFFFF",
          "dark": "#253649"
        },
        "secondarybuttontext": {
          "light": "#305F85",
          "dark": "#E2E8F0"
        },
        "button": {
          "light": "#305F85",
          "dark": "#3A6B96"
        },
        "buttontext": {
          "light": "#FFFFFF",
          "dark": "#FFFFFF"
        },
        "heading": {
          "light": "#2C3E50",
          "dark": "#E2E8F0"
        },
        "menu": {
          "light": "#F9F7F2",
          "dark": "#1A2639"
        },
        "menutext": {
          "light": "#2C3E50",
          "dark": "#E2E8F0"
        },
        "menuaccent": {
          "light": "#305F85",
          "dark": "#6B9AC4"
        },
        "sectionheader": {
          "light": "#305F85",
          "dark": "#6B9AC4"
        },
        "sectionsubheader": {
          "light": "#38A18C",
          "dark": "#67D5B5"
        }
      },
      "gridRow": {
        "span-1": "span 1 / span 1",
        "span-2": "span 2 / span 2",
        "span-3": "span 3 / span 3",
        "span-4": "span 4 / span 4",
        "span-5": "span 5 / span 5",
        "span-6": "span 6 / span 6"
      }
    },
    "heroSection": {
      "hero-mainText-bg": "bg-hero-background-light bg-opacity-85 dark:bg-hero-background-dark dark:bg-opacity-90",
      "hero-mainText-text": "text-paper-light dark:text-paper-light",
      "hero-subTitle-bg": "bg-hero-background-light bg-opacity-85 dark:bg-hero-background-dark dark:bg-opacity-85",
      "hero-subTitle-text": "text-text-light dark:text-paper-light"
    },
    "sectionBlock": {
      "sectionBlock-header": "text-sectionheader-light dark:text-sectionheader-dark",
      "sectionBlock-subheader": "text-sectionsubheader-light dark:text-sectionsubheader-dark"
    }
  },
  "plugins": [
    {
      "name": "flowbite/plugin"
    }
  ]
};

// Replace the placeholder plugin with the actual flowbitePlugin
tailwindConfig.plugins = [flowbitePlugin];

export default tailwindConfig;
