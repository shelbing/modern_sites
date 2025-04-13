<script>
  import { onMount } from "svelte";
  import { get } from "svelte/store";
  import { formData } from "../../stores/formStore";
  import { offersData, isLoading, error, offersLastUpdated } from "../../stores/offersStore";
  import { bookingStep } from "../../stores/bookingStore";
  import { rooms, roomsLoading, roomsError, roomsLastUpdated } from "../../stores/roomsStore";
  import { services, servicesLoading, servicesError, servicesLastUpdated } from "../../stores/servicesStore";
  import { bundles, bundlesLoading, bundlesError, bundlesLastUpdated } from "../../stores/bundlesStore";
  import { availabilityStore } from "../../stores/availabilityStore";
  import Spinner from "./Spinner.svelte";
  import { formTranslations } from "../../lib/translations";

  export let language;
  export let hotelCode;

  // Use English as fallback if language is not supported
  $: t = formTranslations[language] || formTranslations.en;

  // Time in milliseconds before data is considered stale (default: 5 minutes)
  const cacheTime = 5 * 60 * 1000;

  function shouldReload(lastUpdated) {
    if (!lastUpdated) return true;
    const now = new Date();
    const lastUpdate = new Date(lastUpdated);
    const timeSinceUpdate = now - lastUpdate;
    return timeSinceUpdate > cacheTime;
  }

  async function ensureStaticDataLoaded() {
    const needsBundlesReload = shouldReload($bundlesLastUpdated);
    const needsRoomsReload = shouldReload($roomsLastUpdated);
    const needsServicesReload = shouldReload($servicesLastUpdated);

    if (needsBundlesReload || needsRoomsReload || needsServicesReload) {
      const response = await fetch(`/api/ibe/allOffers?lang=${language}`);
      if (!response.ok) {
        throw new Error(`Failed to load static data: ${response.statusText}`);
      }
      const data = await response.json();
      const timestamp = new Date().toISOString();

      if (needsBundlesReload) {
        bundles.set(data.bundles);
        bundlesLastUpdated.set(timestamp);
      }
      if (needsRoomsReload) {
        rooms.set(data.rooms);
        roomsLastUpdated.set(timestamp);
      }
      if (needsServicesReload) {
        services.set(data.services);
        servicesLastUpdated.set(timestamp);
      }
    }
  }

  function combineData(apaleoData, formData) {
    // Get current store values
    const bundlesData = get(bundles);
    const roomsData = get(rooms);
    const servicesData = get(services);

    // Create a deep copy of bundles data
    let combinedBundles = JSON.parse(JSON.stringify(bundlesData));

    // For each bundle in bundlesData
    for (let bundle of combinedBundles) {
      // Initialize an array to hold matching offers
      bundle.offers = [];

      // Split and trim categories
      let categories = bundle.Categories.split(",").map((c) => c.trim());

      // Find matching offers
      for (let offer of apaleoData.offers) {
        if (categories.includes(offer.unitGroup.code) && bundle.Basisrate === offer.ratePlan.code) {
          // Add room information to the offer
          const room = roomsData.find((room) => room.RoomCode === offer.unitGroup.code);
          offer.room = room || null;
          bundle.offers.push(offer);
        }
      }

      // Calculate prices for each offer
      if (bundle.offers && bundle.offers.length > 0) {
        let cheapestOffer = null;
        let cheapestPrice = Infinity;

        for (let offer of bundle.offers) {
          if (offer.timeSlices && offer.timeSlices.length > 0) {
            let baseGrossAmount = 0;
            let baseNetAmount = 0;
            let servicesGrossAmount = 0;
            let servicesNetAmount = 0;

            for (let timeSlice of offer.timeSlices) {
              // Add base amount
              baseGrossAmount += timeSlice.baseAmount.grossAmount;
              baseNetAmount += timeSlice.baseAmount.netAmount;

              // Add included services
              if (timeSlice.includedServices) {
                for (let service of timeSlice.includedServices) {
                  servicesGrossAmount += service.amount.grossAmount;
                  servicesNetAmount += service.amount.netAmount;
                }
              }
            }

            // Calculate total amounts
            let totalGrossAmount = baseGrossAmount + servicesGrossAmount;
            let totalNetAmount = baseNetAmount + servicesNetAmount;

            // Add amounts to the offer
            offer.calculatedAmounts = {
              base: {
                gross: bundle.PreisanpassungProzent ? baseGrossAmount * (1 + bundle.PreisanpassungProzent / 100) : baseGrossAmount,
                net: bundle.PreisanpassungProzent ? baseNetAmount * (1 + bundle.PreisanpassungProzent / 100) : baseNetAmount
              },
              services: {
                gross: bundle.PreisanpassungProzent ? servicesGrossAmount * (1 + bundle.PreisanpassungProzent / 100) : servicesGrossAmount,
                net: bundle.PreisanpassungProzent ? servicesNetAmount * (1 + bundle.PreisanpassungProzent / 100) : servicesNetAmount
              },
              total: {
                gross: bundle.PreisanpassungProzent ? totalGrossAmount * (1 + bundle.PreisanpassungProzent / 100) : totalGrossAmount,
                net: bundle.PreisanpassungProzent ? totalNetAmount * (1 + bundle.PreisanpassungProzent / 100) : totalNetAmount
              },
              Anzahlung: {
                gross: bundle.AnzahlungProzent ? (bundle.PreisanpassungProzent ? totalGrossAmount * (1 + bundle.PreisanpassungProzent / 100) : totalGrossAmount) * (bundle.AnzahlungProzent / 100) : 0,
                net: bundle.AnzahlungProzent ? (bundle.PreisanpassungProzent ? totalNetAmount * (1 + bundle.PreisanpassungProzent / 100) : totalNetAmount) * (bundle.AnzahlungProzent / 100) : 0
              }
            };

            // Check if this offer is the cheapest
            if (offer.calculatedAmounts.total.gross < cheapestPrice) {
              cheapestPrice = offer.calculatedAmounts.total.gross;
              cheapestOffer = offer;
            }
          }
        }

        // Add the cheapest offer to the bundle
        if (cheapestOffer) {
          bundle.cheapestOffer = cheapestOffer.calculatedAmounts.total.gross;
        }
      }
    }

    // Filter bundles based on various criteria
    combinedBundles = combinedBundles.filter(bundle => {
      // Must have at least one offer
      if (!bundle.offers || bundle.offers.length === 0) return false;

      // Must be activated
      if (!bundle.Aktiviert) return false;

      // Check advance booking
      if (bundle.Vorausbuchung) {
        const advanceBookingDays = parseInt(bundle.Vorausbuchung, 10);
        if (!isNaN(advanceBookingDays)) {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const arrivalDate = new Date(formData.startDate);
          const minBookingDate = new Date(today);
          minBookingDate.setDate(minBookingDate.getDate() + advanceBookingDays);
          if (arrivalDate < minBookingDate) return false;
        }
      }

      // Check stay duration
      const arrivalDate = new Date(formData.startDate);
      const departureDate = new Date(formData.endDate);
      const stayDuration = Math.ceil((departureDate - arrivalDate) / (1000 * 60 * 60 * 24));
      
      const minStay = bundle.Mindestaufenthalt ? parseInt(bundle.Mindestaufenthalt, 10) : 0;
      const maxStay = bundle.Hoechstaufenthalt ? parseInt(bundle.Hoechstaufenthalt, 10) : Infinity;
      if (stayDuration < minStay || stayDuration > maxStay) return false;

      // Check arrival window
      if (bundle.AnreiseVon || bundle.AnreiseBis) {
        const earliestArrival = bundle.AnreiseVon ? new Date(bundle.AnreiseVon) : null;
        const latestArrival = bundle.AnreiseBis ? new Date(bundle.AnreiseBis) : null;
        
        if (earliestArrival && arrivalDate < earliestArrival) return false;
        if (latestArrival && arrivalDate > latestArrival) return false;
      }

      // Check booking window
      if (bundle.BuchenVon || bundle.BuchenBis) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const earliestBooking = bundle.BuchenVon ? new Date(bundle.BuchenVon) : null;
        const latestBooking = bundle.BuchenBis ? new Date(bundle.BuchenBis) : null;
        
        if (earliestBooking && today < earliestBooking) return false;
        if (latestBooking && today > latestBooking) return false;
      }

      return true;
    });

    // Return the data in the expected structure
    return {
      Bundles: combinedBundles,
      rooms: roomsData,
      services: servicesData
    };
  }

  // Handle form submission
  async function handleSubmit(event) {
    event.preventDefault();
    error.set(null);
    isLoading.set(true);

    await ensureStaticDataLoaded();

    const { startDate, endDate, adults, childrenAges } = get(formData);

    try {
      // Fetch offers
      const offersResponse = await fetch(
        `/api/ibe/get_offers?start=${startDate}&end=${endDate}&adults=${adults}&hotel=${hotelCode}&lang=${language}&childrenAges=${childrenAges || ''}`
      );

      if (!offersResponse.ok) {
        throw new Error(`Failed to fetch offers: ${offersResponse.statusText}`);
      }

      const offersResult = await offersResponse.json();

      // Fetch availability data for the next 7 days starting from the search start date
      const availabilityResponse = await fetch(
        `/api/ibe/availability?start=${startDate}&days=7&hotel=${hotelCode}`
      );

      if (availabilityResponse.ok) {
        const availabilityData = await availabilityResponse.json();
        availabilityStore.set(availabilityData);
      }

      // Combine the data
      const combinedData = combineData(offersResult, get(formData));
      offersData.set(combinedData);
      offersLastUpdated.set(new Date().toISOString());
      console.log("Combined offers data:", combinedData);
    } catch (err) {
      error.set(err.message);
      availabilityStore.set([]); // Clear availability on error
    } finally {
      isLoading.set(false);
    }
  }

  // Set default dates
  onMount(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const threeDaysLater = new Date(tomorrow);
    threeDaysLater.setDate(tomorrow.getDate() + 3);

    // Format dates as YYYY-MM-DD
    formData.update((fd) => ({
      ...fd,
      startDate: tomorrow.toISOString().split("T")[0],
      endDate: threeDaysLater.toISOString().split("T")[0],
    }));

    // Update lengthOfStay
    updateLengthOfStay();
  });

  // Function to update lengthOfStay
  function updateLengthOfStay() {
    formData.update((fd) => {
      const start = new Date(fd.startDate);
      const end = new Date(fd.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { ...fd, lengthOfStay: diffDays };
    });
  }

  // Reactive statement to manage childrenAges array
  $: {
    const count = parseInt($formData.childrenCount) || 0;
    if ($formData.childrenAges.length !== count) {
      $formData.childrenAges = $formData.childrenAges.slice(0, count);
      while ($formData.childrenAges.length < count) {
        $formData.childrenAges.push("");
      }
    }
  }

  // Reactive statement to update lengthOfStay when dates change
  $: {
    if ($formData.startDate && $formData.endDate) {
      updateLengthOfStay();
    }
  }
</script>

<form
  on:submit|preventDefault={handleSubmit}
  class="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-lg shadow-md"
>
  <!-- Date and guest selection -->
  <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <!-- Check-in date -->
    <div class="form-control">
      <label for="startDate" class="label">
        <span class="label-text text-gray-700 dark:text-gray-200">{t.checkIn}</span>
      </label>
      <input
        type="date"
        id="startDate"
        bind:value={$formData.startDate}
        min={new Date().toISOString().split("T")[0]}
        required
        class="input input-bordered w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
      />
    </div>

    <!-- Check-out date -->
    <div class="form-control">
      <label for="endDate" class="label">
        <span class="label-text text-gray-700 dark:text-gray-200">{t.checkOut}</span>
      </label>
      <input
        type="date"
        id="endDate"
        bind:value={$formData.endDate}
        min={$formData.startDate}
        required
        class="input input-bordered w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
      />
    </div>

    <!-- Adults -->
    <div class="form-control">
      <label for="adults" class="label">
        <span class="label-text text-gray-700 dark:text-gray-200">{t.adults}</span>
      </label>
      <input
        type="number"
        id="adults"
        bind:value={$formData.adults}
        min="1"
        max="10"
        required
        class="input input-bordered w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
      />
    </div>

    <!-- Children -->
    <div class="form-control">
      <label for="childrenCount" class="label">
        <span class="label-text text-gray-700 dark:text-gray-200">{t.children}</span>
      </label>
      <input
        type="number"
        id="childrenCount"
        bind:value={$formData.childrenCount}
        min="0"
        max="4"
        class="input input-bordered w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
      />
    </div>
  </div>

  <!-- Children ages (only shown if children > 0) -->
  {#if $formData.childrenCount > 0}
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {#each Array($formData.childrenCount) as _, i}
        <div class="form-control">
          <label for="childAge{i}" class="label">
            <span class="label-text text-gray-700 dark:text-gray-200">{t.childAge} {i + 1}</span>
          </label>
          <input
            type="number"
            id="childAge{i}"
            bind:value={$formData.childrenAges[i]}
            min="0"
            max="17"
            required
            class="input input-bordered w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
        </div>
      {/each}
    </div>
  {/if}

  <!-- Search button and loading state -->
  <div class="mt-6">
    <button
      type="submit"
      class="glass-button w-full font-bold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-[0.98]"
      disabled={$isLoading}
    >
      {#if $isLoading}
        <Spinner {language} />
        <span class="text-current">{t.searching}</span>
      {:else}
        <span class="text-current">{t.search}</span>
      {/if}
    </button>
  </div>

  {#if $error}
    <div class="mt-4 text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
      {$error}
    </div>
  {/if}
</form>

{#if $isLoading}
  <div class="mt-8 flex justify-center">
    <Spinner {language} />
  </div>
{:else if $error}
  <div class="mt-4 text-red-600 dark:text-red-400 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
    {$error}
  </div>
{/if}

<style>
    .glass-button {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.1));
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.1);
        color: var(--text-color);
    }

    .glass-button:hover {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.2));
        border-color: rgba(255, 255, 255, 0.4);
        box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
    }

    .glass-button:active {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.1));
        box-shadow: 0 4px 16px 0 rgba(31, 38, 135, 0.1);
    }

    :global(.dark) .glass-button {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05));
        border-color: rgba(255, 255, 255, 0.1);
        --text-color: #ffffff;
    }

    :global(.dark) .glass-button:hover {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1));
        border-color: rgba(255, 255, 255, 0.2);
    }

    :global(.dark) .glass-button:active {
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
    }

    /* Default light mode text color */
    :root {
        --text-color: #1a1a1a;
    }
</style>
