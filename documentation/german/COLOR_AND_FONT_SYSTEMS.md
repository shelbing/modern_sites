# Farb- und Schriftsysteme

Dieses Dokument bietet eine umfassende Übersicht über die Farb- und Schriftsysteme des Hotel Stern Webseiten-Projekts, einschließlich Konfiguration, Implementierung und Best Practices.

## Inhaltsverzeichnis

1. [Farbsystem](#farbsystem)
   - [Übersicht](#farbsystem-übersicht)
   - [Farb-Token](#farb-token)
   - [Dark Mode Unterstützung](#dark-mode-unterstützung)
   - [Hintergrundfarbsystem](#hintergrundfarbsystem)
   - [Komponentenstyling](#komponentenstyling)

2. [Schriftsystem](#schriftsystem)
   - [Schriftartenkonfiguration](#schriftartenkonfiguration)
   - [Schriftgrößensystem](#schriftgrößensystem)
   - [Schriftladeoptimierung](#schriftladeoptimierung)
   - [Schriftenvariablen](#schriftenvariablen)

3. [Integration und Verwendung](#integration-und-verwendung)
   - [Tailwind Integration](#tailwind-integration)
   - [Komponentenbeispiele](#komponentenbeispiele)
   - [Best Practices](#best-practices)
   - [Debugging Tools](#debugging-tools)

## Farbsystem

### Farbsystem-Übersicht

Das Hotel Stern Webprojekt verwendet ein semantisches Farbsystem mit zentralisierten Farb-Tokens, die in der Tailwind-Konfiguration definiert sind. Dies ermöglicht konsistente Farben im gesamten Projekt und unterstützt sowohl Light- als auch Dark-Mode.

Das Farbsystem bietet:
- Semantische Benennungskonventionen
- Vollständige Dark-Mode-Unterstützung
- Zentrale Konfiguration für einfache Wartung
- Konsistenz über alle Komponenten hinweg

### Farb-Token

Die Farben sind nach ihrer Funktion organisiert:

```javascript
// Tailwind-Farbkonfiguration (gekürzt)
colors: {
  // Überschriften und Titel
  heading: {
    light: '#1E293B',
    dark: '#F1F5F9'
  },
  
  // Menüelemente
  menu: {
    light: '#334155',
    dark: '#CBD5E1'
  },
  
  // Primäre Buttons
  primarybutton: {
    light: '#0369A1',
    dark: '#0EA5E9'
  },
  primarybuttontext: {
    light: '#F0F9FF',
    dark: '#F0F9FF'
  },
  
  // Textfarben
  text: {
    light: '#334155',
    dark: '#E2E8F0'
  },
  textSecondary: {
    light: '#64748B',
    dark: '#94A3B8'
  }
  
  // Weitere Farbkategorien
}
```

Die Farben sind nach Zweck in folgende Kategorien organisiert:
- Überschriften und Titel
- Menüelemente
- Button-Stile (primär und sekundär)
- Theme-Farben
- Hintergründe
- Textfarben
- Akzentfarben
- Preiselemente
- Formularelemente

### Dark Mode Unterstützung

Das Farbsystem wurde speziell für die nahtlose Unterstützung von Light- und Dark-Mode konzipiert:

1. **Duale Farbdefinition**: Jeder Farb-Token hat light- und dark-Varianten
2. **Automatische Umschaltung**: Tailwind-Utilities wechseln basierend auf dem Theme
3. **Konsistente Benennung**: `[zweck]-light` und `[zweck]-dark` Benennungskonvention

Beispiel für Dark-Mode-Verwendung:
```html
<div class="bg-background-light dark:bg-background-dark">
  <h1 class="text-heading-light dark:text-heading-dark">Hotel Stern</h1>
  <p class="text-text-light dark:text-text-dark">Willkommen in unserem Hotel</p>
</div>
```

### Hintergrundfarbsystem

Das Hintergrundfarbsystem bietet:

1. **Vordefinierte Hintergründe**: Eine Reihe harmonischer Hintergrundfarben
2. **Komponentenspezifische Hintergründe**: Spezielle Hintergründe für verschiedene UI-Komponenten
3. **Farbvariationen**: Leicht unterschiedliche Hintergründe für visuelle Tiefe
4. **Kontraststeuerung**: Optimierter Kontrast für Lesbarkeit

Standardhintergrundfarben sind:
- `background-light` / `background-dark`: Hauptseitenhintergrund
- `background-alt-light` / `background-alt-dark`: Alternativer Hintergrund
- `card-light` / `card-dark`: Hintergrund für Karten-UI-Komponenten

### Komponentenstyling

Das Projekt verwendet konsistente Muster für Komponentenstyling:

**Primäre Buttons**:
```html
<button class="px-6 py-3 bg-primarybutton-light text-primarybuttontext-light dark:bg-primarybutton-dark dark:text-primarybuttontext-dark rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:ring-offset-2">
  Jetzt Buchen
</button>
```

**Sekundäre Buttons**:
```html
<button class="px-6 py-3 border border-gray-300 bg-secondarybutton-light text-secondarybuttontext-light dark:bg-secondarybutton-dark dark:text-secondarybuttontext-dark rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary-light dark:focus:ring-secondary-dark focus:ring-offset-2">
  Mehr Erfahren
</button>
```

**Preisschilder**:
```html
<span class="bg-price-light text-white dark:bg-price-dark dark:text-white px-3 py-1 rounded-full text-sm font-semibold">
  €120 pro Nacht
</span>
```

**Kartenkomponenten**:
```html
<div class="bg-background-light dark:bg-background-dark shadow-md rounded-lg p-6">
  Karteninhalt
</div>
```

## Schriftsystem

### Schriftartenkonfiguration

Das Hotel Stern Projekt implementiert ein flexibles Schriftartensystem:

1. **Auswählbare Schriftkombinationen**: 22 vordefinierte Schriftpaare
2. **Umgebungsvariablensteuerung**: Schriften werden über `FONT_COMBINATION` in der .env-Datei konfiguriert
3. **Fallback-Schriftstapel**: Robuste Fallback-Schriften für konsistentes Rendering
4. **Optimiertes Laden**: Angepasste Schriftladestrategien für beste Performance

```javascript
// Beispiel für Schriftkonfiguration (fontCombinations.js)
const fontCombinations = [
  {
    name: "Classic Luxury",
    heading: "'Playfair Display', serif",
    body: "'Roboto', sans-serif",
    preconnect: [
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com"
    ],
    imports: [
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Roboto:wght@300;400;700&display=swap"
    ]
  },
  // Weitere Schriftkombinationen...
];
```

Die Standard-Schriftkombination ist "Classic Luxury" (Playfair Display / Roboto), kann aber leicht über die Umgebungsvariable geändert werden.

### Schriftgrößensystem

Das Projekt verwendet ein umfassendes zentralisiertes Schriftgrößensystem:

1. **Zentrale Konfiguration**: `/src/config/fontSizes.js` definiert alle Schriftgrößen an einem einzigen Ort
   - Nach Kategorie organisiert: Überschriften, Body-Text, Rich-Text, spezielle Elemente
   - Bietet Hilfsfunktionen: `getFontSize()`, `getAllFontSizes()`, `getTailwindFontSizes()`

2. **CSS-Variablen**: Schriftgrößen sind als CSS-Variablen verfügbar über:
   - Statische CSS-Datei: `/src/styles/font-sizes.css` mit vordefinierten Variablen
   - Dynamische Komponente: `/src/components/Scripts/FontSizes.astro` für generierte Variablen

3. **Tailwind-Integration**: Schriftgrößen werden automatisch in Tailwind CSS integriert
   - `generateTailwindConfig.js` importiert und verwendet die zentralisierten Schriftgrößen
   - Semantische Klassennamen wie `text-h1`, `text-body-base`, etc.

Beispiele für Schriftgrößen:

```javascript
// Beispiel aus fontSizes.js
const fontSizes = {
  // Überschriften
  h1: {
    desktop: "3rem",    // 48px
    tablet: "2.5rem",   // 40px
    mobile: "2rem"      // 32px
  },
  h2: { /* ... */ },
  
  // Body Text
  "body-base": {
    desktop: "1rem",    // 16px
    tablet: "1rem",     // 16px
    mobile: "0.875rem"  // 14px
  },
  
  // Spezielle Elemente
  "button-large": { /* ... */ },
  "price-tag": { /* ... */ }
};
```

### Schriftladeoptimierung

Das System implementiert optimierte Schriftladestrategien:

1. **Ladezustandserkennung**: Überprüfung, ob Schriften geladen sind
2. **Vorladung wichtiger Schriften**: Kritische Schriften werden vorgeladen
3. **Unterdrückung von FOUT**: Strategien zur Minimierung von Flackern beim Schriftwechsel
4. **Bedingte Schriftfeatures**: Optimiertes Laden basierend auf Browserfähigkeiten

Die Schrift-Laderoutine verwendet Umgebungsvariablen konsistent in verschiedenen Kontexten:

```javascript
// getSelectedFontCombination() erkennt die Umgebung und verwendet die entsprechende Methode
function getSelectedFontCombination() {
  // In Node.js Umgebungen (wie generateTailwindConfig.js)
  if (typeof process !== 'undefined' && process.env) {
    const fontNumber = process.env.FONT_COMBINATION || "1";
    return fontCombinations[parseInt(fontNumber) - 1];
  }
  
  // In Browser/Astro-Komponenten
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const fontNumber = import.meta.env.FONT_COMBINATION || "1";
    return fontCombinations[parseInt(fontNumber) - 1];
  }
  
  // Fallback
  return fontCombinations[0];
}
```

### Schriftenvariablen

Das System bietet flexible CSS-Variablen für verschiedene Schriftaspekte:

```css
:root {
  /* Schriftfamilien */
  --font-heading: 'Playfair Display', serif;
  --font-body: 'Roboto', sans-serif;
  
  /* Schriftgrößen */
  --font-size-h1: 3rem;
  --font-size-h2: 2.25rem;
  --font-size-body: 1rem;
  
  /* Schriftstärken */
  --font-weight-normal: 400;
  --font-weight-bold: 700;
  
  /* Zeilenhöhen */
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
}
```

## Integration und Verwendung

### Tailwind Integration

Das Farb- und Schriftsystem ist nahtlos in Tailwind CSS integriert:

```javascript
// tailwind.config.js (gekürzt)
module.exports = {
  theme: {
    colors: {
      // Importierte Farben aus dem zentralisierten System
      ...getColors()
    },
    fontFamily: {
      // Importierte Schriftfamilien
      ...getFontFamilies()
    },
    fontSize: {
      // Importierte Schriftgrößen
      ...getTailwindFontSizes()
    }
  },
  // Dark-Mode-Konfiguration
  darkMode: 'class'
}
```

Das Generieren der Tailwind-Konfiguration geschieht automatisch während des Build-Prozesses durch einen Prebuild-Schritt.

### Komponentenbeispiele

**Überschriften mit responsiven Schriftgrößen**:
```html
<h1 class="text-h1 text-heading-light dark:text-heading-dark">
  Willkommen im Hotel Stern
</h1>
```

**Text mit semantic colors**:
```html
<p class="text-body-base text-text-light dark:text-text-dark">
  Erleben Sie Luxus und Komfort in unserem historischen Hotel.
</p>
```

**Buttons mit Farbschema**:
```html
<button class="px-6 py-3 text-button-large bg-primarybutton-light text-primarybuttontext-light dark:bg-primarybutton-dark dark:text-primarybuttontext-dark rounded-lg hover:opacity-90">
  Buchen Sie Jetzt
</button>
```

**Preiselemente**:
```html
<div class="text-price-tag bg-price-light text-white dark:bg-price-dark dark:text-white px-3 py-1 rounded-full">
  Ab €120 / Nacht
</div>
```

### Best Practices

1. **Nutzen Sie semantische Tokens**: Verwenden Sie immer semantische Farb- und Schrift-Tokens statt Hartkodierung
2. **Dark Mode aktivieren**: Fügen Sie immer die passenden Dark-Mode-Varianten hinzu
3. **Responsive Schriftgrößen**: Nutzen Sie definierte Schriftgrößenklassen für Responsivität
4. **Vermeiden Sie Überschreibungen**: Arbeiten Sie mit dem System, nicht dagegen
5. **Konsistenz bewahren**: Halten Sie sich an die definierte Farbpalette und Typografie

### Debugging Tools

Das Farb- und Schriftsystem bietet Entwicklungshilfen:

1. **Schriftgrößen-Debug-Panel**: Schalten Sie es im Entwicklungsmodus mit Shift+Alt+F um
2. **Farb-Demo-Seite**: Zeigt alle verfügbaren Farben im Light- und Dark-Mode
3. **Migrationsskript**: `scripts/findHardcodedFontSizes.js` findet hartkodierte Werte
4. **Typografie-Demo**: `/font-size-demo` zeigt alle Schriftgrößen

---

Dieses umfassende Farb- und Schriftsystem gewährleistet eine konsistente visuelle Identität über alle Teile der Hotel Stern Website, während es gleichzeitig einfach zu warten und zu erweitern ist.
