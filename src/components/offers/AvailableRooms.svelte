<script>
  import { availability } from "../../stores/availability";
  import { onMount, afterUpdate } from "svelte";
  import { roomData } from "../../stores/roomStore.js";
  import AvailableRoomsList from "./AvailableRoomsList.svelte";

  // Props (just for API compatibility)
  export let arrivalDate = null;
  export let departureDate = null;

  // These props are kept for compatibility with the component API
  // but are no longer used directly since we get data from the store
  export const categoryIds = "";
  export const ratePlan = "";

  // Direct props data for debugging instead of store
  export let bundleData = "{}";
  export let roomsData = "[]";
  export let servicesData = "[]";
  export let showRoomDebug = false;

  // Parsed data objects
  let parsedBundle = {};
  let parsedRooms = [];
  let parsedServices = [];

  // Parse the JSON strings when they change
  $: if (bundleData) {
    try {
      parsedBundle = JSON.parse(bundleData);
    } catch (e) {
      console.error("Error parsing bundle data:", e);
      parsedBundle = {};
    }
  }

  $: if (roomsData) {
    try {
      parsedRooms = JSON.parse(roomsData);
      console.log("[DEBUG] Parsed rooms data:", parsedRooms.length, "items");
    } catch (e) {
      console.error("Error parsing rooms data:", e);
      parsedRooms = [];
    }
  }

  $: if (servicesData) {
    try {
      parsedServices = JSON.parse(servicesData);
      console.log(
        "[DEBUG] Parsed services data:",
        parsedServices.length,
        "items",
      );
    } catch (e) {
      console.error("Error parsing services data:", e);
      parsedServices = [];
    }
  }

  // State
  let availableRooms = [];
  let totalRoomsAvailable = 0;

  // Use store values directly instead of props
  $: storeArrivalDate = $roomData.startDate;
  $: storeDepartureDate = $roomData.endDate;

  // Log changes to store dates for debugging
  $: console.log("Store dates changed:", {
    startDate: storeArrivalDate,
    endDate: storeDepartureDate,
    isStartDateNull: storeArrivalDate === null,
    isEndDateNull: storeDepartureDate === null,
  });

  // Ensure component resets immediately when dates are cleared in store
  $: if (!storeArrivalDate || !storeDepartureDate) {
    console.log("RESET: Clearing room data because dates are missing");
    availableRooms = [];
    totalRoomsAvailable = 0;
  }

  // Subscribe to the room data store
  const unsubscribe = roomData.subscribe((state) => {
    console.log("Room store updated:", state);
    if (state.isLoaded && state.startDate && state.endDate) {
      processRoomData(state.data);
    } else {
      // Clear room data when store dates are missing
      availableRooms = [];
      totalRoomsAvailable = 0;
    }
  });

  // Clean up subscription when component is destroyed
  onMount(() => {
    return () => {
      if (unsubscribe) unsubscribe();
    };
  });

  // Listen for date selection events
  function handleDateSelectionEvents() {
    if (typeof document !== "undefined") {
      document.addEventListener("dateSelection", (event) => {
        const detail = event.detail;
        if (detail.complete && detail.arrival && detail.departure) {
          console.log("AvailableRooms received date selection:", detail);
          arrivalDate = detail.arrival;
          departureDate = detail.departure;
        }
      });
    }
  }

  // Process available rooms when both dates are set
  $: if (arrivalDate && departureDate) {
    // The store will be updated by the BundleModal component
    // We just need to make sure our local props are updated
    console.log(`Date selection changed: ${arrivalDate} to ${departureDate}`);
  }

  // Format date for API (YYYY-MM-DD)
  function formatDateForAPI(date) {
    const d = new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  // Format price for display
  function formatPrice(price) {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
    }).format(price);
  }

  // Calculate total nights
  function calculateNights(arrival, departure) {
    const arrivalDate = new Date(arrival);
    const departureDate = new Date(departure);
    const diffTime = Math.abs(departureDate - arrivalDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  // Helper function to safely format dates with error handling
  function formatDateSafely(dateString) {
    try {
      return new Date(dateString).toLocaleDateString("de-DE", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Invalid Date";
    }
  }

  // Helper function to get filtered room data for display in debug section
  function getFilteredRoomData(data, startDate, endDate) {
    if (!startDate || !endDate || !data || data.length === 0) {
      return [];
    }

    const startTime = new Date(startDate).getTime();
    const endTime = new Date(endDate).getTime();

    return data.filter((item) => {
      const itemDate = new Date(item.date).getTime();
      return itemDate >= startTime && itemDate <= endTime;
    });
  }

  // Helper function to get room types with continuous availability
  function getContinuouslyAvailableRoomTypes(data) {
    // First, we need to track which dates we have in our data range
    // Excluding the departure date
    if (!storeArrivalDate || !storeDepartureDate) {
      return [];
    }

    // Create a set of dates within our range (excluding departure date)
    const requiredDates = new Set();
    const start = new Date(arrivalDate);
    const end = new Date(departureDate);

    // Get all dates from arrival to day before departure
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      requiredDates.add(formatDateForAPI(d));
    }

    // Create a map to track which room types are available on which dates
    const availabilityByRoomType = {};

    // Process each date's data
    data.forEach((item) => {
      // Skip invalid data
      if (
        !item ||
        !item.date ||
        !item.unitGroups ||
        !Array.isArray(item.unitGroups)
      ) {
        return;
      }

      // Only process dates in our required range
      if (!requiredDates.has(item.date)) {
        return;
      }

      // Process each unit group
      item.unitGroups.forEach((unit) => {
        const code = unit.code;
        if (!code) return;

        // Initialize tracking if needed
        if (!availabilityByRoomType[code]) {
          availabilityByRoomType[code] = {
            availableDates: new Set(),
          };
        }

        // Add this date to room type's available dates if it has rooms
        if (unit.sellableCount > 0) {
          availabilityByRoomType[code].availableDates.add(item.date);
        }
      });
    });

    // Filter to only include room types available on all required dates
    const continuouslyAvailableRoomTypes = [];

    Object.entries(availabilityByRoomType).forEach(([code, info]) => {
      const hasAllDates =
        requiredDates.size === info.availableDates.size &&
        [...requiredDates].every((date) => info.availableDates.has(date));

      if (hasAllDates) {
        continuouslyAvailableRoomTypes.push(code);
      }
    });

    return continuouslyAvailableRoomTypes;
  }

  // Group room data by date for better display
  function groupRoomDataByDate(data) {
    // Create a map to group by date
    const dateMap = {};

    // Group all entries by date
    data.forEach((item) => {
      // Skip items without valid date
      if (!item || !item.date) return;

      if (!dateMap[item.date]) {
        dateMap[item.date] = {
          date: item.date,
          propertyId: item.propertyId || "Unknown",
          totalSellableCount: item.totalSellableCount || 0,
          unitGroups: [],
        };
      }

      // If item has unitGroups array, add it to the date entry
      if (item.unitGroups && Array.isArray(item.unitGroups)) {
        dateMap[item.date].unitGroups = item.unitGroups.map((unit) => ({
          code: unit.code || "Unknown",
          sellableCount:
            typeof unit.sellableCount === "number" ? unit.sellableCount : 0,
        }));
      }
    });

    // Sort by date and return as array
    return Object.values(dateMap).sort((a, b) => {
      return new Date(a.date) - new Date(b.date);
    });
  }

  // Process room data from the store
  function processRoomData(data) {
    if (!arrivalDate || !departureDate || !data || data.length === 0) {
      availableRooms = [];
      totalRoomsAvailable = 0;
      return;
    }

    console.log(
      "Processing room data from store for date range:",
      arrivalDate,
      departureDate,
    );

    try {
      // Filter data for the selected date range using the helper function
      const filteredData = getFilteredRoomData(
        data,
        arrivalDate,
        departureDate,
      );

      // Process the filtered data
      if (filteredData.length > 0) {
        availableRooms = processAvailabilityData(filteredData);

        // Calculate total rooms using the totalSellableCount if available, or sum unitGroups
        totalRoomsAvailable = filteredData.reduce((total, item) => {
          if (typeof item.totalSellableCount === "number") {
            return total + item.totalSellableCount;
          } else if (item.unitGroups && Array.isArray(item.unitGroups)) {
            return (
              total +
              item.unitGroups.reduce(
                (sum, unit) => sum + (unit.sellableCount || 0),
                0,
              )
            );
          }
          return total;
        }, 0);
      } else {
        availableRooms = [];
        totalRoomsAvailable = 0;
      }
    } catch (err) {
      console.error("Error processing room data:", err);
      availableRooms = [];
      totalRoomsAvailable = 0;
    }
  }

  // Process the availability data into a more usable format
  function processAvailabilityData(data) {
    // First, we need to track which dates we have in our data range
    // Excluding the departure date
    if (!arrivalDate || !departureDate) {
      return [];
    }

    // Create a set of dates within our range (excluding departure date)
    const requiredDates = new Set();
    const start = new Date(arrivalDate);
    const end = new Date(departureDate);

    // Get all dates from arrival to day before departure
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      requiredDates.add(formatDateForAPI(d));
    }

    console.log(
      `Created ${requiredDates.size} required dates from ${arrivalDate} to ${departureDate} (excluding departure)`,
    );

    // Create a map to track which categories are available on which dates
    const availabilityByCategory = {};

    // Process each date's data
    data.forEach((item) => {
      // Skip invalid data
      if (
        !item ||
        !item.date ||
        !item.unitGroups ||
        !Array.isArray(item.unitGroups)
      ) {
        return;
      }

      // Only process dates in our required range
      if (!requiredDates.has(item.date)) {
        return;
      }

      // Process each unit group
      item.unitGroups.forEach((unit) => {
        const code = unit.code;
        if (!code) return;

        // Initialize category tracking if needed
        if (!availabilityByCategory[code]) {
          availabilityByCategory[code] = {
            id: code,
            name: code, // Use code as name if no other info available
            description: "",
            image: "/images/searchimage.png",
            price: 0, // We don't have price info in this data format
            availableCount: 0,
            amenities: [],
            // Track which dates this category is available on
            availableDates: new Set(),
            // Store availability by date for debugging
            availabilityByDate: {},
          };
        }

        // Add this date to the category's available dates if it has rooms
        if (unit.sellableCount > 0) {
          availabilityByCategory[code].availableDates.add(item.date);
          // Track sellable count by date for debugging
          availabilityByCategory[code].availabilityByDate[item.date] =
            unit.sellableCount;
        }

        // Sum the total available count across dates
        availabilityByCategory[code].availableCount += unit.sellableCount || 0;
      });
    });

    // Filter to only include categories available on all required dates
    const continuouslyAvailableRooms = Object.values(
      availabilityByCategory,
    ).filter((category) => {
      const hasAllDates =
        requiredDates.size === category.availableDates.size &&
        [...requiredDates].every((date) => category.availableDates.has(date));

      if (hasAllDates) {
        console.log(
          `${category.id} is available on all ${requiredDates.size} required dates`,
        );
      } else {
        console.log(
          `${category.id} is NOT available on all dates (available on ${category.availableDates.size}/${requiredDates.size})`,
        );
      }

      return hasAllDates;
    });

    console.log(
      `Found ${continuouslyAvailableRooms.length} categories with continuous availability`,
    );

    // Sort by availability (most available first)
    return continuouslyAvailableRooms.sort(
      (a, b) => b.availableCount - a.availableCount,
    );
  }

  onMount(() => {
    handleDateSelectionEvents();
  });
</script>

<div class="available-rooms-container">
  <div class="mb-4 p-2 rounded text-xs">
    {#if storeArrivalDate && storeDepartureDate}
      {#if $roomData.data && $roomData.data.length > 0}
        <!-- Get filtered data once for all operations -->
        {@const filteredData = getFilteredRoomData(
          $roomData.data,
          storeArrivalDate,
          storeDepartureDate,
        )}

        {#if filteredData.length === 0}
          <div class="mt-3">
            <strong>Room Availability:</strong>
            <p class="text-gray-500 italic p-2">
              No room data available for selected dates.
            </p>
          </div>
        {:else}
          <!-- Get continuous availability data -->
          {@const continuousRoomTypes =
            getContinuouslyAvailableRoomTypes(filteredData)}

          <div class="">
            <!-- Use the new component for room list display -->
            <AvailableRoomsList
              {continuousRoomTypes}
              {filteredData}
              {groupRoomDataByDate}
              bundle={parsedBundle}
              rooms={parsedRooms}
              services={parsedServices}
              {showRoomDebug}
            />
          </div>
        {/if}
      {/if}
    {:else if storeArrivalDate || storeDepartureDate}
      <div class="mt-3">
        <p class="text-gray-500 italic p-2">
          Bitte wählen Sie zuerst Anreise- und Abreisedatum, um verfügbare
          Zimmer zu sehen.
        </p>
      </div>
    {/if}
  </div>

  {#if $roomData.isLoading}
    <div class="py-4 flex justify-center">
      <div
        class="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 dark:border-white"
      ></div>
    </div>
  {/if}
</div>

<style>
  .available-rooms-container {
    margin-top: 1.5rem;
  }

  .room-card {
    transition:
      transform 0.2s ease-in-out,
      box-shadow 0.2s ease-in-out;
  }

  .room-card:hover {
    transform: translateY(-2px);
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.1),
      0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
</style>
