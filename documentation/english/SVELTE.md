# Svelte Documentation for Hotel Stern

This document provides a comprehensive guide to the Svelte setup in the Hotel Stern project, including integration with TypeScript, state management patterns, component structure, and best practices.

## Table of Contents

1. [Svelte Integration](#svelte-integration)
   - [Svelte with TypeScript](#svelte-with-typescript)
   - [Store Pattern](#store-pattern)
   - [Component Structure](#component-structure)
   - [Best Practices](#svelte-best-practices)

2. [State Management](#state-management)
   - [Svelte Stores](#svelte-stores)
   - [Persistent Storage](#persistent-storage)
   - [Cross-Component Communication](#cross-component-communication)

3. [UI Components](#ui-components)
   - [Component Organization](#component-organization)
   - [Reusable Components](#reusable-components)
   - [Integration with Tailwind](#integration-with-tailwind)

---

## Svelte Integration

### Svelte with TypeScript

Svelte is configured to work with TypeScript through the `@tsconfig/svelte` package. This enables type checking within Svelte components.

For Svelte components that use TypeScript, the script tag should include the `lang="ts"` attribute:

```svelte
<script lang="ts">
  import type { BookingData } from '../types';
  
  export let booking: BookingData;
  // Component logic...
</script>

<!-- Component template -->
```

### Store Pattern

The project uses Svelte's store pattern for state management. The stores are defined in JavaScript files with TypeScript declarations:

```javascript
// src/stores/cartStore.js
import { writable } from 'svelte/store';

function createCartStore() {
    const { subscribe, set, update } = writable({});

    return {
        subscribe,
        set: (value) => {
            // Also store in sessionStorage for persistence
            sessionStorage.setItem('cartData', JSON.stringify(value));
            set(value);
        },
        update,
        get: () => {
            // Retrieve from sessionStorage
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

With corresponding TypeScript declaration:

```typescript
// src/stores/cartStore.d.ts
import type { Writable } from 'svelte/store';

interface CartData {
  // Type definition...
}

interface CartStore extends Writable<CartData> {
  get: () => CartData | null;
  reset: () => void;
}

export const cartStore: CartStore;
```

### Component Structure

Svelte components in the project follow a consistent structure:

1. **Script Section**: Contains component logic, props, and imports
2. **Template Section**: Contains the component's HTML structure
3. **Style Section**: Contains component-specific styles (when not using Tailwind only)

For TypeScript-enabled components:

```svelte
<script lang="ts">
  // Imports
  import { onMount } from 'svelte';
  import type { RoomData } from '../types';
  
  // Props
  export let room: RoomData;
  export let showDetails: boolean = false;
  
  // Local state
  let isLoading = true;
  
  // Lifecycle
  onMount(() => {
    // Setup code
    isLoading = false;
  });
  
  // Methods
  function handleClick() {
    showDetails = !showDetails;
  }
</script>

<!-- Template -->
<div class="room-card">
  {#if isLoading}
    <p>Loading...</p>
  {:else}
    <h3>{room.name}</h3>
    <button on:click={handleClick}>
      {showDetails ? 'Hide' : 'Show'} Details
    </button>
    
    {#if showDetails}
      <div class="details">
        <p>{room.description}</p>
        <p>Price: {room.price} {room.currency}</p>
      </div>
    {/if}
  {/if}
</div>

<!-- Styles (if not using Tailwind only) -->
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

1. **Props Validation**: Use TypeScript to validate component props:
   ```typescript
   export let name: string;
   export let count: number = 0; // With default value
   ```

2. **Reactive Declarations**: Use `$:` for reactive values:
   ```typescript
   $: totalPrice = items.reduce((sum, item) => sum + item.price, 0);
   ```

3. **Store Subscriptions**: Use the `$` syntax for store values:
   ```svelte
   <script>
     import { cartStore } from '../stores/cartStore';
   </script>
   
   <div>
     {#if $cartStore.items && $cartStore.items.length > 0}
       <!-- Content -->
     {:else}
       <p>Your cart is empty</p>
     {/if}
   </div>
   ```

4. **Event Typing**: Type your event handlers when working with DOM events:
   ```typescript
   function handleInput(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
     const value = event.currentTarget.value;
     // Process value...
   }
   ```

5. **Use slots for composition**: Leverage Svelte's slot system for flexible component composition:
   ```svelte
   <!-- CardComponent.svelte -->
   <div class="card">
     <div class="card-header">
       <slot name="header">Default Header</slot>
     </div>
     <div class="card-body">
       <slot>No content provided</slot>
     </div>
     <div class="card-footer">
       <slot name="footer"></slot>
     </div>
   </div>
   
   <!-- Usage -->
   <CardComponent>
     <h2 slot="header">My Card Title</h2>
     <p>This is the card content</p>
     <div slot="footer">
       <button>Save</button>
       <button>Cancel</button>
     </div>
   </CardComponent>
   ```

6. **Component binding**: Use the `bind:` directive for two-way binding when appropriate:
   ```svelte
   <script>
     let inputValue = '';
   </script>
   
   <input bind:value={inputValue} />
   <p>You typed: {inputValue}</p>
   ```

---

## State Management

### Svelte Stores

The Hotel Stern project uses different types of Svelte stores for different purposes:

1. **Writable Stores**: For state that can be updated from anywhere:
   ```javascript
   import { writable } from 'svelte/store';
   
   export const count = writable(0);
   
   // Usage in a component
   import { count } from './stores';
   
   function increment() {
     count.update(n => n + 1);
   }
   ```

2. **Readable Stores**: For state that can only be updated internally:
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

3. **Derived Stores**: For state that depends on other stores:
   ```javascript
   import { derived } from 'svelte/store';
   import { cartStore } from './cartStore';
   
   export const cartTotal = derived(cartStore, $cart => {
     return $cart.items?.reduce((total, item) => total + (item.price * item.quantity), 0) || 0;
   });
   ```

### Persistent Storage

For state that needs to persist across page refreshes, the project extends Svelte stores with browser storage APIs:

```javascript
function createPersistentStore(key, initialValue) {
  // Try to get stored value from localStorage
  const storedValue = localStorage.getItem(key);
  const initial = storedValue ? JSON.parse(storedValue) : initialValue;
  
  const store = writable(initial);
  
  // Subscribe to changes and update localStorage
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

### Cross-Component Communication

For communication between unrelated components, the project uses Svelte's stores and custom events:

1. **Store-based Communication**:
   ```javascript
   // messageStore.js
   import { writable } from 'svelte/store';
   
   export const messages = writable([]);
   
   export function addMessage(message) {
     messages.update(msgs => [...msgs, message]);
   }
   ```

2. **Custom Event Dispatching**:
   ```svelte
   <!-- ChildComponent.svelte -->
   <script>
     import { createEventDispatcher } from 'svelte';
     
     const dispatch = createEventDispatcher();
     
     function handleAction() {
       dispatch('notification', { 
         message: 'Action completed',
         type: 'success'
       });
     }
   </script>
   
   <button on:click={handleAction}>Complete Action</button>
   
   <!-- ParentComponent.svelte -->
   <script>
     function handleNotification(event) {
       const { message, type } = event.detail;
       // Handle notification...
     }
   </script>
   
   <ChildComponent on:notification={handleNotification} />
   ```

---

## UI Components

### Component Organization

Components in the Hotel Stern project are organized by feature and responsibility:

1. **Layout Components**: 
   - `src/components/Layout/`: Header, Footer, Navigation, etc.
   - Responsible for the overall page structure

2. **Feature Components**: 
   - `src/components/Booking/`: BookingForm, RoomList, etc.
   - Implement specific business features

3. **UI Components**: 
   - `src/components/UI/`: Button, Card, Modal, etc.
   - Reusable UI elements used across the application

4. **Page Components**: 
   - `src/pages/`: Homepage, RoomDetails, etc.
   - Correspond to routes and compose other components

### Reusable Components

The project emphasizes building reusable components with clear APIs:

```svelte
<!-- src/components/UI/Button.svelte -->
<script lang="ts">
  export let type: 'primary' | 'secondary' | 'danger' = 'primary';
  export let size: 'sm' | 'md' | 'lg' = 'md';
  export let disabled: boolean = false;
  export let fullWidth: boolean = false;
  
  // Compute classes based on props
  $: classes = [
    // Base styles
    'inline-flex items-center justify-center rounded-md font-medium',
    // Size variations
    size === 'sm' ? 'px-3 py-2 text-sm' : 
    size === 'md' ? 'px-4 py-2.5 text-base' : 
    'px-6 py-3 text-lg',
    // Type variations
    type === 'primary' ? 'bg-primarybutton-light text-primarybuttontext-light dark:bg-primarybutton-dark dark:text-primarybuttontext-dark' :
    type === 'secondary' ? 'bg-secondarybutton-light text-secondarybuttontext-light dark:bg-secondarybutton-dark dark:text-secondarybuttontext-dark' :
    'bg-red-600 text-white dark:bg-red-700',
    // Width
    fullWidth ? 'w-full' : '',
    // States
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

### Integration with Tailwind

Svelte components in the project are styled using Tailwind CSS, leveraging the semantic color tokens:

```svelte
<div class="bg-background-light dark:bg-background-dark p-6 rounded-lg shadow">
  <h2 class="text-h2 text-text-light dark:text-text-dark">
    <slot name="title">Section Title</slot>
  </h2>
  <div class="mt-4 text-textSecondary-light dark:text-textSecondary-dark">
    <slot></slot>
  </div>
  <div class="mt-6 flex gap-4">
    <slot name="actions"></slot>
  </div>
</div>
```

This integration ensures consistent styling that respects the design system's color tokens and font sizes while allowing for component-specific variations.

---

## Conclusion

The Svelte implementation in the Hotel Stern project provides a flexible and powerful framework for building the UI. By following the patterns and practices outlined in this document, developers can create maintainable, performant, and type-safe components.

For any questions or suggestions regarding the Svelte setup, please contact the development team.

---

**Document Version**: 1.0  
**Last Updated**: March 6, 2025  
**Author**: Hotel Stern Development Team
