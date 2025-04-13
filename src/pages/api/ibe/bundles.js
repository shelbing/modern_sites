// Gets the bundles from the Storyblok CMS
// Does not introduce any calculations
// Restricted to a single property

import storyBlokConfig from "./../../../../storyblokConfig.js";

export async function getBundles(lang) {
  const data = await storyBlokConfig(lang);
  const angebote = data.story.content.body.filter(
    (item) => item.component === "Angebotseinstellungen"
  )[0];
  return angebote;
}
