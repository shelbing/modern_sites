import { defineConfig } from "astro/config";
import storyblok from "@storyblok/astro";
import { loadEnv } from "vite";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";
import svelte from "@astrojs/svelte";
import node from "@astrojs/node";
import sentry from "@sentry/astro";

// Load all environment variables
const env = loadEnv("", process.cwd(), "");
const storyblokEnv = loadEnv("", process.cwd(), "STORYBLOK");
const hotel = loadEnv("", process.cwd(), "PROPERTY");

// Get SSR_MODE from environment
const isFullSSR = process.env.SSR_MODE === 'true';
console.log('Building with SSR mode:', isFullSSR ? 'true (full server rendering)' : 'false (hybrid rendering)');

// https://astro.build/config
export default defineConfig({
  output: isFullSSR ? "server" : "hybrid",
  server: {
    port: 3000,
  },
  vite: {
    plugins: [],
    envDir: ".", // Ensure Vite looks for .env in the root
    ssr: {
      // Mark config modules as external for SSR
      noExternal: ['tailwindcss'],
      // Explicitly exclude server-only files from client build
      external: ['fs', 'path', 'url', 'dotenv']
    },
    // Handle Node.js specific modules in browser builds
    optimizeDeps: {
      exclude: ['src/config/colors.js', 'src/config/fontSizes.js']
    },
  },
  integrations: [
    tailwind(),
    storyblok({
      accessToken: storyblokEnv.STORYBLOK_TOKEN,
      components: {
        Angebotsliste: "components/ibe/AngebotsListe",
        bookingEngine: "components/ibe/bookingEngine",
        PDFDownload: "components/Sections/PDFDownloadSection",
        contactSection: "components/Sections/ContactSection",
        richText: "components/Base/RichText",
        teamSection: "components/Sections/TeamSection",
        image: "components/Base/Image",
        googleMap: "components/Sections/GoogleMap",
        grid: "components/Base/Grid",
        viomaSnippet: "components/ibe/Vioma",
        eventCalendar: "components/Sections/EventCalendar",
        holidayCheck: "components/Widgets/HolidayCheck",
        page: "components/storyblok/Page",
        heroSection: "components/Sections/HeroSection",
        menuBar: "components/MenuBar/MenuBar",
        footer: "components/Sections/Footer",
        socialProof: "components/Sections/SocialProof",
        uspSection: "components/Sections/USPSection",
        sliderSection: "components/Sections/SliderSection",
        pictureGallery: "components/Sections/PictureGallery",
        faq: "components/Sections/FAQ",
        storySection: "components/Sections/StorySection",
        zimmerListe: "components/Sections/ZimmerListe",
        zimmerKategorie: "components/Sections/ZimmerKategorie",
        chatBot: "components/chatBotSection",
        komootSection: "components/Sections/KomootSection",
      },
      apiOptions: {
        region: "eu",
      },
    }),
    sentry({
      dsn: "https://24a4e40226e73f5e8d14d2ff6a4b24b2@o4506192536010752.ingest.us.sentry.io/4507712822116352",
      sourceMapsUploadOptions: {
        project: "javascript-astro",
        authToken: process.env.SENTRY_AUTH_TOKEN,
      },
    }),
    icon(),
    svelte(),
  ],
  adapter: node({
    mode: 'standalone', // 'standalone' creates a server that handles all requests
  }),
});
