# Hotel Stern Entwicklerhandbuch

## Befehle
- Build: `npm run build` (führt Prebuild aus, generiert Tailwind-Konfiguration und erstellt die Site)
- Entwicklung: `npm run dev` (startet Entwicklungsserver mit Hot Reloading)
- Vorschau: `npm run preview` (zeigt den Build lokal an)
- Schriftarten-Tools: `npm run font` (ändert Schriftkombination), `npm run font:test` (testet alle Schriftarten)

## Code-Stil-Richtlinien
- **Imports**: Benannte Imports werden bevorzugt. Externe Bibliotheken zuerst, dann interne Module.
- **Komponenten**: Astro-Komponenten verwenden Frontmatter, Svelte verwendet Script-Blöcke. Props am Anfang.
- **Benennung**: camelCase für Variablen/Funktionen, PascalCase für Komponenten/Klassen, beschreibende Namen.
- **Styling**: Tailwind CSS für Styling mit konsistenten Klassenmustern.
- **Typisierung**: TypeScript-Interfaces für Datenstrukturen, explizite Typisierung für Parameter.
- **Fehlerbehandlung**: Try/catch für asynchrone Operationen, spezifische Fehlertypen mit detaillierten Nachrichten.
- **State Management**: Svelte Stores für gemeinsam genutzten State, benutzerdefinierte Store-Factories mit zusätzlichen Methoden.
- **Übersetzungen**: Übersetzungstexte in speziellen Dateien, nach Sprache organisiert (siehe src/lib/translations/).
- **Organisation**: Feature-basierte Verzeichnisstruktur, klare Trennung der Zuständigkeiten.

Bei der Bearbeitung sollten bestehende Muster in jeder Datei beibehalten und die etablierte Projektstruktur befolgt werden.
