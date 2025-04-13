<script>
    import { onMount } from 'svelte';
    import { bundles, bundlesLoading, bundlesError, bundlesLastUpdated } from '../../stores/bundlesStore';
    import { rooms, roomsLoading, roomsError, roomsLastUpdated } from '../../stores/roomsStore';
    import { services, servicesLoading, servicesError, servicesLastUpdated } from '../../stores/servicesStore';

    export let autoLoad = true;
    export let lang = 'de';
    // Time in milliseconds before data is considered stale (default: 5 minutes)
    export let cacheTime = 5 * 60 * 1000;

    let loading = false;
    let error = null;

    function shouldReload(lastUpdated) {
        if (!lastUpdated) return true;
        
        const now = new Date();
        const lastUpdate = new Date(lastUpdated);
        const timeSinceUpdate = now - lastUpdate;
        
        return timeSinceUpdate > cacheTime;
    }

    async function loadOffers() {
        // Check if any store needs reloading
        const needsBundlesReload = shouldReload($bundlesLastUpdated);
        const needsRoomsReload = shouldReload($roomsLastUpdated);
        const needsServicesReload = shouldReload($servicesLastUpdated);

        // If no reload is needed, return early
        if (!needsBundlesReload && !needsRoomsReload && !needsServicesReload) {
            console.log('All data is fresh, skipping reload');
            return;
        }

        try {
            loading = true;
            error = null;
            
            // Reset errors only for stores being reloaded
            if (needsBundlesReload) bundlesError.set(null);
            if (needsRoomsReload) roomsError.set(null);
            if (needsServicesReload) servicesError.set(null);
            
            // Set loading states only for stores being reloaded
            if (needsBundlesReload) bundlesLoading.set(true);
            if (needsRoomsReload) roomsLoading.set(true);
            if (needsServicesReload) servicesLoading.set(true);

            const response = await fetch(`/api/ibe/allOffers?lang=${lang}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            const timestamp = new Date().toISOString();
            
            // Update only stores that need reloading
            if (needsBundlesReload) {
                bundles.set(data.bundles);
                bundlesLastUpdated.set(timestamp);
                console.log('Bundles reloaded');
            }
            
            if (needsRoomsReload) {
                rooms.set(data.rooms);
                roomsLastUpdated.set(timestamp);
                console.log('Rooms reloaded');
            }
            
            if (needsServicesReload) {
                services.set(data.services);
                servicesLastUpdated.set(timestamp);
                console.log('Services reloaded');
            }

        } catch (err) {
            console.error('Error loading offers:', err);
            error = err.message;
            
            // Set error state only for stores that were being reloaded
            if (needsBundlesReload) bundlesError.set(err.message);
            if (needsRoomsReload) roomsError.set(err.message);
            if (needsServicesReload) servicesError.set(err.message);
            
        } finally {
            loading = false;
            if (needsBundlesReload) bundlesLoading.set(false);
            if (needsRoomsReload) roomsLoading.set(false);
            if (needsServicesReload) servicesLoading.set(false);
        }
    }

    onMount(() => {
        if (autoLoad) {
            loadOffers();
        }
    });
</script>

{#if loading}
    <slot name="loading">
        <div>Loading offers data...</div>
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
