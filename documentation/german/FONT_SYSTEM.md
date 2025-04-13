# Hotel Stern Schriftsystem

Dieses Dokument bietet einen Überblick über das Schriftladungssystem in der Hotel Stern Webanwendung.

## Überblick

Das Schriftsystem ermöglicht flexible Schriftkombinationen, die einfach über Umgebungsvariablen geändert werden können. Das System umfasst:

1. Eine Reihe vordefinierter Schriftkombinationen in `src/config/fontCombinations.js`
2. Einen zuverlässigen Schriftladungsmechanismus in `src/components/Scripts/ReliableFontLoader.astro`
3. Debugging-Tools in `src/components/Scripts/FontDebugHelper.astro`
4. CSS-Variablen für konsistente Schriftverwendung in der gesamten Anwendung

## Schriftkombinationen

Die Anwendung unterstützt mehrere Schriftkombinationen, jeweils mit einer Überschriften- und einer Textschrift. Diese Kombinationen sind in `src/config/fontCombinations.js` definiert.

Um die Schriftkombination zu ändern:

```bash
npm run font <kombinations-nummer>

# Zum Beispiel, um die neue Elegant Simplicity-Kombination (Lora/Inter) zu verwenden:
npm run font 23
```

Um beispielsweise die Schriftkombination #5 zu verwenden:

```bash
npm run font 5
```

## Schriftladungs-Architektur

### Komponenten

- **ReliableFontLoader.astro**: Hauptkomponente zum zuverlässigen Laden von Schriften
- **FontDebugHelper.astro**: Debug-Panel für Schriftladungsprobleme
- **FontPreviewLoader.astro**: Wird auf der Schriftvorschauseite verwendet, um alle Schriften zum Vergleich zu laden

### CSS-Variablen

Das Schriftsystem verwendet CSS-Variablen, um Konsistenz zu gewährleisten:

```css
--font-family-heading: "Playfair Display", serif;
--font-family-body: "Roboto", sans-serif;
```

Diese Variablen werden sowohl in CSS als auch über JavaScript für maximale Zuverlässigkeit gesetzt.

## Debugging von Schriftproblemen

Wenn Sie auf Schriftladungsprobleme stoßen:

1. Besuchen Sie die Seite `/font-preview`, die über erweiterte Debugging-Funktionen verfügt
2. Überprüfen Sie die Browser-Konsole auf Schriftladungsmeldungen
3. Verwenden Sie das Schrift-Debug-Panel (im Entwicklungsmodus sichtbar)
4. Führen Sie das Schriftreparatur-Skript aus:

```bash
npm run font:fix
```

## Best Practices

1. Verwenden Sie immer die CSS-Variablen für Schriftfamilien:

```css
font-family: var(--font-family-heading);
font-family: var(--font-family-body);
```

2. Wenden Sie Überschriftenschriften auf Überschriftenelemente an:

```css
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-family-heading);
}
```

3. Wenden Sie Textschriften auf Fließtextelemente an:

```css
body, p, div {
  font-family: var(--font-family-body);
}
```

## Fehlerbehebung

### Schriften werden nicht geladen

1. Überprüfen Sie, ob die Google Fonts URL in der Konsole korrekt ist
2. Stellen Sie sicher, dass die CSS-Variablen korrekt gesetzt sind
3. Löschen Sie den Browser-Cache und laden Sie neu
4. Überprüfen Sie auf Netzwerkfehler in den Browser-Entwicklertools

### Inkonsistente Schriftanzeige

1. Stellen Sie sicher, dass Sie die CSS-Variablen konsistent verwenden
2. Überprüfen Sie, ob die Schriftstärken korrekt angegeben sind
3. Stellen Sie sicher, dass die Schrift geladen ist, bevor sie verwendet wird (überprüfen Sie die 'fonts-loaded'-Klasse am body-Element)

## Richtlinien zur Schriftauswahl

Bei der Auswahl von Schriftkombinationen sollten Sie Folgendes berücksichtigen:

1. Lesbarkeit in verschiedenen Größen
2. Kontrast zwischen Überschriften- und Textschriften
3. Unterstützung für Sonderzeichen (insbesondere deutsche Umlaute)
4. Leistungsauswirkungen beim Laden mehrerer Schriftstärken

## Implementierungsdetails

Das Schriftladungssystem verwendet mehrere Techniken, um eine zuverlässige Schriftladung zu gewährleisten:

1. Preconnect-Links zu Google Fonts
2. CSS-Variablen für konsistente Schriftverwendung
3. JavaScript zur Überprüfung der Schriftladung
4. Versteckte Elemente, um das Laden von Schriften zu erzwingen
5. Schriftladungsüberprüfung über die Font Loading API
6. Fallback-Schriften im Schriftstapel

Dieser umfassende Ansatz stellt sicher, dass Schriften über verschiedene Browser und Netzwerkbedingungen hinweg zuverlässig geladen werden.
