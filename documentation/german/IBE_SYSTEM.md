# Hotel Stern Internet Buchungs-Engine (IBE) Dokumentation

## Inhaltsverzeichnis

1. [Überblick](#überblick)
2. [Systemarchitektur](#systemarchitektur)
3. [Buchungsablauf](#buchungsablauf)
4. [Komponentenstruktur](#komponentenstruktur)
5. [Datenstrukturen](#datenstrukturen)
6. [API-Integration](#api-integration)
7. [Zahlungsabwicklung](#zahlungsabwicklung)
8. [Lokalisierung](#lokalisierung)
9. [Debugging & Wartung](#debugging--wartung)

## Überblick

Die Internet Buchungs-Engine (IBE) ist ein umfassendes System, das Gästen ermöglicht, Unterkünfte im Hotel Stern zu suchen, auszuwählen und zu buchen. Die IBE ist mit Svelte entwickelt und mit Zahlungsabwicklungssystemen integriert, um ein nahtloses Buchungserlebnis von der ersten Suche bis zur Zahlungsbestätigung zu bieten.

## Systemarchitektur

Die IBE ist als mehrstufiger Buchungsprozess mit Svelte-Komponenten und Zustandsverwaltung durch Svelte-Stores implementiert. Das System integriert sich mit:

- **Apaleo** - Hotelmanagementsystem für Bestandsverwaltung und Buchungsservices
- **Stripe/Zahlungsabwickler** - Für sichere Zahlungsabwicklung
- **Storyblok CMS** - Für die Inhaltsverwaltung von Zimmerbeschreibungen und -bildern

Die Anwendung folgt einer komponentenbasierten Architektur, bei der jeder Schritt des Buchungsprozesses von dedizierten Komponenten verwaltet wird, wobei der Zustand über Stores zwischen den Komponenten geteilt wird.

## Buchungsablauf

Der IBE-Buchungsprozess besteht aus 5 verschiedenen Schritten:

### Schritt 1: Suche & Zimmerauswahl
- Benutzer gibt Suchkriterien ein (Daten, Gäste usw.)
- System ruft verfügbare Angebote von der Apaleo-API ab
- Angebote werden gefiltert und mit CMS-Inhalten angereichert
- Benutzer wählt ein Zimmerangebot aus, um fortzufahren

### Schritt 2: Zusätzliche Dienstleistungen
- Benutzer überprüft das ausgewählte Zimmer
- Verfügbare zusätzliche Dienstleistungen werden präsentiert
- Benutzer kann Dienstleistungen hinzufügen/entfernen
- Gesamtpreis wird dynamisch berechnet

### Schritt 3: Erhebung persönlicher Daten
- Vollständige Buchungsübersicht wird angezeigt
- Benutzer gibt persönliche und Kontaktinformationen ein
- System validiert die eingegebenen Daten
- Zahlungsabsicht wird basierend auf dem Land erstellt

### Schritt 4: Zahlungsabwicklung
- Abschließende Buchungsübersicht wird präsentiert
- Zahlungsoptionen werden basierend auf dem Land des Benutzers angezeigt
- Sicheres Zahlungsformular wird dargestellt
- Zahlung wird über den ausgewählten Anbieter abgewickelt

### Schritt 5: Bestätigung
- Buchungsbestätigung wird angezeigt
- Buchungsreferenz und Zusammenfassung werden angezeigt
- Bestätigungs-E-Mail wird an den Benutzer gesendet
- Optionen für die nächsten Schritte werden bereitgestellt

## Komponentenstruktur

### Kernkomponenten

- **`bookingEngine.astro`** - Server-seitiger Wrapper
- **`bookingEngine.svelte`** - Hauptorchestrator-Komponente
- **`bookingSearchForm.svelte`** - Implementierung des Suchformulars
- **`bookingStep1.svelte`** - Zimmerauswahl-Interface
- **`bookingStep2.svelte`** - Auswahl zusätzlicher Dienstleistungen
- **`bookingStep3.svelte`** - Erhebung persönlicher Daten
- **`bookingStep4.svelte`** - Zahlungsabwicklung
- **`bookingStep5.svelte`** - Bestätigungsanzeige

### Unterstützende Komponenten

- **`OfferList.svelte`** - Zeigt verfügbare Zimmerangebote an
- **`CartConfirmation.svelte`** - Zeigt aktuelle Auswahl an
- **`AdditionalServices.svelte`** - Zeigt verfügbare Zusatzleistungen an
- **`TotalPrice.svelte`** - Berechnet und zeigt Preise an
- **`PersonalDataForm.svelte`** - Sammelt Gästeinformationen
- **`PaymentForm.svelte`** - Handhabt die Zahlungsabwicklung
- **`OffersLoader.svelte`** - Verwaltet Datenladestatuszustände
- **`NoOffersAvailable.svelte`** - Fallback für keine Verfügbarkeit

## Datenstrukturen

Das IBE-System verwendet mehrere Schlüsseldatenstrukturen, um den Buchungsprozess zu verwalten. Detaillierte Informationen zu diesen Strukturen finden Sie in der [IBE_DATA_STRUCTURES.md](IBE_DATA_STRUCTURES.md) Dokumentation.

### 1. Booking Store (`bookingStore.js`)

Verwaltet den Hauptbuchungsprozesszustand, einschließlich des aktuellen Schritts, der Buchungsdetails und der persönlichen Daten des Gastes.

### 2. Form Store (`formStore.js`)

Verwaltet Suchformulardaten wie An- und Abreisedaten, Anzahl der Erwachsenen, Kinder usw.

### 3. Offers Store (`offersStore.js`)

Verwaltet verfügbare Zimmerangebote, die von der API zurückgegeben und mit zusätzlichen Daten angereichert werden.

### 4. Cart Store (`cartStore.js`)

Verwaltet ausgewählte Elemente wie das gewählte Zimmerangebot, zusätzliche Dienstleistungen und berechnet die Gesamtpreise.

### 5. Payment Store (`stripeStore.js`)

Verwaltet Zahlungsdaten, einschließlich Zahlungsabsicht, Status und Buchungsreferenz.

### 6. Room Store (`roomsStore.js`)

Verwaltet Zimmertypendaten mit Beschreibungen, Bildern und Annehmlichkeiten.

### 7. Bundle Store (`bundlesStore.js`)

Verwaltet Paketdaten mit besonderen Angeboten und Preisanpassungen.

## API-Integration

Die IBE integriert sich mit mehreren APIs:

### Interne API-Endpunkte

- **`/api/ibe/search`** - Sucht nach verfügbaren Angeboten
- **`/api/ibe/allOffers`** - Ruft alle statischen Angebotsdaten ab
- **`/api/ibe/create_payment_intent`** - Erstellt die Zahlungsabsicht
- **`/api/ibe/confirm_booking`** - Bestätigt die Buchung nach Zahlung

### Externe APIs

- **Apaleo API** - Für Bestand, Verfügbarkeit und Buchung
- **Stripe API** - Für die Zahlungsabwicklung
- **Storyblok API** - Für Content-Management

## Zahlungsabwicklung

Das Zahlungssystem unterstützt mehrere Zahlungsmethoden basierend auf dem Land des Gastes:

- **Kredit-/Debitkarten** - Alle Länder
- **SEPA-Lastschrift** - EU-Länder
- **Länderspezifische Methoden**:
  - Deutschland: Sofort, Giropay, Klarna, PayPal
  - Österreich: EPS, Sofort, Klarna
  - Niederlande: iDEAL, Klarna
  - Belgien: Bancontact, Klarna
  - Schweiz: Karten, Klarna

Der Zahlungsablauf folgt diesen Schritten:
1. Zahlungsabsicht mit ausgewählten Zahlungsmethoden erstellen
2. Zahlungsformular dem Benutzer präsentieren
3. Zahlung über Anbieter abwickeln
4. Buchung bei erfolgreicher Zahlung bestätigen
5. Weiterleitung zur Bestätigungsseite

## Lokalisierung

Die IBE unterstützt mehrere Sprachen:

- Englisch (Standard)
- Deutsch
- Andere Sprachen wie konfiguriert

Übersetzungszeichenfolgen werden über die Datei `translations.js` verwaltet, mit sprachspezifischen Zuordnungen für alle UI-Elemente.

## Debugging & Wartung

### Debug-Tools

- **StoreDebugger** - Versteckte Komponente zum Anzeigen von Store-Zuständen
- **Konsolenprotokollierung** - Umfassende Protokollierung für Schlüsseloperationen
- **Fehlerbehandlung** - Benutzerfreundliche Fehlermeldungen

### Cache-Verwaltung

Statische Daten (Zimmer, Pakete, Dienstleistungen) werden mit einer konfigurierbaren Ablaufzeit (Standard: 5 Minuten) zwischengespeichert, um die Leistung zu verbessern und gleichzeitig die Datenaktualität zu gewährleisten.

### Überwachung

Kritische Operationen (Zahlungsabwicklung, Buchungserstellung) beinhalten Fehlerbehandlung und Protokollierung, um die Fehlerbehebung zu erleichtern.
