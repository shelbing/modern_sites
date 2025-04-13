import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '../../../');

export async function GET({ request, redirect }) {
  try {
    const url = new URL(request.url);
    const fontId = url.searchParams.get('id');
    
    if (!fontId || isNaN(parseInt(fontId)) || parseInt(fontId) < 1 || parseInt(fontId) > 22) {
      return new Response('Invalid font ID. Please provide a number between 1 and 22.', { status: 400 });
    }
    
    // Run the font change script
    execSync(`node scripts/changeFontCombination.js ${fontId}`, { 
      stdio: 'inherit', 
      cwd: rootDir,
      env: { ...process.env, FONT_COMBINATION: fontId }
    });
    
    // Redirect back to the font preview page
    return redirect('/font-preview?changed=true');
  } catch (error) {
    console.error('Error changing font:', error);
    return new Response(`Error changing font: ${error.message}`, { status: 500 });
  }
}
