<script>
    import { onMount } from 'svelte';
    import { availability, availabilityLastUpdated } from '../../stores/availability';

    export let autoLoad = true;
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

    async function loadAvailability() {
        // Check if reload is needed
        if (!shouldReload($availabilityLastUpdated)) {
            console.log('Availability data is fresh, skipping reload');
            return;
        }

        try {
            loading = true;
            error = null;

            const response = await fetch('/api/ibe/unit-groups-availability');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            availability.set(data);
            availabilityLastUpdated.set(new Date().toISOString());
            console.log('Availability reloaded');

        } catch (err) {
            console.error('Error loading availability:', err);
            error = err.message;
        } finally {
            loading = false;
        }
    }

    onMount(() => {
        if (autoLoad) {
            loadAvailability();
        }
    });
</script>

{#if loading}
    <slot name="loading">
        <!-- <div>Loading availability data...</div> -->
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
