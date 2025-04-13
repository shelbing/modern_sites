# Schriftgrößensystem

Dieses Dokument beschreibt das zentralisierte Schriftgrößen-Verwaltungssystem für die Hotel Stern Website.

## Überblick

Die Hotel Stern Website verwendet ein zentralisiertes Schriftgrößen-Verwaltungssystem, um eine konsistente Typografie in der gesamten Anwendung zu gewährleisten. Dieses System bietet:

1. **Zentralisierte Konfiguration**: Alle Schriftgrößen sind an einem einzigen Ort definiert
2. **Konsistente Skalierung**: Schriftgrößen skalieren einheitlich über verschiedene Bildschirmgrößen hinweg
3. **Einfache Wartung**: Schriftgrößen können an einer Stelle aktualisiert werden und verbreiten sich automatisch in der gesamten Anwendung
4. **Entwicklertools**: Hilfsprogramme für die Arbeit mit Schriftgrößen und die Migration von hartcodierten Werten

## Schriftgrößenkonfiguration

Schriftgrößen sind in `/src/config/fontSizes.js` definiert. Diese Datei exportiert ein Konfigurationsobjekt mit allen Schriftgrößen, die nach Kategorien organisiert sind:

```javascript
// Beispielstruktur (vereinfacht)
{
  // Überschriftengrößen
  h1: "2.5rem",  // 50px
  h2: "2rem",    // 40px
  h3: "1.75rem", // 35px
  // ...

  // Textkörpergrößen
  body: {
    xs: "0.75rem",   // 15px
    sm: "0.875rem",  // 17.5px
    base: "1rem",    // 20px
    lg: "1.125rem",  // 22.5px
    xl: "1.25rem",   // 25px
  },
  
  // Spezielle Elementgrößen
  button: "1rem",
  price: "1.25rem",
  // ...
}
```

## Verwendung von Schriftgrößen

### In CSS

Schriftgrößen sind als CSS-Variablen verfügbar:

```css
/* Verwendung von Überschriftengrößen */
h1 { font-size: var(--font-size-h1); }

/* Verwendung von Textkörpergrößen */
.small-text { font-size: var(--font-size-body-sm); }

/* Verwendung spezieller Elementgrößen */
.price-tag { font-size: var(--font-size-price); }
```

### In JavaScript

Schriftgrößen können in JavaScript mit Hilfsfunktionen abgerufen werden:

```javascript
import { getFontSize } from '../config/fontSizes.js';

// Eine bestimmte Schriftgröße abrufen
const h1Size = getFontSize('h1');           // "2.5rem"
const bodyBaseSize = getFontSize('body.base'); // "1rem"
```

### In Tailwind CSS

Schriftgrößen sind automatisch in Tailwind CSS integriert:

```html
<!-- Verwendung von Tailwind-Schriftgrößenklassen -->
<h1 class="text-h1">Hotel Stern</h1>
<p class="text-body-base">Willkommen in unserem Luxushotel.</p>
<span class="text-price">199€</span>
```

## Hilfsfunktionen

Das System bietet Hilfsfunktionen in `/src/utils/fontSizeUtils.js`:

```javascript
import { 
  pxToRem, 
  remToPx, 
  getCssFontSize, 
  getFontSizeValue 
} from '../utils/fontSizeUtils.js';

// Umrechnung zwischen Einheiten
pxToRem(20);  // "1rem"
remToPx("1rem");  // 20

// CSS-Variablenreferenz abrufen
getCssFontSize('h1');  // "var(--font-size-h1)"

// Tatsächlichen Wert abrufen
getFontSizeValue('body.base');  // "1rem"
```

## Debug-Tools

Im Entwicklungsmodus können Sie das Schriftgrößen-Debug-Panel verwenden:

1. Drücken Sie `Shift+Alt+F`, um das Debug-Panel ein-/auszuschalten
2. Das Panel zeigt alle verfügbaren Schriftgrößen mit ihren Werten an

## Migrationsleitfaden

Bei der Migration von hartcodierten Schriftgrößen zum zentralisierten System:

1. **Identifizieren Sie hartcodierte Schriftgrößen** in Ihren Komponenten
2. **Ersetzen Sie sie durch CSS-Variablen** oder Tailwind-Klassen:
   ```css
   /* Vorher */
   .element { font-size: 20px; }
   
   /* Nachher - CSS-Variable */
   .element { font-size: var(--font-size-body-base); }
   
   /* Nachher - Tailwind-Klasse */
   <div class="text-body-base">Inhalt</div>
   ```
3. **Verwenden Sie Hilfsfunktionen** für dynamische Werte:
   ```javascript
   // Vorher
   const fontSize = "1.25rem";
   
   // Nachher
   import { getFontSize } from '../config/fontSizes.js';
   const fontSize = getFontSize('body.xl');
   ```

## Best Practices

1. **Niemals Schriftgrößen hartcodieren** - immer das zentralisierte System verwenden
2. **Semantische Größennamen verwenden** - Größen basierend auf ihrem Zweck wählen, nicht auf ihrem Wert
3. **Die Hierarchie beibehalten** - Überschriften sollten größer sein als Fließtext
4. **Responsives Design berücksichtigen** - Schriftgrößen sollten auf verschiedenen Geräten angemessen skalieren
5. **Benutzerdefinierte Größen dokumentieren** - wenn Sie neue Größen hinzufügen, dokumentieren Sie deren Zweck

## Erweiterung des Systems

Um neue Schriftgrößen hinzuzufügen:

1. Aktualisieren Sie `/src/config/fontSizes.js` mit Ihren neuen Größen
2. Dokumentieren Sie die neuen Größen in dieser Datei
3. Verwenden Sie die neuen Größen in Ihren Komponenten

## Responsive Schriftgrößen

Das Schriftgrößensystem behandelt automatisch responsive Größenanpassungen durch:

1. **Basis-Schriftgröße**: 20px (1rem) auf dem Desktop
2. **Tailwind-Breakpoints**: Schriftgrößen passen sich an verschiedene Bildschirmbreiten an
3. **Spezielle responsive Größen**: Einige Elemente haben spezifische Größen für verschiedene Geräte

## Verwandte Dokumentation

- [Schriftkombinationssystem](./FONT_SYSTEM.md)
- [Schriftartenleitfaden](./FONT_GUIDE.md)
- [README-FONTS](./README-FONTS.md)
