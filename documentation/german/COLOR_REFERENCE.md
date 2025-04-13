# Hotel Stern Farbreferenz

Dieses Dokument bietet eine vollständige Referenz aller Farben, die im Hotel Stern Farbsystem (`src/config/colors.js`) definiert sind. Verwenden Sie diese Referenz bei der Entwicklung neuer Komponenten oder der Änderung bestehender Komponenten, um die Farbkonsistenz in der gesamten Anwendung zu gewährleisten.

## Inhaltsverzeichnis

1. [Themen-Farben](#themen-farben)
2. [Bereichsspezifische Farben](#bereichsspezifische-farben)
3. [Nutzungsrichtlinien](#nutzungsrichtlinien)
4. [Überlegungen zum Dunkelmodus](#überlegungen-zum-dunkelmodus)

## Themen-Farben

Dies sind die Kernfarben, die im `themeColors`-Objekt definiert sind und als Grundlage für das gesamte Farbsystem dienen.

### Primär- und Sekundärfarben

| Token | Hellmodus | Dunkelmodus | Beschreibung |
|-------|-----------|-------------|--------------|
| `primary` | `#305F85` | `#6B9AC4` | Verfeinertes Marineblau (hell) und helleres Blau (dunkel) |
| `secondary` | `#38A18C` | `#FFEB3B` (vorübergehend für Debugging) | Sattes Türkis (hell) und leuchtendes Gelb für Debugging (dunkel) |

### Hintergrundfarben

| Token | Hellmodus | Dunkelmodus | Beschreibung |
|-------|-----------|-------------|--------------|
| `background` | `#D8D0C8` | `#0F161F` | Warmes Taupe (hell) und fast schwarzes Blau (dunkel) |
| `paper` | `#F8F8F8` | `#1F2937` | Leichtes Weiß (hell) und dunkleres Blaugrau (dunkel) |

### Textfarben

| Token | Hellmodus | Dunkelmodus | Beschreibung |
|-------|-----------|-------------|--------------|
| `text` | `#2C3E50` | `#E2E8F0` (aktuell `#9C27B0` für Debugging) | Tiefes Marineblau-Anthrazit (hell) und weiches Weiß (dunkel) |
| `textSecondary` | `#566573` | `#A0AEC0` | Schiefergrau (hell) und gedämpftes Blaugrau (dunkel) |

### Akzentfarben

| Token | Hellmodus | Dunkelmodus | Beschreibung |
|-------|-----------|-------------|--------------|
| `accent` | `#D4A15A` | `#F6C066` | Gedämpftes Gold (hell) und helleres Gold (dunkel) |

### Schaltflächenfarben

| Token | Hellmodus | Dunkelmodus | Beschreibung |
|-------|-----------|-------------|--------------|
| `primarybutton` | `#305F85` | `#3A6B96` | Entspricht Primärfarbe (hell) und dunkleres Blau (dunkel) |
| `primarybuttontext` | `#FFFFFF` | `#FFFFFF` | Weißer Text für beide Modi |
| `secondarybutton` | `#FFFFFF` | `#253649` | Weiß (hell) und dunkles Papier (dunkel) |
| `secondarybuttontext` | `#305F85` | `#E2E8F0` | Primärfarbe (hell) und heller Text (dunkel) |
| `button` | `#F0F8FF` | `#1F354A` | Sehr helles Blau (hell) und dunkleres Marineblau (dunkel) |
| `buttontext` | `#305F85` | `#E2F0FF` | Primäres Blau (hell) und helleres Blau (dunkel) |

### Kopfzeilen- und Menüfarben

| Token | Hellmodus | Dunkelmodus | Beschreibung |
|-------|-----------|-------------|--------------|
| `heading` | `#2C3E50` | `#E2E8F0` | Tiefes Marineblau-Anthrazit (hell) und weiches Weiß (dunkel) |
| `menu` | `#F9F7F2` | `#1A2639` | Heller Hintergrund (hell) und dunkler Hintergrund (dunkel) |
| `menutext` | `#2C3E50` | `#E2E8F0` | Text für Menüpunkte in hellen und dunklen Modi |
| `menuaccent` | `#305F85` | `#6B9AC4` | Primärer Akzent für Menüs in beiden Modi |

### Abschnittsüberschrift-Farben

| Token | Hellmodus | Dunkelmodus | Beschreibung |
|-------|-----------|-------------|--------------|
| `sectionheader` | `#305F85` | `#6B9AC4` | Primäres Blau für Überschriften in beiden Modi |
| `sectionsubheader` | `#38A18C` | `#67D5B5` | Sekundäres Türkis für Unterüberschriften in beiden Modi |

## Bereichsspezifische Farben

Das Farbsystem umfasst spezialisierte Farben für verschiedene Bereiche der Website.

### Hero-Bereich

| Komponente | Eigenschaft | Hellmodus | Dunkelmodus |
|------------|-------------|-----------|-------------|
| Haupttext | Hintergrund | `secondary-light` | `primary-dark` |
| Haupttext | Deckkraft | `85%` | `90%` |
| Haupttext | Textfarbe | `paper-light` | `paper-light` |
| Untertitel | Hintergrund | `paper-light` | `accent-dark` |
| Untertitel | Deckkraft | `85%` | `85%` |
| Untertitel | Textfarbe | `text-light` | `paper-light` |

### Abschnittsblock

| Komponente | Eigenschaft | Hellmodus | Dunkelmodus |
|------------|-------------|-----------|-------------|
| Überschrift | Farbe | `sectionheader-light` | `sectionheader-dark` |
| Unterüberschrift | Farbe | `sectionsubheader-light` | `sectionsubheader-dark` |

### FAQ-Bereich

| Komponente | Eigenschaft | Hellmodus | Dunkelmodus |
|------------|-------------|-----------|-------------|
| Frage | Hintergrund | `paper-light` | `paper-dark` |
| Frage | Textfarbe | `text-light` | `text-dark` |
| Frage | Rahmenfarbe | `accent-light` | `accent-dark` |
| Frage (Geöffnet) | Hintergrund | `secondary-light` | `secondary-dark` |
| Frage (Geöffnet) | Textfarbe | `paper-light` | `paper-light` |
| Frage (Geöffnet) | Rahmenfarbe | `secondary-light` | `secondary-dark` |
| Antwort | Hintergrund | `paper-light` | `paper-dark` |
| Antwort | Textfarbe | `text-light` | `text-dark` |
| Antwort | Rahmenfarbe | `accent-light` | `accent-dark` |

### Chatbot-Bereich

| Komponente | Eigenschaft | Hellmodus | Dunkelmodus |
|------------|-------------|-----------|-------------|
| Benutzernachricht | Hintergrund | `primary-light` | `background-dark` |
| Benutzernachricht | Textfarbe | `primarybuttontext-light` | `primarybuttontext-dark` |
| Benutzernachricht | Zeitfarbe | `text-light` | `gray-300` |
| Bot-Nachricht | Hintergrund | `primary-light` | `secondary-dark` |
| Bot-Nachricht | Textfarbe | `primarybuttontext-light` | `primarybuttontext-dark` |
| Bot-Nachricht | Zeitfarbe | `text-light` | `gray-300` |
| Container | Hintergrund | `paper-light` | `paper-dark` |
| Container | Rahmenfarbe | `secondary-light` | `secondary-dark` |
| Eingabefeld | Hintergrund | `paper-light` | `paper-dark` |
| Eingabefeld | Textfarbe | `text-light` | `text-dark` |
| Eingabefeld | Rahmenfarbe | `secondary-light` | `secondary-dark` |

## Nutzungsrichtlinien

1. **Verwenden Sie immer semantische Tokens**: Verwenden Sie anstelle von rohen Farbwerten (wie `#305F85`) die semantischen Tokens (wie `text-primary-light`).

2. **Dunkelmodus-Varianten einbeziehen**: Kombinieren Sie immer Hellmodus-Stile mit ihren Dunkelmodus-Äquivalenten:
   ```css
   text-text-light dark:text-text-dark
   ```

3. **Etablierte Muster befolgen**: Für häufige UI-Elemente wie Schaltflächen, Karten und Formular-Eingabefelder befolgen Sie die etablierten Styling-Muster.

4. **Bereichsspezifische Farben verwenden, wenn angebracht**: Viele Bereiche haben spezialisierte Farbschemata; verwenden Sie diese, wenn Sie in diesen Kontexten arbeiten.

5. **Kontrast für Barrierefreiheit prüfen**: Stellen Sie einen ausreichenden Kontrast zwischen Text- und Hintergrundfarben für Lesbarkeit und WCAG-Konformität sicher.

## Überlegungen zum Dunkelmodus

1. **Aktuelle Debug-Einstellung**: Beachten Sie, dass die `text-dark`-Farbe vorübergehend auf Lila (`#9C27B0`) für Debugging-Zwecke eingestellt ist. In der Produktion wird sie auf weiches Weiß (`#E2E8F0`) zurückgesetzt.

2. **Der Dunkelmodus wird mithilfe der Dunkelmodus-Variante von Tailwind implementiert**: Elemente wechseln automatisch zu ihren Dunkelmodus-Varianten, wenn das übergeordnete HTML-Element die Klasse `dark` hat.

3. **Beide Modi testen**: Testen Sie Ihre Änderungen immer sowohl im Hell- als auch im Dunkelmodus, um die korrekte Farbanwendung sicherzustellen.

4. **Vermeiden Sie fest codierte Farben**: Wenn Sie eine neue Farbe benötigen, wenden Sie sich an das Design-Team und fügen Sie sie dem zentralisierten Farbsystem in `src/config/colors.js` hinzu.
