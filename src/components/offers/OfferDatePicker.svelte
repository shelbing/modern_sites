<script>
  import { onMount, createEventDispatcher } from "svelte";
  import {
    setStartDate,
    setEndDate,
    roomData,
  } from "../../stores/roomStore.js";
  console.log("[DEBUG-SVELTE] OfferDatePicker component script starting");

  // Keep local state in sync with the store
  $: if ($roomData) {
    if ($roomData.startDate !== arrival) arrival = $roomData.startDate;
    if ($roomData.endDate !== departure) departure = $roomData.endDate;
  }

  /**
   * Props:
   *  - minArrival      : earliest allowed arrival date
   *  - maxArrival      : latest allowed arrival date (only used for arrival restriction)
   *  - minStay         : minimum number of nights to stay
   *  - fullyBookedDays : array of Date (or date strings) that are fully booked
   */
  export let minArrival = new Date();
  export let maxArrival = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000); // default: 60 days from now
  export let minStay = 3;
  export let fullyBookedDays = []; // array of Date objects or date-strings

  console.log("[DEBUG-SVELTE] OfferDatePicker props received:", {
    minArrival,
    maxArrival,
    minStay,
    fullyBookedDays: Array.isArray(fullyBookedDays)
      ? fullyBookedDays.length
      : "not an array",
  });

  // Current selection
  let arrival = null;
  let departure = null;

  // Our calendar days (each: { date, isDisabled, isFullyBooked })
  let calendarDays = [];

  const dispatch = createEventDispatcher();

  // Convert any strings in `fullyBookedDays` to actual Date objects (stripping time)
  let normalizedFullyBooked = [];
  $: {
    try {
      console.log(
        "[DEBUG-SVELTE] Processing fullyBookedDays:",
        fullyBookedDays,
      );
      if (Array.isArray(fullyBookedDays)) {
        normalizedFullyBooked = fullyBookedDays
          .map((d) => {
            try {
              return stripTime(typeof d === "string" ? new Date(d) : d);
            } catch (e) {
              console.error(
                "[DEBUG-SVELTE] Error processing fully booked day:",
                d,
                e,
              );
              return null;
            }
          })
          .filter((d) => d !== null);
      } else {
        console.warn(
          "[DEBUG-SVELTE] fullyBookedDays is not an array:",
          fullyBookedDays,
        );
        normalizedFullyBooked = [];
      }
      console.log(
        "[DEBUG-SVELTE] Normalized fully booked days:",
        normalizedFullyBooked,
      );
    } catch (e) {
      console.error("[DEBUG-SVELTE] Error in reactive statement:", e);
      normalizedFullyBooked = [];
    }
  }

  // Current view month/year
  let currentViewMonth = new Date().getMonth();
  let currentViewYear = new Date().getFullYear();

  // Initialize to the month containing minArrival
  $: {
    if (minArrival) {
      currentViewMonth = minArrival.getMonth();
      currentViewYear = minArrival.getFullYear();
    }
  }

  // Generate the calendar for the current view month only
  function generateCalendar() {
    // Log current constraints for debugging
    console.log(
      "[DEBUG-SVELTE] Generating calendar for",
      currentViewMonth,
      currentViewYear,
      "with minArrival:",
      minArrival.toISOString(),
      "maxArrival:",
      maxArrival.toISOString(),
    );

    // Clear the calendar
    calendarDays = [];

    // Get first day of the month
    const firstDayOfMonth = new Date(currentViewYear, currentViewMonth, 1);

    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    let firstDayWeekday = firstDayOfMonth.getDay();
    // Adjust for Monday as first day of week (0 = Monday, 6 = Sunday)
    firstDayWeekday = firstDayWeekday === 0 ? 6 : firstDayWeekday - 1;

    // Get last day of the month
    const lastDayOfMonth = new Date(currentViewYear, currentViewMonth + 1, 0);

    // Add days from previous month to fill the first week
    const prevMonthLastDay = new Date(
      currentViewYear,
      currentViewMonth,
      0,
    ).getDate();
    for (let i = firstDayWeekday - 1; i >= 0; i--) {
      const date = new Date(
        currentViewYear,
        currentViewMonth - 1,
        prevMonthLastDay - i,
      );
      calendarDays.push({
        date,
        isDisabled: true, // Previous month days are always disabled
        isFullyBooked: false,
        isPrevMonth: true,
      });
    }

    // Add days of the current month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(currentViewYear, currentViewMonth, day);

      // Check if this day is disabled for arrival
      const isDisabledForArrival = isDisabledArrivalDay(date);

      // Check if this day is fully booked
      const isFullyBooked = dateIsInFullyBooked(date);

      // Ensure date is properly formatted for comparison
      const dateTime = stripTime(date).getTime();
      const minArrivalTime = stripTime(minArrival).getTime();
      const maxArrivalTime = stripTime(maxArrival).getTime();

      // Check if this day is available as a departure date
      // (only relevant if an arrival date has been selected)
      const isAvailableForDeparture = arrival && isDepartureAvailable(date);

      // Check if this day is disabled due to minimum stay requirement
      // For any day that's not a valid departure date after arrival is selected
      const isMinStayDisabled =
        arrival &&
        !isSameDay(date, arrival) &&
        (!isAvailableForDeparture || dateTime <= stripTime(arrival).getTime());

      // Debug date comparison for December 15th
      if (date.getDate() === 15 && date.getMonth() === 11) {
        console.log("[DEBUG-SVELTE] Checking Dec 15:", {
          dateTime,
          minArrivalTime,
          maxArrivalTime,
          isWithinRange:
            dateTime >= minArrivalTime && dateTime <= maxArrivalTime,
          isFullyBooked,
        });
      }

      // Check if this day is available for arrival - simplified to just check if within range and not fully booked
      const isAvailableForArrival =
        dateTime >= minArrivalTime &&
        dateTime <= maxArrivalTime &&
        !isFullyBooked;

      calendarDays.push({
        date,
        isDisabled: arrival ? !isAvailableForDeparture : isDisabledForArrival,
        isFullyBooked,
        isCurrentMonth: true,
        isAvailableForDeparture,
        isAvailableForArrival,
        isMinStayDisabled,
      });
    }

    // Calculate how many days we need to add from next month
    // We want to complete the row for the last week
    const lastDayWeekday = lastDayOfMonth.getDay();
    // Adjust for Monday as first day of week
    const adjustedLastDayWeekday =
      lastDayWeekday === 0 ? 6 : lastDayWeekday - 1;
    const daysToAdd = 6 - adjustedLastDayWeekday;

    // Add days from next month
    for (let day = 1; day <= daysToAdd; day++) {
      const date = new Date(currentViewYear, currentViewMonth + 1, day);
      calendarDays.push({
        date,
        isDisabled: true, // Next month days are always disabled
        isFullyBooked: false,
        isNextMonth: true,
      });
    }
  }

  // Navigate to previous month
  function prevMonth() {
    // Calculate the first day of the current view month
    const currentViewDate = new Date(currentViewYear, currentViewMonth, 1);

    // Calculate the first day of the previous month
    const prevMonthDate = new Date(currentViewYear, currentViewMonth - 1, 1);

    // Calculate the first day of the minimum arrival month
    const minArrivalMonth = new Date(
      minArrival.getFullYear(),
      minArrival.getMonth(),
      1,
    );

    // Only allow navigation if the previous month is not before the minimum arrival month
    if (prevMonthDate >= minArrivalMonth) {
      if (currentViewMonth === 0) {
        currentViewMonth = 11;
        currentViewYear--;
      } else {
        currentViewMonth--;
      }
      generateCalendar();
    } else {
      console.log(
        "[DEBUG-SVELTE] Cannot navigate before minimum arrival month",
      );
    }
  }

  // Navigate to next month
  function nextMonth() {
    if (currentViewMonth === 11) {
      currentViewMonth = 0;
      currentViewYear++;
    } else {
      currentViewMonth++;
    }
    generateCalendar();
  }

  /**
   * Utility: remove HH:MM:SS from a Date (for simpler comparisons).
   */
  function stripTime(dt) {
    const temp = new Date(dt);
    temp.setHours(0, 0, 0, 0);
    return temp;
  }

  /**
   * Check if day is out of arrival range: earlier than minArrival or later than maxArrival.
   * This is strictly for arrival. After arrival, the user may depart beyond maxArrival if desired.
   */
  function isDisabledArrivalDay(date) {
    try {
      const d = stripTime(date).getTime();
      return (
        d < stripTime(minArrival).getTime() ||
        d > stripTime(maxArrival).getTime()
      );
    } catch (e) {
      console.error("[DEBUG-SVELTE] Error in isDisabledArrivalDay:", e);
      return true; // Disable the day if there's an error
    }
  }

  // Check if a date is available for departure selection
  // A date is available for departure if:
  // 1. It's after the arrival date
  // 2. It's at least minStay days after arrival
  // 3. No days between arrival and this date are fully booked
  function isDepartureAvailable(date) {
    if (!arrival) return false;

    try {
      const d = stripTime(date).getTime();
      const a = stripTime(arrival).getTime();

      // Must be after arrival date
      if (d <= a) return false;

      // Must satisfy minimum stay
      const diffDays = Math.round((d - a) / (1000 * 60 * 60 * 24));
      if (diffDays < minStay) return false;

      // Check if any day between arrival and this date is fully booked
      return !rangeHasFullyBooked(arrival, date);
    } catch (e) {
      console.error("[DEBUG-SVELTE] Error in isDepartureAvailable:", e);
      return false;
    }
  }

  /**
   * A day is "fully booked for arrival" if:
   *  1) That day itself is fully booked, OR
   *  2) Among the next (minStay - 1) days, at least one is fully booked.
   *
   * If either is true, there's no way to start at `date` and fulfill a minStay without hitting a booked day.
   */
  function isFullyBookedForArrival(date) {
    // If date is in the "fully booked" array, it's immediately invalid for arrival.
    if (dateIsInFullyBooked(date)) {
      return true;
    }

    // Check the next (minStay - 1) nights
    for (let i = 0; i < minStay; i++) {
      const checkDay = addDays(date, i);
      if (dateIsInFullyBooked(checkDay)) {
        return true; // can't start a stay that hits a fully booked day
      }
    }
    return false;
  }

  function dateIsInFullyBooked(date) {
    const d = stripTime(date).getTime();
    return normalizedFullyBooked.some((fb) => fb.getTime() === d);
  }

  // Add N days to a date
  function addDays(dt, days) {
    const result = new Date(dt);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
   * Handle day click:
   *  - If it's disabled or fully booked for arrival, ignore.
   *  - If no arrival selected, set that day as arrival.
   *  - If arrival is selected, attempt to set departure.
   */
  function handleDayClick(day) {
    // Save previous values to detect change
    const prevArrival = arrival;
    const prevDeparture = departure;
    console.log("[DEBUG-SVELTE] Day clicked:", day);

    // Don't allow clicking on days from previous or next month
    if (day.isPrevMonth || day.isNextMonth) {
      console.log("[DEBUG-SVELTE] Ignoring click on day from another month");
      return;
    }

    // SPECIAL CASE: Check if clicking on the arrival date to reset selection
    // Do this check BEFORE checking if the day is disabled, since the arrival date
    // might appear disabled for departure selection
    if (arrival) {
      // Get date values for comparison
      const dayTime = stripTime(new Date(day.date)).getTime();
      const arrivalTime = stripTime(new Date(arrival)).getTime();

      console.log("[DEBUG-SVELTE] Comparing clicked day with arrival:", {
        clickedDay: day.date.toISOString(),
        clickedDayTime: dayTime,
        arrivalDate: arrival.toISOString(),
        arrivalTime: arrivalTime,
        isEqual: dayTime === arrivalTime,
      });

      // If both arrival and departure are selected and user clicks on either, reset both
      if (arrival && departure) {
        if (
          dayTime === arrivalTime ||
          (departure && dayTime === stripTime(new Date(departure)).getTime())
        ) {
          console.log(
            "[DEBUG-SVELTE] RESET: Clicked on arrival or departure date with both selected",
          );
          arrival = null;
          departure = null;
          setStartDate(null);
          setEndDate(null);
          dispatchDateSelection(null, null, false);

          // Reset calendar to original state (show allowed arrival month/year)
          if (minArrival) {
            currentViewMonth = minArrival.getMonth();
            currentViewYear = minArrival.getFullYear();
            generateCalendar();
          }
          return;
        }
      }
      // If clicking on the same day as arrival, reset the selection
      if (dayTime === arrivalTime) {
        console.log("[DEBUG-SVELTE] RESET: Clicked on arrival date");

        // Reset both dates
        arrival = new Date(day.date);
        departure = null;
        console.log("[OfferDatePicker] Setting startDate:", arrival);
        setStartDate(arrival);
        console.log("[OfferDatePicker] Setting endDate:", null);
        setEndDate(null);
        console.log("[DEBUG-SVELTE] Set arrival date:", arrival);
        dispatchDateSelection(arrival, departure, false);
        // Calendar will be regenerated via the reactive statement
        return;
      }
    }

    // If no arrival is selected, set arrival (only if it's a valid arrival date)
    if (!arrival) {
      // Check if this day is valid for arrival - should match the isAvailableForArrival calculation
      const dateTime = stripTime(day.date).getTime();
      const minArrivalTime = stripTime(minArrival).getTime();
      const maxArrivalTime = stripTime(maxArrival).getTime();

      const isWithinArrivalRange =
        dateTime >= minArrivalTime && dateTime <= maxArrivalTime;

      if (!isWithinArrivalRange || day.isFullyBooked) {
        console.log(
          "[DEBUG-SVELTE] BLOCKED: Cannot select as arrival - ",
          day.date.toISOString(),
          "Valid range:",
          minArrival.toISOString(),
          "to",
          maxArrival.toISOString(),
        );
        return;
      }

      // Additional detailed logging for debugging
      console.log(
        "[DEBUG-SVELTE] Selection allowed for",
        day.date.toISOString(),
        "Min arrival:",
        minArrival.toISOString(),
        "Max arrival:",
        maxArrival.toISOString(),
      );

      arrival = new Date(day.date);
      departure = null;
      console.log("[OfferDatePicker] Setting startDate:", arrival);
      setStartDate(arrival);
      console.log("[OfferDatePicker] Setting endDate:", null);
      setEndDate(null);
      dispatchDateSelection(arrival, departure, false);
      return;
    }

    // If arrival is set and user is picking a valid departure
    if (arrival && !departure && isDepartureAvailable(day.date)) {
      departure = new Date(day.date);
      console.log("[OfferDatePicker] Setting startDate:", arrival);
      setStartDate(arrival);
      console.log("[OfferDatePicker] Setting endDate:", departure);
      setEndDate(departure);
      dispatchDateSelection(arrival, departure, true);
      return;
    }

    // If none of the above, do nothing (or add additional logic as needed)
  }

  function dayDifference(a, b) {
    const start = stripTime(a).getTime();
    const end = stripTime(b).getTime();
    return Math.round((end - start) / (1000 * 60 * 60 * 24));
  }

  /**
   * Check if any day from `start` (inclusive) to `end` (exclusive) is in fullyBookedDays.
   * We'll stop checking the day before `end`, since they check out on the departure day.
   */
  function rangeHasFullyBooked(start, end) {
    // iterate each day from start up to (end - 1 day)
    let check = new Date(start);
    while (stripTime(check) < stripTime(end)) {
      if (dateIsInFullyBooked(check)) {
        return true;
      }
      check.setDate(check.getDate() + 1);
    }
    return false;
  }

  // Helper: check if two dates are the same day (ignoring time)
  function isSameDay(d1, d2) {
    if (!d1 || !d2) return false;

    try {
      const t1 = stripTime(d1).getTime();
      const t2 = stripTime(d2).getTime();
      const result = t1 === t2;

      console.log("[DEBUG-SVELTE] isSameDay comparison:", {
        date1: d1.toISOString(),
        date2: d2.toISOString(),
        time1: t1,
        time2: t2,
        result: result,
      });

      return result;
    } catch (e) {
      console.error("[DEBUG-SVELTE] Error in isSameDay:", e);
      return false;
    }
  }

  // Helper: check if a day is between arrival and departure
  function inSelectedRange(date) {
    if (!arrival || !departure) return false;
    const d = stripTime(date).getTime();
    const a = stripTime(arrival).getTime();
    const b = stripTime(departure).getTime();
    // Mark "in-range" if it's strictly between arrival and departure
    return d > a && d < b;
  }

  // Handle keyboard events for accessibility
  function handleKeyDown(event, day) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleDayClick(day);
    }
  }

  // Define a custom event for date selection that will be accessible from Astro
  function dispatchDateSelection(arrival, departure, complete = false) {
    // Create a custom event that can be listened to from outside Svelte
    const event = new CustomEvent("dateSelection", {
      detail: { arrival, departure, complete },
      bubbles: true,
    });

    // Dispatch the event from the component's DOM element
    if (typeof document !== "undefined") {
      document.querySelector(".offer-date-picker")?.dispatchEvent(event);
    }

    // Also use Svelte's internal event system
    dispatch("selection", { arrival, departure, complete });
  }

  // Track arrival date changes to update calendar
  $: if (arrival) {
    console.log("[DEBUG-SVELTE] Arrival date changed, regenerating calendar");
    generateCalendar();
  }

  // Track month/year changes to update calendar
  $: if (currentViewMonth !== undefined && currentViewYear !== undefined) {
    console.log("[DEBUG-SVELTE] Month/year changed, regenerating calendar");
    generateCalendar();
  }

  // Track props changes to update calendar
  $: if (minArrival || maxArrival || minStay || fullyBookedDays) {
    console.log("[DEBUG-SVELTE] Props changed, regenerating calendar");
    generateCalendar();
  }

  onMount(() => {
    console.log("[DEBUG-SVELTE] OfferDatePicker component mounted");
    generateCalendar();
  });

  let adults = 1;
  let children = 0;

  // Functions to handle adults and children changes
  function handleAdultsChange() {
    dispatch("adultsChange", adults);
  }

  function handleChildrenChange() {
    dispatch("childrenChange", children);
  }
