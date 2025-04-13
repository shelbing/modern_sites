import storyBlokConfig from "../../../storyblokConfig.js";

export async function getBundles(lang) {
  const data = await storyBlokConfig(lang);
  const angebote = data.story.content.body.filter(
    (item) => item.component === "Angebotseinstellungen"
  )[0];
  return angebote;
}
