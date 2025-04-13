<script>
    import { onMount } from 'svelte';
    import { services, servicesLoading, servicesError } from '../../stores/servicesStore';

    export let autoLoad = true;
    export let lang = 'de';

    async function loadServices() {
        try {
            $servicesLoading = true;
            $servicesError = null;
            
            const response = await fetch(`/api/ibe/allServices?lang=${lang}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            $services = data;
        } catch (error) {
            console.error('Error loading services:', error);
            $servicesError = error.message;
        } finally {
            $servicesLoading = false;
        }
    }

    onMount(() => {
        if (autoLoad) {
            loadServices();
        }
    });
</script>

{#if $servicesLoading}
    <slot name="loading">
        <div>Loading services...</div>
    </slot>
{:else if $servicesError}
    <slot name="error" {error}>
        <div class="error">Error: {$servicesError}</div>
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
