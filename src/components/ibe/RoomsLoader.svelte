<script>
    import { onMount } from 'svelte';
    import { rooms, roomsLoading, roomsError } from '../../stores/roomsStore';

    export let autoLoad = true;
    export let lang = 'de';

    async function loadRooms() {
        try {
            $roomsLoading = true;
            $roomsError = null;
            
            const response = await fetch(`/api/ibe/allRooms?lang=${lang}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            $rooms = data;
        } catch (error) {
            console.error('Error loading rooms:', error);
            $roomsError = error.message;
        } finally {
            $roomsLoading = false;
        }
    }

    onMount(() => {
        if (autoLoad) {
            loadRooms();
        }
    });
</script>

{#if $roomsLoading}
    <slot name="loading">
        <div>Loading rooms...</div>
    </slot>
{:else if $roomsError}
    <slot name="error" {error}>
        <div class="error">Error: {$roomsError}</div>
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
