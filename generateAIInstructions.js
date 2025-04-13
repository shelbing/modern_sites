import fs from "fs/promises";

import { join, dirname } from "path";
import { fileURLToPath } from "url";
import storyBlokConfig from "./storyblokConfig.js";
const data = await storyBlokConfig();
const aiInstructions = data.story.content.body.filter(
  (item) => item.component === "AIInstructions"
)[0];

//const model = aiInstructions.model;
const instructions = aiInstructions.Instructions;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const filePath = join(__dirname, "/src/pages/api/system.message.ts");
const content =
  "export const system_message=" + JSON.stringify(instructions, null, 2);

try {
  await fs.writeFile(filePath, content);
} catch (error) {
  console.error(`Error writing instructions to ${filePath}:`, error);
}
