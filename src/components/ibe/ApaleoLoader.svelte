<script>
    import { onMount } from 'svelte';
    import { availability } from '../../stores/availability';
    import { rooms, roomsLoading, roomsError } from '../../stores/roomsStore';
    import { services, servicesLoading, servicesError } from '../../stores/servicesStore';

    export let autoLoad = true;

    let loading = false;
    let error = null;

    async function loadApaleoData() {
        try {
            loading = true;
            error = null;
            
            // Reset all store errors
            roomsError.set(null);
            servicesError.set(null);
            
            // Set loading states
            roomsLoading.set(true);
            servicesLoading.set(true);

            const response = await fetch('/api/ibe/apaleo-data');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Update all stores with the fetched data
            availability.set(data.availability);
            rooms.set(data.rooms);
            services.set(data.services);

        } catch (err) {
            console.error('Error loading Apaleo data:', err);
            error = err.message;
            
            // Set error state in all stores
            roomsError.set(err.message);
            servicesError.set(err.message);
            
        } finally {
            loading = false;
            roomsLoading.set(false);
            servicesLoading.set(false);
        }
    }

    onMount(() => {
        if (autoLoad) {
            loadApaleoData();
        }
    });
</script>

{#if loading}
    <slot name="loading">
        <div>Loading Apaleo data...</div>
    </slot>
{:else if error}
    <slot name="error" {error}>
        <div class="error">Error: {error}</div>
    </slot>
{:else}
    <slot></slot>
{/if}

<style>
    .error {
        color: red;
        font-weight: bold;
    }
</style>
