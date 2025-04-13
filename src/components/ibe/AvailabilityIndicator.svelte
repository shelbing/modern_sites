<script>
    import { format, startOfWeek, addDays, isSameDay, getWeek, addWeeks, differenceInWeeks, isSameMonth, startOfMonth, getDate, isAfter, isBefore, isEqual } from 'date-fns';
    import { de } from 'date-fns/locale';
    import { noOffersTranslations } from "../../lib/translations/noOffers";

    export let availabilityData = [];
    export let language = "de";
    export let onDateSelect = (startDate, endDate) => {};

    let selectedStartDate = null;
    let selectedEndDate = null;
    let showModal = false;
    let selectedDay = null;

    $: t = noOffersTranslations[language] || noOffersTranslations.en;
    
    // Group availability data by calendar weeks
    $: weeks = groupByWeeks(availabilityData);

    function getAvailabilityStatus(date) {
        if (!date) return 'none';
        const totalSellable = date.totalSellable;
        if (totalSellable === 0) return 'red';
        if (totalSellable <= 5) return 'yellow';
        return 'green';
    }

    function formatDate(dateStr) {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return format(date, language === 'de' ? 'd. MMM' : 'MMM d', { locale: language === 'de' ? de : undefined });
    }

    function formatMonth(date) {
        return format(date, 'MMMM yyyy', { locale: language === 'de' ? de : undefined });
    }

    function formatMonthShort(date) {
        return format(date, 'MMM', { locale: language === 'de' ? de : undefined });
    }

    function formatWeekDay(dayIndex) {
        const date = addDays(new Date(), dayIndex);
        return format(date, 'EEE', { locale: language === 'de' ? de : undefined });
    }

    function shouldShowMonth(date) {
        return getDate(date) === 1;
    }

    function openDayModal(day) {
        if (day.availability) {
            selectedDay = day;
            showModal = true;
        }
    }

    function closeModal() {
        showModal = false;
        selectedDay = null;
    }

    function handleKeydown(event) {
        if (event.key === 'Escape') {
            closeModal();
        }
    }

    function handleDateClick(day) {
        console.log('handleDateClick called with day:', day);
        
        if (!day.availability || day.availability.totalSellable === 0) {
            console.log('Day not selectable:', day);
            return;
        }

        if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
            // Start new selection
            console.log('Setting start date:', day.date);
            selectedStartDate = day.date;
            selectedEndDate = null;
        } else {
            // Complete selection
            if (isAfter(day.date, selectedStartDate)) {
                console.log('Setting end date:', day.date);
                selectedEndDate = day.date;
                console.log('Calling onDateSelect with:', { start: selectedStartDate, end: day.date });
                onDateSelect(selectedStartDate, selectedEndDate);
            } else {
                // If clicked date is before start date, make it the new start date
                console.log('Updating start date:', day.date);
                selectedStartDate = day.date;
            }
        }
        
        console.log('Current selection state:', { selectedStartDate, selectedEndDate });
    }

    $: {
        if (selectedStartDate || selectedEndDate) {
            console.log('Date selection state changed:', { selectedStartDate, selectedEndDate });
        }
    }

    function isDateInRange(date) {
        if (!selectedStartDate) return false;
        if (!selectedEndDate) return isSameDay(date, selectedStartDate);
        return (
            isSameDay(date, selectedStartDate) ||
            isSameDay(date, selectedEndDate) ||
            (isAfter(date, selectedStartDate) && isBefore(date, selectedEndDate))
        );
    }

    function isDateSelectable(day) {
        return day.availability && day.availability.totalSellable > 0;
    }

    function groupByWeeks(data) {
        if (!data || data.length === 0) return [];

        const weeks = [];
        
        // Get the first and last dates from data
        const firstDate = new Date(data[0].date);
        const lastDate = new Date(data[data.length - 1].date);
        
        // Calculate number of weeks
        const numWeeks = Math.ceil(differenceInWeeks(lastDate, firstDate)) + 1;
        
        // Start with the first week
        let currentWeekStart = startOfWeek(firstDate, { locale: language === 'de' ? de : undefined });
        
        // Generate weeks
        for (let weekIndex = 0; weekIndex < numWeeks; weekIndex++) {
            const currentWeek = {
                weekNumber: getWeek(currentWeekStart, { locale: language === 'de' ? de : undefined }),
                days: []
            };
            
            // Generate days for the current week
            for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
                const currentDate = addDays(currentWeekStart, dayIndex);
                const availabilityEntry = data.find(d => isSameDay(new Date(d.date), currentDate));
                
                currentWeek.days.push({
                    date: currentDate,
                    weekDay: format(currentDate, 'EEE', { locale: language === 'de' ? de : undefined }),
                    availability: availabilityEntry || null,
                    isNewMonth: shouldShowMonth(currentDate)
                });
            }
            
            weeks.push(currentWeek);
            currentWeekStart = addWeeks(currentWeekStart, 1);
        }

        return weeks;
    }
