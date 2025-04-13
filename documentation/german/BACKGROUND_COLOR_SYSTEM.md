# Hintergrundfarbenkonfigurations-System

Dieses Dokument erläutert das zentralisierte Hintergrundfarbenkonfigurations-System für die Hotel Stern Website. Dieses System ermöglicht sowohl globale als auch komponentenspezifische Anpassungen der Hintergrundfarben, während ein konsistenter Ansatz über verschiedene Abschnitte hinweg beibehalten wird.

## Überblick

Das Hintergrundfarbensystem bietet:

1. **Zentralisierte Konfiguration** in `src/config/colors.js`
2. **Komponentenspezifische Überschreibungen** mittels Props
3. **Konsistentes Styling** über alle Abschnitte hinweg
4. **Dark-Mode-Unterstützung** mit separaten Farben für hellen und dunklen Modus
5. **Randkonfiguration** für visuelle Trennung zwischen Abschnitten

## Wie es funktioniert

### 1. Zentralisierte Konfiguration

Alle Abschnitt-Hintergrundfarben sind in `src/config/colors.js` unter dem `sections`-Objekt definiert:

```js
// Beispiel aus colors.js
sections: {
  default: {
    background: 'background-light',
    darkModeBackground: 'background-dark',
    borderColor: 'gray-200',
    darkModeBorderColor: 'gray-700'
  },
  faq: {
    background: 'blue-50',
    darkModeBackground: 'blue-950',
    borderColor: 'blue-200',
    darkModeBorderColor: 'blue-800'
  },
  // Weitere Abschnittstypen...
}
```

Jeder Abschnittstyp hat:
- `background`: Hintergrundfarbe im hellen Modus
- `darkModeBackground`: Hintergrundfarbe im dunklen Modus
- `borderColor`: Randfarbe im hellen Modus (optional)
- `darkModeBorderColor`: Randfarbe im dunklen Modus (optional)

### 2. Verwendung von Abschnittstypen

Die `SectionBlock`-Komponente nimmt eine `sectionType`-Prop entgegen, die bestimmt, welche Farbkonfiguration verwendet wird:

```astro
<SectionBlock 
  header="FAQ-Abschnitt" 
  subHeader="Häufig gestellte Fragen"
  sectionType="faq"
>
  <!-- Inhalt -->
</SectionBlock>
```

### 3. Komponentenspezifische Überschreibung

Komponenten können die zentralisierte Konfiguration überschreiben, indem sie eine benutzerdefinierte `backgroundColorClass` übergeben:

```astro
<SectionBlock 
  header="Benutzerdefinierter Hintergrund" 
  subHeader="Mit benutzerdefinierter Hintergrundfarbe"
  backgroundColorClass="bg-yellow-100 dark:bg-yellow-900"
>
  <!-- Inhalt -->
</SectionBlock>
```

### 4. Randkonfiguration

Abschnitte können optionale Ränder für visuelle Trennung haben:

```astro
<SectionBlock 
  header="Abschnitt mit Rand" 
  subHeader="Mit Rand"
  sectionType="faq"
  withBorder={true}
>
  <!-- Inhalt -->
</SectionBlock>
```

Benutzerdefinierte Randfarben können mit `borderColorClass` spezifiziert werden:

```astro
<SectionBlock 
  header="Benutzerdefinierter Rand" 
  subHeader="Mit benutzerdefiniertem Rand"
  withBorder={true}
  borderColorClass="border-red-300 dark:border-red-700"
>
  <!-- Inhalt -->
</SectionBlock>
```

### 5. Storyblok-Integration

Abschnittskomponenten können benutzerdefinierte Hintergrundfarben von Storyblok akzeptieren:

```astro
<!-- Beispiel aus FAQ.astro -->
<SectionBlock 
  header={header} 
  subHeader={subHeader}
  sectionType="faq"
  backgroundColorClass={blok.BackgroundColor} // Benutzerdefinierter Hintergrund von Storyblok
>
  <!-- Inhalt -->
</SectionBlock>
```

## Verfügbare Abschnittstypen

Die folgenden Abschnittstypen sind vorkonfiguriert:

| Abschnittstyp   | Heller Modus     | Dunkler Modus     |
|-----------------|------------------|-------------------|
| default         | background-light | background-dark   |
| faq             | blue-50          | blue-950          |
| pictureGallery  | gray-50          | gray-900          |
| rooms           | green-50         | green-950         |
| services        | amber-50         | amber-950         |
| testimonials    | rose-50          | rose-950          |
| contact         | purple-50        | purple-950        |
| chatbot         | sky-50           | sky-950           |

## Zimmerkarteikonfiguration

Zimmerkarten haben eine spezielle Konfiguration basierend auf dem Zimmertyp:

```js
// Aus colors.js
roomCard: {
  background: 'white',
  darkModeBackground: 'gray-800',
  textColor: 'gray-900',
  darkModeTextColor: 'gray-100',
  borderColor: 'gray-200',
  darkModeBorderColor: 'gray-700',
  // Variationen für verschiedene Zimmertypen
  standard: {
    background: 'white',
    darkModeBackground: 'gray-800'
  },
  deluxe: {
    background: 'amber-50',
    darkModeBackground: 'amber-900'
  },
  suite: {
    background: 'emerald-50',
    darkModeBackground: 'emerald-900'
  }
}
```

## Best Practices

1. **Verwenden Sie wann immer möglich Abschnittstypen**, um Konsistenz zu gewährleisten
2. **Überschreiben Sie Farben nur wenn nötig** für spezifische Design-Anforderungen
3. **Berücksichtigen Sie den Dark Mode** bei allen Farbauswahlen
4. **Testen Sie alle Farbkombinationen** auf Zugänglichkeit und Lesbarkeit
5. **Fügen Sie neue Abschnittstypen** zur zentralisierten Konfiguration hinzu, anstatt überall benutzerdefinierte Klassen zu verwenden
6. **Dokumentieren Sie alle benutzerdefinierten Farbentscheidungen** in Komponentenkommentaren

## Hinzufügen neuer Abschnittstypen

Um einen neuen Abschnittstyp hinzuzufügen:

1. Fügen Sie den neuen Abschnittstyp zum `sections`-Objekt in `colors.js` hinzu
2. Fügen Sie Hintergrund- und Randfarben sowohl für den hellen als auch den dunklen Modus hinzu
3. Verwenden Sie den neuen Abschnittstyp in Ihrer Komponente über die `sectionType`-Prop

## Beispiel

```astro
<!-- Beispiel eines neuen Hero-Abschnitts mit der zentralisierten Konfiguration -->
<SectionBlock
  header="Willkommen im Hotel Stern"
  subHeader="Luxuriöse Unterkünfte im Herzen der Stadt"
  sectionType="hero"
  withBorder={true}
>
  <div class="flex flex-col items-center">
    <!-- Hero-Inhalt -->
  </div>
</SectionBlock>
```
