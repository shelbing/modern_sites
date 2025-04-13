# Modern Sites

Eine moderne Hotelwebsite-Plattform entwickelt mit Astro.js, die ein nahtloses und ansprechendes Erlebnis für Hotelgäste und potenzielle Kunden bietet. Dieses Projekt wurde von hotel_stern migriert und dient als Basis für moderne Hotelwebsites.

## 🌟 Projektübersicht

Das Modern Sites Projekt verbindet modernste Webtechnologien mit traditionellen Gastgewerbewerten, um responsive und benutzerfreundliche Hotelwebsites zu erstellen. Die Plattform bietet umfassende Funktionen für Hotelpräsentation, Buchungsmanagement und Gästekommunikation und kann als Basis für verschiedene Hotelwebsites verwendet werden.

## 🛠 Technischer Stack

### Kerntechnologien
- **Framework**: Astro.js 4.x
- **Styling**: TailwindCSS mit individuellem Farbsystem
- **CMS**: Storyblok
- **Zahlungen**: Stripe, Adyen, SumUp
- **Analytik**: Plausible
- **Monitoring**: Sentry

### Hauptfunktionen
- Mehrsprachige Unterstützung
- Responsives Design
- Dynamisches Content Management
- Integriertes Buchungssystem
- Sichere Zahlungsabwicklung
- Performance Optimierung

## 📚 Dokumentation

Umfassende Dokumentation zu verschiedenen Aspekten des Projekts finden Sie in den folgenden Dateien:

- [Farb- und Schrift-System](./documentation/COLOR_AND_FONT_SYSTEMS.md) - Detaillierte Dokumentation des zentralisierten Farb- und Schriftsystems
- [TypeScript Setup](./documentation/TYPESCRIPT.md) - Konfiguration, Typdefinitionen und Best Practices für TypeScript
- [Svelte Implementierung](./documentation/SVELTE.md) - Komponentenaufbau, Zustandsverwaltung und UI-Patterns mit Svelte
- [Storyblok Integration](./documentation/STORYBLOK.md) - Umfassende Dokumentation der Storyblok CMS-Integration, Komponenten und Datenfluss
- [Hintergrundfarbsystem](./documentation/BACKGROUND_COLOR_SYSTEM.md) - Spezifische Details zum Hintergrundfarbsystem
- [Schriftgrößensystem](./documentation/FONT_SIZE_SYSTEM.md) - Dokumentation des Schriftgrößensystems
- [Schriftartensystem](./documentation/FONT_SYSTEM.md) - Informationen über die verfügbaren Schriftarten und deren Verwendung
- [Schriftarten-Anleitung](./documentation/FONT_GUIDE.md) - Anleitung zur Verwendung von Schriftarten im Projekt
- [Schriftarten-README](./documentation/README-FONTS.md) - Weitere Informationen zu Schriftarten

## 📁 Projektstruktur

```text
/
├── public/              # Statische Assets
├── src/
│   ├── components/      # UI-Komponenten
│   │   ├── Base/       # Grundkomponenten
│   │   ├── MenuBar/    # Navigation
│   │   ├── Sections/   # Seitenabschnitte
│   │   └── ibe/        # Buchungssystem
│   ├── emails/         # E-Mail-Templates
│   ├── layouts/        # Seitenlayouts
│   ├── lib/           # Hilfsfunktionen
│   ├── pages/         # Seitenrouten
│   ├── routes/        # API-Routen
│   ├── stores/        # Zustandsverwaltung
│   └── styles/        # Globale Styles
└── package.json
```

## 🧩 Komponenten

### Basiskomponenten
#### RichText
- Verarbeitet strukturierte Inhalte aus Storyblok
- Unterstützt Markdown und HTML
- Responsive Textformatierung
- Integrierte Bildoptimierung

#### Loading
- Anpassbarer Ladeindikator
- Konfigurierbare Mindestanzeigedauer
- Animierte Übergänge
- Barrierefreie Implementierung

#### Slider
- Responsiver Bildslider
- Touch-Unterstützung
- Konfigurierbare Intervalle
- Lazy Loading für Bilder
- Keyboard Navigation

#### Badge
- Statusanzeigen
- Konfigurierbare Farben
- Responsive Größenanpassung
- Icon-Integration

### Menükomponenten
#### MenuBar
- Responsive Navigation
- Mobile Toggle-Menü
- Dynamische Menüpunkte aus Storyblok
- Sticky-Header-Option
- Integrierte Suche

#### MenuItem
- Mehrsprachige Links
- Active-State-Handling
- Unterstützung für Untermenüs
- Icon-Integration
- Link-Tracking

#### LanguageSelector
- Sprachumschaltung
- Flaggen-Icons
- URL-Lokalisierung
- Speicherung der Sprachpräferenz

#### ThemeToggle
- Dark/Light Mode Switch
- Animierte Übergänge
- System-Präferenz-Erkennung
- Persistente Einstellung

### Sektionskomponenten
#### FAQ
- Akkordeon-Funktionalität
- Suchfunktion
- Kategorisierung
- Analytics-Integration
- SEO-Optimierung

#### ContactSection
- Validiertes Kontaktformular
- reCAPTCHA-Integration
- E-Mail-Templating
- Erfolgs-/Fehlermeldungen
- Datenschutz-Checkbox

#### SocialProof
- Testimonial-Karussell
- Bewertungssterne
- Bildintegration
- Automatische Rotation
- Responsive Layout

#### TeamSection
- Mitarbeiter-Grid
- Hover-Effekte
- Kontaktinformationen
- Social Media Links
- Responsive Bildgrößen

