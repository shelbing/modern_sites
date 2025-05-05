<script>
  // Import store for backward compatibility
  import { roomData } from '../../stores/roomStore.js';
  
  // Accept direct props for data
  export let bundleData = "{}";
  export let roomsData = "[]";
  export let servicesData = "[]";
  
  // Parsed data objects
  let parsedBundle = {};
  let parsedRooms = [];
  let parsedServices = [];
  let parsedAvailability = $roomData?.data || [];
  
  // Parse the JSON strings when they change
  $: if (bundleData) {
    try {
      parsedBundle = JSON.parse(bundleData);
      console.log('[DEBUG] Debug component received bundle:', parsedBundle.Title || 'No title');
    } catch (e) {
      console.error("Error parsing bundle data:", e);
      parsedBundle = {};
    }
  }
  
  $: if (roomsData) {
    try {
      parsedRooms = JSON.parse(roomsData);
      console.log('[DEBUG] Debug component received rooms:', parsedRooms.length, 'items');
    } catch (e) {
      console.error("Error parsing rooms data:", e);
      parsedRooms = [];
    }
  }
  
  $: if (servicesData) {
    try {
      parsedServices = JSON.parse(servicesData);
      console.log('[DEBUG] Debug component received services:', parsedServices.length, 'items');
    } catch (e) {
      console.error("Error parsing services data:", e);
      parsedServices = [];
    }
  }
  
  // Toggle sections visibility
  let showAvailability = true;
  let showRooms = true;
  let showServices = true;
  let showBundle = true;
</script>

<div 
  class="availability-raw-debug p-3 rounded border border-gray-200 dark:border-gray-700 text-xs overflow-auto"
  style="background-color: #f8f9fa;">
  <div class="mb-3 pb-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
    <strong class="text-sm">Debug Data (Direct Props)</strong>
    <div class="flex gap-2 text-xs">
      <button type="button" class="px-2 py-1 rounded cursor-pointer" 
            class:bg-blue-100={showAvailability} 
            class:bg-white={!showAvailability}
            on:click={() => showAvailability = !showAvailability}>
        Availability
      </button>
      <button type="button" class="px-2 py-1 rounded cursor-pointer" 
            class:bg-green-100={showRooms} 
            class:bg-white={!showRooms}
            on:click={() => showRooms = !showRooms}>
        Rooms
      </button>
      <button type="button" class="px-2 py-1 rounded cursor-pointer" 
            class:bg-purple-100={showServices} 
            class:bg-white={!showServices}
            on:click={() => showServices = !showServices}>
        Services
      </button>
      <button type="button" class="px-2 py-1 rounded cursor-pointer" 
            class:bg-yellow-100={showBundle} 
            class:bg-white={!showBundle}
            on:click={() => showBundle = !showBundle}>
        Bundle
      </button>
    </div>
  </div>
  
  {#if showAvailability}
    <details open class="mb-2">
      <summary class="cursor-pointer p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
        Availability Data ({$roomData.data?.length || 0} items)
      </summary>
      <div class="mt-1 p-2 bg-white dark:bg-gray-800 rounded-lg overflow-auto max-h-60">
        <pre>{JSON.stringify($roomData.data, null, 2)}</pre>
      </div>
    </details>
  {/if}
  
  {#if showRooms}
    <details open class="mb-2">
      <summary class="cursor-pointer p-2 bg-green-100 dark:bg-green-900 rounded-lg">
        Room Types (Direct Props) ({parsedRooms?.length || 0} items)
      </summary>
      <div class="mt-1 p-2 bg-white dark:bg-gray-800 rounded-lg overflow-auto max-h-60">
        <pre>{JSON.stringify(parsedRooms, null, 2)}</pre>
      </div>
    </details>
  {/if}
  
  {#if showServices}
    <details open class="mb-2">
      <summary class="cursor-pointer p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
        Services (Direct Props) ({parsedServices?.length || 0} items)
      </summary>
      <div class="mt-1 p-2 bg-white dark:bg-gray-800 rounded-lg overflow-auto max-h-60">
        <pre>{JSON.stringify(parsedServices, null, 2)}</pre>
      </div>
    </details>
  {/if}
  
  {#if showBundle}
    <details open class="mb-2">
      <summary class="cursor-pointer p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
        Current Bundle (Direct Props)
      </summary>
      <div class="mt-1 p-2 bg-white dark:bg-gray-800 rounded-lg overflow-auto max-h-60">
        <pre>{JSON.stringify(parsedBundle, null, 2)}</pre>
      </div>
    </details>
  {/if}
</div>

<style>
.availability-raw-debug {
  min-width: 400px;
  max-width: 700px;
}
</style>