</script>

<svelte:window on:keydown={handleKeydown}/>

<div class="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
    <h3 class="text-lg font-semibold mb-6 text-gray-800 dark:text-white">
        {t.availabilityTitle}
    </h3>
    
    <div class="space-y-8">
        {#each weeks as week}
            <div>
                <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                    {t.calendarWeek} {week.weekNumber}
                </div>

                <div class="grid grid-cols-7 gap-2">
                    <!-- Week day headers -->
                    {#each week.days as day}
                        <div class="text-center text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">
                            {day.weekDay}
                        </div>
                    {/each}
                    
                    <!-- Calendar days -->
                    {#each week.days as day}
                        <div class="aspect-square p-0.5">
                            <!-- Month label for first day of month -->
                            {#if day.isNewMonth}
                                <div class="absolute -top-8 left-0 right-0 text-center">
                                    <span class="text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded-full border border-gray-200 dark:border-gray-600">
                                        {formatMonthShort(day.date)}
                                    </span>
                                </div>
                            {/if}

                            <div class="relative w-full h-full flex flex-col items-center justify-between p-2 rounded-lg border shadow-sm transition-all duration-200
                                {isDateSelectable(day) ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500' : 'opacity-40 bg-gray-50 dark:bg-gray-700 border-gray-100 dark:border-gray-600'}
                                {day.isNewMonth ? 'ring-2 ring-yellow-200 dark:ring-yellow-900' : ''}
                                {isDateInRange(day.date) && !isSameDay(day.date, selectedStartDate) && !isSameDay(day.date, selectedEndDate) ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800' : ''}
                                {isSameDay(day.date, selectedStartDate) ? 'bg-blue-500 dark:bg-blue-600 border-blue-600 dark:border-blue-500 text-white dark:text-white shadow-md' : ''}
                                {isSameDay(day.date, selectedEndDate) ? 'bg-blue-500 dark:bg-blue-600 border-blue-600 dark:border-blue-500 text-white dark:text-white shadow-md' : ''}"
                                on:click={() => {
                                    if (isDateSelectable(day)) {
                                        handleDateClick(day);
                                    }
                                }}
                                title={day.availability ? 
                                    `${formatDate(day.date)}: ${day.availability.totalSellable} ${t.roomsAvailable}` : 
                                    formatDate(day.date)}>
                                
                                {#if isDateInRange(day.date) && !isSameDay(day.date, selectedStartDate) && !isSameDay(day.date, selectedEndDate)}
                                    <div class="absolute inset-x-0 top-0 h-full bg-blue-100 dark:bg-blue-800/20 -z-10"></div>
                                {/if}
                                {#if isSameDay(day.date, selectedStartDate)}
                                    <div class="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 dark:bg-blue-600 transform rotate-45 -z-10"></div>
                                    <div class="absolute top-0 left-0 p-1">
                                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                        </svg>
                                    </div>
                                {/if}
                                {#if isSameDay(day.date, selectedEndDate)}
                                    <div class="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 dark:bg-blue-600 transform rotate-45 -z-10"></div>
                                    <div class="absolute top-0 right-0 p-1">
                                        <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                        </svg>
                                    </div>
                                {/if}

                                <div class="text-center mb-1 relative">
                                    <div class="text-base font-semibold
                                        {isSameDay(day.date, selectedStartDate) || isSameDay(day.date, selectedEndDate) ? 'text-white' : 'text-gray-700 dark:text-gray-200'}">
                                        {formatDate(day.date)}
                                    </div>
                                </div>
                                
                                {#if day.availability}
                                    <!-- Availability status -->
                                    <div class="flex flex-col items-center gap-1">
                                        <div class="w-3 h-3 rounded-full
                                            {getAvailabilityStatus(day.availability) === 'red' ? 'bg-red-500' : 
                                            getAvailabilityStatus(day.availability) === 'yellow' ? 'bg-yellow-500' : 
                                            'bg-green-500'}
                                            {isSameDay(day.date, selectedStartDate) || isSameDay(day.date, selectedEndDate) ? 'bg-opacity-90' : ''}"
                                            title={day.availability.totalSellable === 0 ? t.fullyBooked : 
                                                day.availability.totalSellable <= 5 ? t.limitedAvailability :
                                                t.goodAvailability}>
                                        </div>
                                        
                                        <!-- Room count and label -->
                                        <div class="text-center">
                                            <div class="text-xs font-medium 
                                                {isSameDay(day.date, selectedStartDate) || isSameDay(day.date, selectedEndDate) ? 'text-white' : 
                                                getAvailabilityStatus(day.availability) === 'red' ? 'text-red-600 dark:text-red-400' : 
                                                getAvailabilityStatus(day.availability) === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' : 
                                                'text-green-600 dark:text-green-400'}">
                                                {day.availability.totalSellable}
                                            </div>
                                            <div class="text-[10px] leading-tight
                                                {isSameDay(day.date, selectedStartDate) || isSameDay(day.date, selectedEndDate) ? 'text-white' : 'text-gray-500 dark:text-gray-400'}">
                                                {t.roomsLabel}
                                            </div>
                                        </div>
                                    </div>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/each}
    </div>

    <div class="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
        {#if !selectedStartDate}
            {t.selectStartDate}
        {:else if !selectedEndDate}
            {t.selectEndDate}
        {/if}
    </div>

    <div class="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 pt-6">
        <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>{t.goodAvailability}</span>
        </div>
        <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>{t.limitedAvailability}</span>
        </div>
        <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>{t.fullyBooked}</span>
        </div>
    </div>
</div>

<!-- Modal -->
{#if showModal}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" on:click={closeModal}>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full mx-4" 
             on:click|stopPropagation>
            <!-- Modal Header -->
            <div class="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                <div class="flex items-center gap-3">
                    <div class="w-3 h-3 rounded-full
                        {getAvailabilityStatus(selectedDay.availability) === 'red' ? 'bg-red-500' : 
                        getAvailabilityStatus(selectedDay.availability) === 'yellow' ? 'bg-yellow-500' : 
                        'bg-green-500'}">
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatDate(selectedDay.date)}
                    </h3>
                </div>
                <button class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        on:click={closeModal}>
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <!-- Modal Content -->
            <div class="p-4">
                <!-- Room Categories -->
                {#if selectedDay.availability.units && selectedDay.availability.units.length > 0}
                    <div class="space-y-2">
                        {#each selectedDay.availability.units as unit}
                            {#if unit.sellableCount > 0}
                                <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                                    <div class="pr-4">
                                        <div class="font-medium text-gray-900 dark:text-white">
                                            {unit.name}
                                        </div>
                                    </div>
                                    <div class="flex items-center gap-1">
                                        <span class="text-lg font-semibold text-gray-900 dark:text-white">
                                            {unit.sellableCount}
                                        </span>
                                        <span class="text-sm text-gray-500 dark:text-gray-400">
                                            {t.availableUnits}
                                        </span>
                                    </div>
                                </div>
                            {/if}
                        {/each}
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}
