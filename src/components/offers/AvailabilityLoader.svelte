<script>
  import { onMount } from 'svelte';
  import { roomData, loadRoomData, setRoomDataLoading, setRoomDataError } from '../../stores/roomStore.js';

  // Props
  export let id;
  export let bundle;
  export let visible = false;

  // State
  let isLoaded = false;
  let globalAvailabilityData = [];

  // Format date for API (YYYY-MM-DD)
  function formatDateForAPI(date) {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  // Check room availability and preload data using the store
  async function checkRoomAvailability() {
    if (!bundle || !bundle.Categories || isLoaded) return;
    
    try {
      console.log(`AvailabilityLoader: Loading data for bundle ${id}`);
      
      // Show loading indicator
      const loadingElement = document.getElementById(`availability-loading-${id}`);
      if (loadingElement) loadingElement.classList.remove('hidden');
      
      // Calculate date range for preloading
      // Start with earliest arrival date
      let startDate = new Date();
      if (bundle.AnreiseVon) {
        startDate = new Date(bundle.AnreiseVon);
      }
      
      // End with latest arrival date + 14 days, but no more than 365 days from now
      let endDate;
      if (bundle.AnreiseBis) {
        endDate = new Date(bundle.AnreiseBis);
        // Add 14 days for typical stay length
        endDate.setDate(endDate.getDate() + 14);
      } else {
        // If no end date specified, use start date + 14 days
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 14);
      }
      
      // Ensure we don't exceed 365 days from now
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 365);
      if (endDate > maxDate) {
        endDate = maxDate;
      }
      
      // Format dates for API
      const formattedStartDate = formatDateForAPI(startDate);
      const formattedEndDate = formatDateForAPI(endDate);
      
      console.log(`Preloading availability data from ${formattedStartDate} to ${formattedEndDate}`);
      
      // Set loading state in the store
      setRoomDataLoading(true);
      
      // Create API URL with properly encoded parameters
      const apiUrl = new URL('/api/ibe/roomsAvailability', window.location.origin);
      
      // Add parameters with proper encoding
      apiUrl.searchParams.set('categories', bundle.Categories);
      apiUrl.searchParams.set('anreiseVon', formattedStartDate);
      apiUrl.searchParams.set('anreiseBis', formattedEndDate);
      
      // Add Basisrate parameter if available
      if (bundle.Basisrate) {
        apiUrl.searchParams.set('ratePlan', bundle.Basisrate);
      }
      
      console.log('API URL with parameters:', apiUrl.toString());
      
      let data = null;
      try {
        const response = await fetch(apiUrl.toString());
        console.log('API response status:', response.status);
        
        data = await response.json();
        console.log('Preloaded room availability data:', data);
        
        // Debug the response data structure
        if (data.success && data.availability) {
          console.log(`Received ${data.availability.length} availability records`);
          if (data.availability.length > 0) {
            console.log('First availability record:', data.availability[0]);
            console.log('Last availability record:', data.availability[data.availability.length - 1]);
            
            // Check date range in the response
            const dates = data.availability.map(item => new Date(item.date));
            const minDate = new Date(Math.min(...dates));
            const maxDate = new Date(Math.max(...dates));
            console.log(`Response date range: ${formatDateForAPI(minDate)} to ${formatDateForAPI(maxDate)}`);
          }
        } else {
          console.warn('API response does not contain availability data:', data);
        }
      } catch (fetchError) {
        console.error('Error fetching data from API:', fetchError);
        data = null;
      }
      
      // Store the preloaded data in the Svelte store
      if (data && data.success && data.availability && data.availability.length > 0) {
        // Load the data into the store
        loadRoomData(data.availability);
        
        // Also store it in our local variable for the current view
        globalAvailabilityData = data.availability;
        isLoaded = true;
        
        // Hide loading indicator
        if (loadingElement) loadingElement.classList.add('hidden');
        
        // Show the available rooms container
        const availableRoomsContainer = document.getElementById(`available-rooms-container-${id}`);
        if (availableRoomsContainer) {
          availableRoomsContainer.classList.remove('hidden');
        }
      } else {
        // Set error in the store
        setRoomDataError('Keine Verfügbarkeitsdaten verfügbar');
        
        // Hide loading indicator and show no data message
        if (loadingElement) {
          loadingElement.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center italic">Keine Verfügbarkeitsdaten verfügbar</p>';
        }
      }
    } catch (error) {
      console.error('Error checking room availability:', error);
      setRoomDataError('Fehler beim Abrufen der Verfügbarkeit');
      
      // Show error message
      const loadingElement = document.getElementById(`availability-loading-${id}`);
      if (loadingElement) {
        loadingElement.innerHTML = '<p class="text-red-500 dark:text-red-400 text-center italic">Fehler beim Abrufen der Verfügbarkeit</p>';
      }
    }
  }
  
  // Watch for changes to the visible prop
  $: if (visible && bundle && !isLoaded) {
    console.log(`AvailabilityLoader: Modal is now visible, loading data`);
    checkRoomAvailability();
  }
  
  // Initialize when component is mounted if already visible
  onMount(() => {
    if (visible && bundle && !isLoaded) {
      console.log(`AvailabilityLoader: Component mounted and already visible, loading data`);
      checkRoomAvailability();
    }
    
    // Listen for bundleModalShown event as a backup
    const handleModalShown = (event) => {
      if (event.detail && event.detail.id === id && !isLoaded) {
        console.log(`AvailabilityLoader: Received bundleModalShown event for ${id}`);
        visible = true; // This will trigger the reactive statement above
      }
    };
    
    document.addEventListener('bundleModalShown', handleModalShown);
    
    return () => {
      document.removeEventListener('bundleModalShown', handleModalShown);
    };
  });
</script>

<!-- This is an invisible component that only handles loading data -->
<div class="hidden">
  <!-- Display debugging information when in development mode -->
  {#if process.env.NODE_ENV === 'development'}
    <pre class="text-xs">
      Bundle ID: {id}
      Visible: {visible}
      Is Loaded: {isLoaded}
      Has Categories: {bundle && bundle.Categories ? 'Yes' : 'No'}
    </pre>
  {/if}
</div>
