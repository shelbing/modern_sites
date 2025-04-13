# Storyblok Integration Dokumentation

Dieses Dokument bietet einen umfassenden Leitfaden zur Integration des Storyblok Content Management Systems (CMS) in das Hotel Stern Webseiten-Projekt. Es umfasst die technische Implementierung, Komponenteninteraktion und Mechanismen zur Datenüberschreibung.

## Inhaltsverzeichnis

1. [Überblick](#überblick)
2. [Konfiguration](#konfiguration)
3. [Inhaltsstruktur](#inhaltsstruktur)
4. [Storyblok-Komponenten](#storyblok-komponenten)
5. [Datenfluss](#datenfluss)
6. [Überschreibbare Einstellungen](#überschreibbare-einstellungen)
7. [API-Integration](#api-integration)
8. [Mehrsprachige Unterstützung](#mehrsprachige-unterstützung)
9. [Entwicklungs-Workflow](#entwicklungs-workflow)
10. [Best Practices](#best-practices)

## Überblick

Die Hotel Stern Website nutzt Storyblok als Headless-CMS-Lösung. Diese Integration ermöglicht:

- Content-Management durch nicht-technische Teammitglieder
- Mehrsprachige Inhaltsunterstützung
- Komponentenbasierte Inhaltsmodellierung
- Live-Vorschau-Funktionen
- Versionskontrolle für Inhalte

Die Architektur folgt einer klaren Trennung zwischen Inhalt (verwaltet in Storyblok) und Präsentation (gebaut mit Astro.js und Svelte), was eine flexible Inhaltsbereitstellung über mehrere Kanäle ermöglicht.

## Konfiguration

### Kernkonfiguration

Die Storyblok-Integration ist in `storyblokConfig.js` im Projektstamm konfiguriert:

```javascript
// Initialisiert den Storyblok JavaScript-Client mit Ihrem Zugriffstoken
const Storyblok = new StoryblokClient({
  accessToken: env.STORYBLOK_TOKEN,
  cache: {
    clear: "auto",
    type: "memory",
  },
});

// Kernfunktion zum Abrufen von Storyblok-Daten mit Sprachunterstützung
export default async function getStoryblokConfig(lang="de") {
  try {
    const { data } = await Storyblok.get(
      "cdn/stories/" + hotel + "/grunddaten",
      {
        version: process.env.NODE_ENV === "development" ? "draft" : "published",
        language: lang,
      }
    );

    return data;
  } catch (error) {
    console.error("Error fetching Storyblok data:", error);
    return null;
  }
}
```

### Umgebungsvariablen

Die folgenden Umgebungsvariablen steuern die Storyblok-Integration:

- `STORYBLOK_TOKEN`: Ihr Storyblok-Zugriffstoken
- `PROPERTY`: Hotel-Eigenschafts-Identifier, der in der Storyblok-Inhaltsstruktur verwendet wird
- `NODE_ENV`: Steuert, ob Entwurfs- oder veröffentlichte Inhalte angezeigt werden

## Inhaltsstruktur

### Story-Organisation

Inhalte in Storyblok sind in einer hierarchischen Struktur organisiert:

1. **Eigenschaftsebene**: Ordner der obersten Ebene, benannt nach dem Hotel-Eigenschafts-Identifier
2. **Seiteninhalt**: Einzelne Seiten, gespeichert als "Stories"
3. **Basisdaten**: Kern-Hotelinformationen, gespeichert in der "grunddaten"-Story
4. **Komponenten-Blöcke**: Modulare Inhaltsblöcke innerhalb jeder Story

### Kern-Inhaltstypen

| Inhaltstyp | Zweck | Beispielverwendung |
|------------|-------|-------------------|
| Grunddaten | Kern-Hotelinformationen | Kontaktdaten, Adresse, rechtliche Informationen |
| Seiten | Einzelne Website-Seiten | Startseite, Über uns, Zimmer |
| Zimmer | Zimmerbeschreibungen | Zimmertypen, Annehmlichkeiten, Preisgestaltung |
| Sektionen | Wiederverwendbare Inhaltsabschnitte | Hero-Banner, Testimonials |

## Storyblok-Komponenten

Die Integration verwendet Komponenten-Mapping, um Storyblok-Inhaltsblöcke als Astro/Svelte-Komponenten zu rendern:

### Kernkomponenten

#### Seitenkomponente (`src/components/storyblok/Page.astro`)

```astro
<main {...storyblokEditable(blok)}>
  {
    blok.body?.map((blok: SbBlokData) => {
      return <StoryblokComponent language={language} blok={blok} />
    })
  }
</main>
```

Diese Komponente dient als Root-Container für Storyblok-Seiteninhalte und mappt verschachtelte Inhaltsblöcke auf ihre jeweiligen Komponenten.

### Sektionskomponenten

Die folgenden Komponenten empfangen und rendern Storyblok-Inhalte:

| Komponente | Zweck | Storyblok-Felder |
|------------|-------|------------------|
| `GoogleMap.astro` | Zeigt eine Google Map an | Location, Header |
| `PictureGallery.astro` | Bildergalerie | Header, Subheader, Images, Rows, Columns |
| `PDFDownloadSection.astro` | PDF-Downloads | Header, Subheader, ButtonText, File |
| `ZimmerListe.astro` | Listet Zimmeroptionen auf | BackgroundColor, Zimmer[] |
| `StorySection.astro` | Allgemeiner Inhaltsbereich | Header, SubHeader, Text, Image1, Image2, Ausrichtung |
| `FAQ.astro` | FAQ-Akkordeons | Header, SubHeader, faqItems[] |
| `SliderSection.astro` | Bild-/Inhalts-Slider | Verschiedene Slider-Optionen |
| `TeamSection.astro` | Team-Mitglieder-Anzeige | Header, SubHeader, team[] |
| `Footer.astro` | Website-Fußzeile | Grunddaten-Inhalt |

### Utility-Komponenten

| Komponente | Zweck |
|------------|-------|
| `RichText.astro` | Rendert Storyblok-Rich-Text-Felder |
| `Image.astro` | Verarbeitet Storyblok-Bild-Assets mit Optimierungen |
| `Grid.astro` | Layout-Komponente für verschachtelte Storyblok-Inhalte |

## Datenfluss

Der Datenfluss zwischen Storyblok und der Website folgt diesem Muster:

1. **Story-Abruf**: 
   - Dynamische Routen (`[...path].astro`) rufen Inhalte basierend auf der URL ab
   - Daten werden über die Storyblok-API abgerufen

2. **Inhalts-Rendering**:
   - Inhalte werden an die `StoryblokComponent` übergeben
   - Komponenten werden dynamisch gemappt und gerendert
   - Rich-Text wird mit `renderRichText` geparst und gerendert

3. **Asset-Handhabung**:
   - Bilder von Storyblok werden durch die `Image`-Komponente verarbeitet
   - Dateien (PDFs usw.) werden vom Storyblok-CDN bereitgestellt

## Überschreibbare Einstellungen

Bestimmte Storyblok-Inhalte können durch lokale Einstellungen überschrieben werden. Dazu gehören:

### 1. Visuelle Erscheinung

| Storyblok-Einstellung | Lokale Überschreibung | Überschreibungsmethode |
|-------------------|----------------|-----------------|
| Hintergrundfarben | Tailwind-Konfiguration | Einstellungen in `tailwind.config.js` haben Vorrang |
| Schrifteinstellungen | Umgebungsvariablen | `FONT_COMBINATION` in .env-Datei |
| Komponenten-Styling | CSS-Variablen | Benutzerdefinierte Eigenschaften in CSS-Dateien |

### 2. Inhaltsanzeige

| Storyblok-Inhalt | Lokale Überschreibung | Überschreibungsmethode |
|-------------------|----------------|-----------------|
| Hotel-Informationen | Umgebungsvariablen | Eigenschaften in .env-Dateien definiert |
| API-Endpunkte | Konfigurationsdateien | Einstellungen in API-Konfiguration |
| Textinhalt | Sprachdateien | Lokalisierungsdateien für statischen Text |

### 3. Komponenten-Verhalten

Einige Komponenten erlauben Verhaltensüberschreibungen durch lokale Einstellungen:

- **ZimmerListe**: Zimmeranzeigereihenfolge kann lokal angepasst werden
- **SliderSection**: Animationseinstellungen können in Komponenten-Props angepasst werden
- **Footer**: Kontaktinformationen können mit Umgebungsvariablen überschrieben werden

## API-Integration

Die Storyblok-API wird auf verschiedene Weise genutzt:

### Grundlegendes Content-Fetching

```javascript
// Eine einzelne Story abrufen
const { data } = await storyblokApi.get('cdn/stories/'+hotel+'/'+story, {
  language: lang,
  version: import.meta.env.DEV ? "draft" : "published",
});
```

### Statische Pfadgenerierung

Das Projekt verwendet Storyblok, um statische Pfade für das Prerendering zu generieren:

```javascript
// Alle möglichen Seitenpfade abrufen
const links = await storyblokApi.getAll('cdn/links', {
  version: (preview || isLocalhost) ? "draft" : "published",
});
```

### Rich-Text-Rendering

Rich-Text-Felder von Storyblok werden mit folgender Methode gerendert:

```javascript
import { renderRichText } from "@storyblok/astro";
const text = renderRichText(blok.Text);
```

## Mehrsprachige Unterstützung

Die Storyblok-Integration unterstützt mehrere Sprachen durch:

1. **Sprachparameter**: Inhalte werden mit dem entsprechenden Sprachcode angefordert
   ```javascript
   const { data } = await storyblokApi.get('cdn/stories/'+hotel+'/grunddaten', {
     language: lang,
   });
   ```

2. **URL-Struktur**: Die Sprache ist im URL-Pfad eingebettet (`[lang]/[...slug]`)

3. **Komponenten-Propagation**: Sprachparameter werden an alle Komponenten weitergegeben
   ```astro
   <StoryblokComponent language={lang} blok={blok} />
   ```

## Entwicklungs-Workflow

### Content-Bearbeitungszyklus

1. Aktualisierung der Inhalte im Storyblok Visual Editor
2. Inhaltsänderungen sind im Entwicklungsmodus sofort sichtbar
3. Änderungen werden durch den Storyblok-Publishing-Workflow für die Produktion veröffentlicht

### Hinzufügen neuer Komponenten

So fügen Sie einen neuen Komponententyp zu Storyblok hinzu:

1. Erstellen Sie die Komponente im Storyblok-Schema-Editor
2. Erstellen Sie eine passende Astro-Komponente in `src/components/`
3. Implementieren Sie die Komponente, um Storyblok-Daten zu empfangen und zu rendern
4. Testen Sie im Entwicklungsmodus mit echten Inhalten

## Best Practices

### Inhaltsmodellierung

- Verwenden Sie verschachtelte Komponenten für komplexe Layouts
- Begrenzen Sie die Nutzung von Rich-Text-Feldern für eine bessere Struktur
- Erstellen Sie wiederverwendbare Inhaltsblöcke, wenn möglich

### Leistungsoptimierung

- Aktivieren Sie Storyblok-Caching für die Produktion
- Verwenden Sie die Image-Komponente für optimierte Assets
- Implementieren Sie inkrementelle statische Regeneration, wenn möglich

### Entwicklungstipps

- Verwenden Sie die Storyblok-Vorschauumgebung zum Testen
- Erstellen Sie Mock-Daten für die Komponentenentwicklung
- Dokumentieren Sie Komponenten-Schemas für Content-Editoren

---

Diese Dokumentation bietet einen umfassenden Überblick über die Storyblok-Integration in der Hotel Stern Website. Für spezifische Implementierungsdetails beziehen Sie sich auf die entsprechenden Komponentendateien und die Storyblok-Schema-Dokumentation.