#### StorySection
- Rich-Text-Content
- Bildgalerie
- Video-Integration
- Parallax-Effekte
- Responsive Layouts

#### Newsletter
- Anmeldeformular
- Double-Opt-In
- Mailchimp-Integration
- Erfolgsmeldungen
- DSGVO-konform

### IBE (Internet Booking Engine) Komponenten
#### BookingWidget
- Datums- und Gästeauswahl
- Verfügbarkeitsprüfung
- Rate-Anzeige
- Responsive Design
- Mobile-First Ansatz

#### RoomSelector
- Zimmertyp-Übersicht
- Bildgalerie
- Amenity-Listen
- Preisvergleich
- Verfügbarkeitsanzeige

#### DatePicker
- Belegungskalender
- Mindest-/Höchstaufenthalt
- Saisonale Preise
- Eventmarkierungen
- Mobile-optimiert

#### RateDisplay
- Dynamische Preisanzeige
- Währungsumrechnung
- Rabatt-Handling
- Rate-Beschreibungen
- Stornobedingungen

#### GuestInfo
- Gästedatenerfassung
- Adressvalidierung
- Zusatzwünsche
- Firmenkundenfelder
- DSGVO-Compliance

#### PaymentProcessor
- Multi-Provider-Support
- 3D-Secure
- Tokenization
- Fehlerhandling
- Transaktionsübersicht

#### BookingSummary
- Buchungsübersicht
- PDF-Generierung
- E-Mail-Versand
- Kalenderintegration
- Änderungsoptionen

#### Confirmation
- Buchungsbestätigung
- QR-Code-Generierung
- Wegbeschreibung
- Zusatzinformationen
- Share-Funktionen

### Utility-Komponenten
#### Scripts
- Skript-Lazy-Loading
- Performance-Monitoring
- Error-Tracking
- Analytics-Integration
- Cookie-Handling

#### FlowbiteScript
- Komponenten-Initialisierung
- Event-Handling
- State-Management
- Responsive-Helpers
- Accessibility-Features

#### PlausibleSnippet
- Privacy-First Analytics
- Event-Tracking
- Goal-Conversion
- Performance-Metrics
- Custom-Properties

### Chatbot-Komponenten
#### ChatInterface
- KI-gestützte Kommunikation
- Echtzeit-Antworten
- Mehrsprachigkeit
- Kontextbewusstsein
- Mobile-optimiert

#### MessageList
- Nachrichtenverlauf
- Medien-Einbindung
- Zeitstempel
- Lesebestätigungen
- Scroll-Handling

#### InputArea
- Texteingabe
- Datei-Upload
- Emoji-Support
- Autovervollständigung
- Mobile Keyboard Support

#### ResponseBubble
- Antwort-Formatierung
- Link-Integration
- Action-Buttons
- Typing-Indikatoren
- Animationen

## 🚀 Entwicklung

### Befehle

| Befehl                    | Aktion                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Abhängigkeiten installieren                      |
| `npm run dev`             | Entwicklungsserver starten (`localhost:4321`)    |
| `npm run build`           | Produktions-Build erstellen                      |
| `npm run preview`         | Build lokal testen                              |
| `npm run prebuild`        | Tailwind-Konfiguration generieren               |
| `npm run buildinstructions`| AI-Instruktionen generieren                    |

### Entwicklungsworkflow
1. Lokale Entwicklung mit Hot Reloading
2. Staging-Umgebung-Tests
3. Produktions-Deployment mit Vercel
4. Kontinuierliche Integration

### Umgebungsvariablen
Das Projekt verwendet verschiedene Umgebungsvariablen zur Konfiguration. Kopieren Sie `.env.example` zu `.env.local` und passen Sie die Werte an.

| Variable | Beschreibung | Standardwert |
| :------- | :----------- | :----------- |
| `PROPERTY` | Identifier für Storyblok-Inhalte | szs |
| `FONT_COMBINATION` | Font-Kombination (1-22) | 1 |
| `SHOW_TEST_LINKS` | Test-Links im Footer anzeigen | false |

#### Test-Links im Footer
In der Entwicklungsumgebung werden Test-Links (Font Preview, Admin Panels) automatisch angezeigt. Um diese Links in Produktions- oder Staging-Umgebungen anzuzeigen, setzen Sie `SHOW_TEST_LINKS=true`.

## 🔒 Sicherheit & Leistung

### Sicherheitsfunktionen
- Sichere Zahlungsverarbeitung
- Datenverschlüsselung
- Formularvalidierung
- Security Headers

### Leistungsoptimierung
- Bildoptimierung
- Code-Splitting
- Lazy Loading
- Cache-Optimierung

## 🌐 Buchungssystem

### Buchungsablauf
1. **Initiale Suche**
   - Datums- und Gästeauswahl
   - Verfügbarkeitsprüfung via apaleo

2. **Zimmerauswahl**
   - Zimmerdetails und Bilder
   - Preise und Bedingungen
   - Optionsvergleich

3. **Gastinformationen**
   - Persönliche Daten
   - Sonderwünsche
   - Zusatzleistungen

4. **Zahlungsabwicklung**
   - Multiple Zahlungsoptionen
   - Sichere Verarbeitung
   - Transaktionsbestätigung

### apaleo-Integration
- Echtzeit-Verfügbarkeit
- Direkte Buchungserstellung
- Dynamische Preisgestaltung
- Gästeprofilmanagement

## 🔄 Wartung

- Regelmäßige Dependency-Updates
- Sicherheits-Patches
- Performance-Monitoring
- Content-Updates via CMS

## 📝 Lizenz

Alle Rechte vorbehalten © Hotel Stern
