# Hotel Stern Schriftsystem-Leitfaden

## Überblick

Die Hotel Stern Website verwendet ein flexibles Schriftsystem, mit dem Sie einfach zwischen 23 verschiedenen Schriftkombinationen wechseln können. Jede Kombination umfasst eine Überschriftenschrift (Serif) und eine Textschrift (Sans-Serif), die sorgfältig ausgewählt wurden, um gut zusammenzuarbeiten und optimale Lesbarkeit zu bieten, einschließlich der korrekten Darstellung deutscher Umlaute (ä, ö, ü, Ä, Ö, Ü).

## Ändern von Schriftkombinationen

### Methode 1: Verwendung des Schrift-Skripts (Empfohlen)

Der einfachste Weg, Schriftkombinationen zu ändern, ist die Verwendung des bereitgestellten npm-Skripts:

```bash
npm run font <nummer>
```

Wobei `<nummer>` die Nummer der Schriftkombination ist, die Sie verwenden möchten (1-23).

Zum Beispiel:
- `npm run font 1` - Klassischer Luxus (Playfair Display/Roboto)
- `npm run font 5` - Alpines Refugium (Lora/Open Sans)
- `npm run font 16` - Deutsch-Optimiert (Noto Serif/Noto Sans)
- `npm run font 20` - Rustikaler Charme (Amatic SC/Quattrocento Sans)

Starten Sie nach der Ausführung dieses Skripts Ihren Entwicklungsserver neu, um die Änderungen zu sehen:

```bash
npm run dev
```

Das Skript wird:
1. Die `.env`-Datei mit Ihrer gewählten Schriftkombination aktualisieren
2. Die Tailwind-Konfiguration neu generieren
3. Ihnen zeigen, welche Schriften verwendet werden

### Methode 2: Verwendung der Schriftvorschau-Seite

Die Website enthält jetzt eine visuelle Schriftvorschau-Seite, mit der Sie Schriften direkt im Browser sehen und auswählen können:

1. Besuchen Sie `/font-preview` in Ihrem Browser
2. Durchsuchen Sie alle verfügbaren Schriftkombinationen
3. Klicken Sie auf die Schaltfläche "Schrift aktivieren" bei einer beliebigen Schriftkombination, die Sie verwenden möchten
4. Die Seite wird mit der neuen Schrift aktualisiert

### Methode 3: Verwendung der Schriftverwaltungsseite

Für eine detailliertere Schriftverwaltung besuchen Sie die Admin-Schriftartenseite:

1. Gehen Sie zu `/admin/fonts` in Ihrem Browser
2. Sehen Sie beliebte Schriftkombinationen und Informationen zum Schriftsystem
3. Greifen Sie von dort aus auf die vollständige Schriftvorschauseite zu

### Methode 4: Manuelles Bearbeiten der .env-Datei

Sie können die `.env`-Datei manuell bearbeiten:

1. Öffnen Sie die `.env`-Datei
2. Ändern Sie den `FONT_COMBINATION`-Wert auf eine Zahl zwischen 1 und 23
3. Speichern Sie die Datei
4. Starten Sie den Entwicklungsserver neu

## Verfügbare Schriftkombinationen

1. **Klassischer Luxus**: Playfair Display / Roboto
2. **Moderne Eleganz**: Cormorant Garamond / Montserrat
3. **Boutique-Hotel**: Libre Baskerville / Source Sans Pro
4. **Zeitgenössisches Resort**: Prata / Work Sans
5. **Alpines Refugium**: Lora / Open Sans
6. **Urbanes Chic**: DM Serif Display / Nunito Sans
7. **Küstenresort**: Spectral / Karla
8. **Traditionshotel**: Crimson Text / Raleway
9. **Geschäftsreisende**: Merriweather / IBM Plex Sans
10. **Wellness-Spa**: Cardo / Quicksand
11. **Berghütte**: Vollkorn / Assistant
12. **Luxusschloss**: Cormorant / Outfit
13. **Minimalistisches Design**: Tenor Sans / Inter
14. **Historisches Gasthaus**: EB Garamond / Cabin
15. **Kunsthandwerksboutique**: Fraunces / Rubik
16. **Deutsch-Optimiert**: Noto Serif / Noto Sans
17. **Böhmisches Flair**: Abril Fatface / Poppins
18. **Nordischer Minimalismus**: Josefin Slab / Josefin Sans
19. **Art-Deco-Revival**: Poiret One / Didact Gothic
20. **Rustikaler Charme**: Amatic SC / Quattrocento Sans
21. **Vintage-Schreibmaschine**: Special Elite / Courier Prime
22. **Schweizer Präzision**: Bebas Neue / Roboto Mono
23. **Elegante Einfachheit**: Lora / Inter

