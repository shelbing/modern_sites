# Hotel Stern Schriftartenleitfaden

Dieser Leitfaden erklärt, wie die Schriftkombinationen in der Hotel Stern Website verwendet und angepasst werden können.

## Verfügbare Schriftkombinationen

Die Website enthält 23 sorgfältig ausgewählte Schriftkombinationen, die jeweils für einen bestimmten Hotelstil oder eine bestimmte Atmosphäre entwickelt wurden:

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
16. **Deutsch-Optimiert**: Noto Serif (Überschrift) + Noto Sans (Text) - Speziell für die deutsche Sprache optimiert mit hervorragender Umlaut-Unterstützung
17. **Böhmisches Flair**: Abril Fatface / Poppins
18. **Nordischer Minimalismus**: Josefin Slab / Josefin Sans
19. **Art-Deco-Revival**: Poiret One / Didact Gothic
20. **Rustikaler Charme**: Amatic SC / Quattrocento Sans
21. **Vintage-Schreibmaschine**: Special Elite / Courier Prime
22. **Schweizer Präzision**: Bebas Neue / Roboto Mono
23. **Elegante Einfachheit**: Lora / Inter

## Unterstützung für Sonderzeichen

Alle Schriftkombinationen umfassen jetzt den erweiterten lateinischen Zeichensatz, der eine korrekte Unterstützung für Umlaute (ä, ö, ü, Ä, Ö, Ü) und andere Sonderzeichen bietet, die im Deutschen und anderen europäischen Sprachen verwendet werden.

Für die beste Umlaut-Unterstützung empfehlen wir die Verwendung der **Deutsch-Optimierten** Schriftkombination (#16), die Googles Noto-Schriften verwendet, die speziell für eine hervorragende multilinguale Unterstützung entwickelt wurden.

## Wie man Schriftkombinationen ändert

### Verwendung des NPM-Skripts (Empfohlen)

Der einfachste Weg, Schriftkombinationen zu ändern, ist die Verwendung des bereitgestellten npm-Skripts:

```bash
# Wechsel zur Schriftkombination #3 (Boutique-Hotel)
npm run font 3
```

Dies wird:
1. Ihre `.env`-Datei mit der ausgewählten Schriftkombination aktualisieren
2. Die Tailwind-Konfiguration neu generieren
3. Informationen über die ausgewählte Schriftkombination anzeigen

Nach dem Ändern der Schrift starten Sie Ihren Entwicklungsserver neu, um die Änderungen zu sehen:

```bash
npm run dev
```

### Manuelle Methode

Wenn Sie Schriftarten lieber manuell ändern möchten:

1. Erstellen oder bearbeiten Sie Ihre `.env`-Datei im Projektstamm
2. Fügen Sie die Variable `FONT_COMBINATION` mit einer Zahl von 1-16 hinzu oder aktualisieren Sie sie
   ```
   FONT_COMBINATION=5
   ```
3. Führen Sie den Tailwind-Konfigurationsgenerator aus:
   ```bash
   node generateTailwindConfig.js
   ```
4. Starten Sie Ihren Entwicklungsserver neu

## Struktur der Schriftkombination

Jede Schriftkombination besteht aus:

- **Überschriftenschrift**: Wird für Überschriften, Titel und hervorgehobenen Text verwendet
- **Textschrift**: Wird für Fließtext, Absätze und UI-Elemente verwendet
- **Schriftstärken**: Verschiedene Stärken für jede Schrift verfügbar
- **Google Fonts URL**: Die URL zum Laden der Schriften von Google Fonts

## Entwicklungsinformationen

### Schrift-Debug-Modus

Im Entwicklungsmodus erscheint ein kleines Debug-Panel in der unteren rechten Ecke des Bildschirms, das Folgendes anzeigt:
- Aktueller Schriftthemenname
- Name der Überschriftenschrift
- Name der Textschrift

Dieses Panel ist nur während der Entwicklung sichtbar und erscheint nicht in der Produktion.

### Hinzufügen eigener Schriftkombinationen

Um Ihre eigenen Schriftkombinationen hinzuzufügen, bearbeiten Sie die Datei `/src/config/fontCombinations.js` und fügen Sie einen neuen Eintrag zum Array hinzu.

## Details zur Schriftimplementierung

Das Schriftsystem arbeitet durch mehrere Schichten:

1. **Umgebungsvariable**: `FONT_COMBINATION` in `.env` wählt die Schriftkombination aus
2. **Schriftkonfiguration**: Definiert in `/src/config/fontCombinations.js`
3. **CSS-Variablen**: Im `<style>`-Tag in `Fonts.astro` gesetzt
4. **Tailwind-Konfiguration**: Generiert durch `generateTailwindConfig.js`
5. **CSS-Überschreibungen**: Angewendet in `custom-fonts.css`

Dieser mehrschichtige Ansatz stellt sicher, dass Schriften in der gesamten Anwendung konsistent angewendet werden, unabhängig von der Quelle des Stylings (Tailwind, CSS oder Inline-Styles).