</script>

<div class="offer-date-picker" id="offer-date-picker">
  <div class="calendar-header flex items-center justify-between">
    <div class="flex items-center">
      <button
        class="month-nav-btn"
        on:click={prevMonth}
        aria-label="Previous month"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <div class="current-month">
        {new Date(currentViewYear, currentViewMonth).toLocaleString("default", {
          month: "long",
          year: "numeric",
        })}
      </div>
      <button
        class="month-nav-btn"
        on:click={nextMonth}
        aria-label="Next month"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>

    <div class="flex items-center gap-2">
      <div class="flex items-center">
        <label for="adult-select" class="text-sm mr-1">Erwachsene</label>
        <select
          id="adult-select"
          class="text-sm px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md"
          bind:value={adults}
          on:change={handleAdultsChange}
        >
          {#each Array.from({ length: 5 }, (_, i) => i + 1) as count}
            <option value={count}>{count}</option>
          {/each}
        </select>
      </div>

      <div class="flex items-center">
        <label for="children-select" class="text-sm mr-1">Kinder</label>
        <select
          id="children-select"
          class="text-sm px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md"
          bind:value={children}
          on:change={handleChildrenChange}
        >
          {#each Array.from({ length: 4 }, (_, i) => i) as count}
            <option value={count}>{count}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>

  <div class="selection-instruction">
    {#if !arrival}
      <p>Anreisedatum wählen</p>
    {:else if !departure}
      <p>Abreisedatum wählen</p>
    {:else}
      <p>Aufenthalt: {dayDifference(arrival, departure)} Nächte</p>
    {/if}
  </div>

  <div class="weekday-header">
    <div class="weekday">Mo</div>
    <div class="weekday">Tu</div>
    <div class="weekday">We</div>
    <div class="weekday">Th</div>
    <div class="weekday">Fr</div>
    <div class="weekday">Sa</div>
    <div class="weekday">Su</div>
  </div>

  <div class="calendar">
    {#each calendarDays as day}
      <div
        role="button"
        tabindex="0"
        class="day
            {day.isPrevMonth || day.isNextMonth ? 'other-month' : ''}
            {day.isFullyBooked ? 'fully-booked' : ''}
            {isSameDay(day.date, arrival) ? 'selected' : ''}
            {isSameDay(day.date, departure) ? 'departure-selected' : ''}
            {inSelectedRange(day.date) ? 'in-range' : ''}
            {!arrival && day.isAvailableForArrival ? 'available-arrival' : ''}
            {arrival && !departure && day.isAvailableForDeparture
          ? 'valid-departure'
          : ''}
            {(day.isDisabled || day.isMinStayDisabled) &&
        !isSameDay(day.date, arrival) &&
        !isSameDay(day.date, departure)
          ? 'min-stay-disabled'
          : ''}"
        style={isSameDay(day.date, arrival) || isSameDay(day.date, departure)
          ? "cursor: pointer;"
          : ""}
        on:click={() => handleDayClick(day)}
        on:keydown={(e) => handleKeyDown(e, day)}
        aria-label="{day.date.getDate()} {day.date.toLocaleString('default', {
          month: 'long',
        })} {day.date.getFullYear()}"
        aria-disabled={(day.isDisabled || day.isFullyBooked) &&
          !isSameDay(day.date, arrival) &&
          !isSameDay(day.date, departure)}
      >
        {day.date.getDate()}
      </div>
    {/each}
  </div>
</div>

<style>
  .offer-date-picker {
    font-family: Arial, sans-serif;
    max-width: 350px;
    margin: 0 auto;
  }

  .date-selection-info {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }

  .date-info {
    padding: 0.5rem;
    background-color: #f8f9fa;
    border-radius: 4px;
    flex: 1;
    margin: 0 0.25rem;
  }

  .calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid #e9ecef;
  }

  .month-nav-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .month-nav-btn:hover {
    background-color: #f1f1f1;
  }

  .current-month {
    font-weight: bold;
    font-size: 1.1rem;
  }

  .selection-instruction {
    text-align: center;
    margin: 0.5rem 0;
    font-weight: bold;
    color: #495057;
    padding: 0.5rem;
    background-color: #f8f9fa;
    border-radius: 4px;
  }

  .weekday-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    margin-bottom: 0.5rem;
  }

  .weekday {
    text-align: center;
    font-weight: bold;
    font-size: 0.8rem;
    color: #6c757d;
    padding: 0.25rem 0;
  }

  .calendar {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-gap: 2px;
    justify-content: center;
  }

  .day {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 4px;
    font-size: 0.9rem;
    transition:
      background-color 0.2s,
      color 0.2s;
  }

  .other-month {
    background-color: #f8f9fa;
    color: #adb5bd;
    cursor: not-allowed;
  }

  .fully-booked {
    background-color: #f8d7da; /* light red */
    color: #721c24;
    cursor: not-allowed;
  }

  /* Style for days disabled due to minimum stay requirement or any other reason */
  .min-stay-disabled {
    background-color: #f8f9fa; /* light grey */
    color: #adb5bd; /* grey text */
    cursor: not-allowed;
  }

  /* Style for valid departure dates after arrival is selected */
  .valid-departure {
    color: #212529; /* black text */
    font-weight: normal;
  }

  .selected {
    background-color: #28a745; /* green for arrival */
    color: #fff;
    font-weight: bold;
    cursor: pointer !important; /* Always allow clicking on selected dates */
  }

  .departure-selected {
    background-color: #fd7e14; /* orange for departure */
    color: #fff;
    font-weight: bold;
    cursor: pointer !important; /* Always allow clicking on selected dates */
  }

  .in-range {
    background-color: #e6f7ff; /* light blue for dates in between */
  }

  /* Style for available arrival dates (green text) */
  .available-arrival {
    color: #28a745 !important; /* Green text */
    font-weight: 500;
  }

  .available-arrival:hover,
  .valid-departure:hover {
    background-color: #e9ecef;
  }

  .other-month {
    opacity: 0.5;
  }
</style>