## Schrifttest-Tools

### Automatisiertes Schrifttesten

Das System enthält jetzt Tools, die Ihnen helfen, verschiedene Schriftkombinationen zu testen und zu vergleichen:

```bash
# Alle Schriften testen (3 Sekunden pro Schrift)
npm run font:test

# Alle Schriften mit benutzerdefinierter Verzögerung testen
npm run font:test -- --delay=5

# Einen bestimmten Bereich von Schriften testen
npm run font:test -- --start=10 --end=15

# Kontinuierlich durch alle Schriften schleifen
npm run font:test:loop

# Durch einen bestimmten Bereich mit benutzerdefinierter Verzögerung schleifen
npm run font:test:loop -- --start=17 --end=22 --delay=10
```

### Schrift-Showcase-Komponente

Sie können die `FontShowcase`-Komponente in Ihren Seiten verwenden, um die aktuelle Schrift anzuzeigen:

```astro
---
import FontShowcase from '../components/FontShowcase.astro';
---

<FontShowcase />
```

Optionen:
- `showName={true|false}` - Schriftnamen ein-/ausblenden
- `showInfo={true|false}` - Schriftdetails ein-/ausblenden
- `compact={true|false}` - Kompakten Anzeigemodus verwenden

## Umlaut-Unterstützung

Alle Schriftkombinationen enthalten jetzt den erweiterten lateinischen Zeichensatz, der die korrekte Anzeige von Umlauten und anderen Sonderzeichen gewährleistet. Die Deutsch-Optimierte Kombination (#16) ist speziell für eine hervorragende Umlaut-Darstellung konzipiert.

## Technische Details

Wenn Sie die Schriftkombination ändern:

1. Das Skript `scripts/changeFontCombination.js` aktualisiert die `.env`-Datei
2. Das Skript `generateTailwindConfig.js` liest diesen Wert und aktualisiert die Tailwind-Konfiguration
3. Die Komponente `CustomFonts.astro` lädt die entsprechenden Google Fonts
4. Die Komponente `Fonts.astro` setzt CSS-Variablen für die Schriften
5. Das CSS in `custom-fonts.css` wendet diese Schriften auf verschiedene Elemente an

## Fehlerbehebung

Wenn Sie Probleme mit Schriftkombinationen haben:

1. **Schrift ändert sich nicht**: Stellen Sie sicher, dass Sie den Entwicklungsserver nach dem Ändern der Schriftkombination neu starten
2. **Umgebungsvariable wird nicht gelesen**: Überprüfen Sie, ob die `.env`-Datei den richtigen `FONT_COMBINATION`-Wert hat
3. **Umlaute werden nicht korrekt angezeigt**: Stellen Sie sicher, dass Sie eine Schriftkombination verwenden, die den erweiterten lateinischen Zeichensatz unterstützt
4. **Vorschauseite funktioniert nicht**: Stellen Sie sicher, dass Ihr Entwicklungsserver läuft und der API-Endpunkt zugänglich ist

## Hinzufügen neuer Schriftkombinationen

Um eine neue Schriftkombination hinzuzufügen:

1. Bearbeiten Sie `src/config/fontCombinations.js`
2. Fügen Sie einen neuen Eintrag zum Array hinzu, der dem bestehenden Muster folgt
3. Stellen Sie sicher, dass der lateinische Erweiterungsteilsatz für die richtige Umlaut-Unterstützung enthalten ist
4. Aktualisieren Sie die Datei `.env.example` mit der neuen Kombination
