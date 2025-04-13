// storyblokConfig.js
import StoryblokClient from "storyblok-js-client";
import { loadEnv } from "vite";
let hotel = loadEnv("", process.cwd(), "PROPERTY").PROPERTY;
const env = loadEnv("", process.cwd(), "STORYBLOK");

// Initialize Storyblok client
const Storyblok = new StoryblokClient({
  accessToken: env.STORYBLOK_TOKEN,
  cache: {
    clear: "auto",
    type: "memory",
  },
});

console.log("cdn/stories/" + hotel + "/grunddaten");
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
