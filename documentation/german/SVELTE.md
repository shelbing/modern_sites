# Svelte-Dokumentation für Hotel Stern

Dieses Dokument bietet einen umfassenden Leitfaden zur Svelte-Einrichtung im Hotel Stern Projekt, einschließlich der Integration mit TypeScript, Muster für das Zustandsmanagement, Komponentenstruktur und Best Practices.

## Inhaltsverzeichnis

1. [Svelte-Integration](#svelte-integration)
   - [Svelte mit TypeScript](#svelte-mit-typescript)
   - [Store-Muster](#store-muster)
   - [Komponentenstruktur](#komponentenstruktur)
   - [Best Practices](#svelte-best-practices)

2. [Zustandsmanagement](#zustandsmanagement)
   - [Svelte Stores](#svelte-stores)
   - [Persistente Speicherung](#persistente-speicherung)
   - [Komponentenübergreifende Kommunikation](#komponentenübergreifende-kommunikation)

3. [UI-Komponenten](#ui-komponenten)
   - [Komponentenorganisation](#komponentenorganisation)
   - [Wiederverwendbare Komponenten](#wiederverwendbare-komponenten)
   - [Integration mit Tailwind](#integration-mit-tailwind)

---

## Svelte-Integration

### Svelte mit TypeScript

Svelte ist konfiguriert, um mit TypeScript über das Paket `@tsconfig/svelte` zu arbeiten. Dies ermöglicht Typenprüfung innerhalb von Svelte-Komponenten.

Für Svelte-Komponenten, die TypeScript verwenden, sollte das Script-Tag das Attribut `lang="ts"` enthalten:

```svelte
<script lang="ts">
  import type { BookingData } from '../types';
  
  export let booking: BookingData;
  // Komponentenlogik...
</script>

<!-- Komponentenvorlage -->
```

### Store-Muster

Das Projekt verwendet Sveltes Store-Muster für das Zustandsmanagement. Die Stores sind in JavaScript-Dateien mit TypeScript-Deklarationen definiert:

```javascript
// src/stores/cartStore.js
import { writable } from 'svelte/store';

function createCartStore() {
    const { subscribe, set, update } = writable({});

    return {
        subscribe,
        set: (value) => {
            // Auch im sessionStorage für Persistenz speichern
            sessionStorage.setItem('cartData', JSON.stringify(value));
            set(value);
        },
        update,
        get: () => {
            // Aus sessionStorage abrufen
            const storedData = sessionStorage.getItem('cartData');
            return storedData ? JSON.parse(storedData) : null;
        },
        reset: () => {
            sessionStorage.removeItem('cartData');
            set({});
        }
    };
}

export const cartStore = createCartStore();
```

Mit entsprechender TypeScript-Deklaration:

```typescript
// src/stores/cartStore.d.ts
import type { Writable } from 'svelte/store';

interface CartData {
  // Typdefinition...
}

interface CartStore extends Writable<CartData> {
  get: () => CartData | null;
  reset: () => void;
}

export const cartStore: CartStore;
```

### Komponentenstruktur

Svelte-Komponenten im Projekt folgen einer einheitlichen Struktur:

1. **Script-Bereich**: Enthält Komponentenlogik, Props und Imports
2. **Vorlagenbereich**: Enthält die HTML-Struktur der Komponente
3. **Style-Bereich**: Enthält komponentenspezifische Stile (wenn nicht nur Tailwind verwendet wird)

Für TypeScript-aktivierte Komponenten:

```svelte
<script lang="ts">
  // Imports
  import { onMount } from 'svelte';
  import type { RoomData } from '../types';
  
  // Props
  export let room: RoomData;
  export let showDetails: boolean = false;
  
  // Lokaler Zustand
  let isLoading = true;
  
  // Lebenszyklus
  onMount(() => {
    // Setup-Code
    isLoading = false;
  });
  
  // Methoden
  function handleClick() {
    showDetails = !showDetails;
  }
</script>

<!-- Vorlage -->
<div class="room-card">
  {#if isLoading}
    <p>Laden...</p>
  {:else}
    <h3>{room.name}</h3>
    <button on:click={handleClick}>
      Details {showDetails ? 'ausblenden' : 'anzeigen'}
    </button>
    
    {#if showDetails}
      <div class="details">
        <p>{room.description}</p>
        <p>Preis: {room.price} {room.currency}</p>
      </div>
    {/if}
  {/if}
</div>

<!-- Stile (wenn nicht nur Tailwind verwendet wird) -->
<style>
  .room-card {
    border: 1px solid #ccc;
    padding: 1rem;
  }
  
  .details {
    margin-top: 1rem;
  }
</style>
```

### Svelte Best Practices

1. **Props-Validierung**: Verwenden Sie TypeScript, um Komponenten-Props zu validieren:
   ```typescript
   export let name: string;
   export let count: number = 0; // Mit Standardwert
   ```

2. **Reaktive Deklarationen**: Verwenden Sie `$:` für reaktive Werte:
   ```typescript
   $: totalPrice = items.reduce((sum, item) => sum + item.price, 0);
   ```

3. **Store-Abonnements**: Verwenden Sie die `$`-Syntax für Store-Werte:
   ```svelte
   <script>
     import { cartStore } from '../stores/cartStore';
   </script>
   
   <div>
     {#if $cartStore.items && $cartStore.items.length > 0}
       <!-- Inhalt -->
     {:else}
       <p>Ihr Warenkorb ist leer</p>
     {/if}
   </div>
   ```

4. **Event-Typisierung**: Typisieren Sie Ihre Event-Handler bei der Arbeit mit DOM-Events:
   ```typescript
   function handleInput(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
     const value = event.currentTarget.value;
     // Wert verarbeiten...
   }
   ```

5. **Slots für Komposition verwenden**: Nutzen Sie Sveltes Slot-System für flexible Komponentenkomposition:
   ```svelte
   <!-- CardComponent.svelte -->
   <div class="card">
     <div class="card-header">
       <slot name="header">Standard-Header</slot>
     </div>
     <div class="card-body">
       <slot>Kein Inhalt bereitgestellt</slot>
     </div>
     <div class="card-footer">
       <slot name="footer"></slot>
     </div>
   </div>
   
   <!-- Verwendung -->
   <CardComponent>
     <h2 slot="header">Mein Kartentitel</h2>
     <p>Dies ist der Karteninhalt</p>
     <div slot="footer">
       <button>Speichern</button>
       <button>Abbrechen</button>
     </div>
   </CardComponent>
   ```

6. **Komponenten-Binding**: Verwenden Sie die `bind:`-Direktive für bidirektionales Binding, wenn angebracht:
   ```svelte
   <script>
     let inputValue = '';
   </script>
   
   <input bind:value={inputValue} />
   <p>Sie haben eingegeben: {inputValue}</p>
   ```

---

## Zustandsmanagement

### Svelte Stores

Das Hotel Stern Projekt verwendet verschiedene Arten von Svelte Stores für unterschiedliche Zwecke:

1. **Writable Stores**: Für Zustände, die von überall aktualisiert werden können:
   ```javascript
   import { writable } from 'svelte/store';
   
   export const count = writable(0);
   
   // Verwendung in einer Komponente
   import { count } from './stores';
   
   function increment() {
     count.update(n => n + 1);
   }
   ```

2. **Readable Stores**: Für Zustände, die nur intern aktualisiert werden können:
   ```javascript
   import { readable } from 'svelte/store';
   
   export const time = readable(new Date(), function start(set) {
     const interval = setInterval(() => {
       set(new Date());
     }, 1000);
     
     return function stop() {
       clearInterval(interval);
     };
   });
   ```

3. **Derived Stores**: Für Zustände, die von anderen Stores abhängen:
   ```javascript
   import { derived } from 'svelte/store';
   import { cartStore } from './cartStore';
   
   export const cartTotal = derived(cartStore, $cart => {
     return $cart.items?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;
   });
   ```

### Persistente Speicherung

Für Zustände, die über Seitenaktualisierungen hinweg bestehen bleiben müssen, erweitert das Projekt Svelte Stores mit Browser-Speicher-APIs:

```javascript
function createPersistentStore(key, initialValue) {
  // Versuchen, gespeicherten Wert aus localStorage zu erhalten
  const storedValue = localStorage.getItem(key);
  const initial = storedValue ? JSON.parse(storedValue) : initialValue;
  
  const store = writable(initial);
  
  // Änderungen abonnieren und localStorage aktualisieren
  store.subscribe(value => {
    localStorage.setItem(key, JSON.stringify(value));
  });
  
  return store;
}

export const userPreferences = createPersistentStore('userPreferences', {
  theme: 'light',
  currency: 'EUR'
});
```

### Komponentenübergreifende Kommunikation

Für die Kommunikation zwischen nicht verwandten Komponenten verwendet das Projekt Sveltes Stores und benutzerdefinierte Events:

1. **Store-basierte Kommunikation**:
   ```javascript
   // messageStore.js
   import { writable } from 'svelte/store';
   
   export const messages = writable([]);
   
   export function addMessage(message) {
     messages.update(msgs => [...msgs, message]);
   }
   ```

2. **Benutzerdefinierte Event-Verteilung**:
   ```svelte
   <!-- ChildComponent.svelte -->
   <script>
     import { createEventDispatcher } from 'svelte';
     
     const dispatch = createEventDispatcher();
     
     function handleAction() {
       dispatch('notification', { 
         message: 'Aktion abgeschlossen',
         type: 'success'
       });
     }
   </script>
   
   <button on:click={handleAction}>Aktion abschließen</button>
   
   <!-- ParentComponent.svelte -->
   <script>
     function handleNotification(event) {
       const { message, type } = event.detail;
       // Benachrichtigung behandeln...
     }
   </script>
   
   <ChildComponent on:notification={handleNotification} />
   ```

---

## UI-Komponenten

### Komponentenorganisation

Komponenten im Hotel Stern Projekt sind nach Funktion und Verantwortung organisiert:

1. **Layout-Komponenten**: 
   - `src/components/Layout/`: Header, Footer, Navigation usw.
   - Verantwortlich für die gesamte Seitenstruktur

2. **Feature-Komponenten**: 
   - `src/components/Booking/`: BookingForm, RoomList usw.
   - Implementieren spezifische Geschäftsfunktionen

3. **UI-Komponenten**: 
   - `src/components/UI/`: Button, Card, Modal usw.
   - Wiederverwendbare UI-Elemente, die in der gesamten Anwendung verwendet werden

4. **Seiten-Komponenten**: 
   - `src/pages/`: Homepage, RoomDetails usw.
   - Entsprechen Routen und setzen andere Komponenten zusammen

### Wiederverwendbare Komponenten

Das Projekt legt Wert auf den Aufbau wiederverwendbarer Komponenten mit klaren APIs:

```svelte
<!-- src/components/UI/Button.svelte -->
<script lang="ts">
  export let type: 'primary' | 'secondary' | 'danger' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let disabled: boolean = false;
  export let fullWidth: boolean = false;
  
  // Klassen basierend auf Props berechnen
  $: classes = [
    // Basisstile
    'inline-flex items-center justify-center rounded-md font-medium',
    // Größenvariationen
    size === 'sm' ? 'px-3 py-2 text-sm' : 
    size === 'md' ? 'px-4 py-2.5 text-base' : 
    'px-6 py-3 text-lg',
    // Typvariationen
    type === 'primary' ? 'bg-primarybutton-light text-primarybuttontext-light dark:bg-primarybutton-dark dark:text-primarybuttontext-dark' :
    type === 'secondary' ? 'bg-secondarybutton-light text-secondarybuttontext-light dark:bg-secondarybutton-dark dark:text-secondarybuttontext-dark' :
    'bg-red-600 text-white dark:bg-red-700',
    // Breite
    fullWidth ? 'w-full' : '',
    // Zustände
    disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
  ].join(' ');
</script>

<button 
  class={classes} 
  disabled={disabled} 
  on:click
  {...$$restProps}
>
  <slot></slot>
</button>
```

### Integration mit Tailwind

Svelte-Komponenten im Projekt werden mit Tailwind CSS gestylt und nutzen die semantischen Farb-Tokens:

```svelte
<div class="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow">
  <h2 class="text-h2 text-text-light dark:text-text-dark">
    <slot name="title">Abschnittstitel</slot>
  </h2>
  <div class="mt-4 text-textSecondary-light dark:text-textSecondary-dark">
    <slot></slot>
  </div>
  <div class="mt-6 flex gap-4">
    <slot name="actions"></slot>
  </div>
</div>
```

Diese Integration stellt ein konsistentes Styling sicher, das die Farb-Tokens und Schriftgrößen des Designsystems respektiert und gleichzeitig komponentenspezifische Variationen ermöglicht.

---

## Fazit

Die Svelte-Implementierung im Hotel Stern Projekt bietet ein flexibles und leistungsstarkes Framework für den Aufbau der Benutzeroberfläche. Durch die Befolgung der in diesem Dokument beschriebenen Muster und Praktiken können Entwickler wartbare, leistungsfähige und typsichere Komponenten erstellen.

Bei Fragen oder Anregungen zur Svelte-Einrichtung wenden Sie sich bitte an das Entwicklungsteam.

---

**Dokumentenversion**: 1.0  
**Zuletzt aktualisiert**: 6. März 2025  
**Autor**: Hotel Stern Entwicklungsteam
