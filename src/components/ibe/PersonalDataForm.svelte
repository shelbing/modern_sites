<script>
  import { createEventDispatcher } from "svelte";
  import { formTranslations } from "../../lib/translations";
  import { personalDataStore } from "../../stores/personalDataStore";
  import { cartStore } from "../../stores/cartStore";

  export let language;
  const dispatch = createEventDispatcher();

  $: t = formTranslations[language] || formTranslations.en;
  
  // Calculate number of additional guests (total adults minus the booker)
  $: numberOfAdditionalGuests = ($cartStore?.searchData?.adults || 1) - 1;
  
  // Get number of children
  $: numberOfChildren = $cartStore?.searchData?.childrenAges?.length || 0;

  // Initialize additional guest fields if needed
  $: if ((numberOfAdditionalGuests > 0 || numberOfChildren > 0) && 
         (!$personalDataStore.additionalGuests || 
          $personalDataStore.additionalGuests.length !== (numberOfAdditionalGuests + numberOfChildren))) {
    personalDataStore.update(data => ({
      ...data,
      additionalGuests: [
        // Adult guests
        ...Array(numberOfAdditionalGuests).fill().map(() => ({
          firstName: '',
          lastName: '',
          isChild: false
        })),
        // Child guests
        ...($cartStore?.searchData?.childrenAges || []).map(age => ({
          firstName: '',
          lastName: '',
          isChild: true,
          age: age
        }))
      ]
    }));
  }

  function handleInput(field, event, guestIndex = -1) {
    const value = event.target.value;
    
    if (guestIndex === -1) {
      // Main guest (booker) data
      personalDataStore.update(data => ({ ...data, [field]: value }));
      
      if (field === 'postalCode') {
        personalDataStore.validate(field, value, $personalDataStore.country);
      } else {
        personalDataStore.validate(field, value);
      }
    } else {
      // Additional guest data
      personalDataStore.update(data => {
        const updatedGuests = [...data.additionalGuests];
        updatedGuests[guestIndex] = {
          ...updatedGuests[guestIndex],
          [field]: value
        };
        return { ...data, additionalGuests: updatedGuests };
      });
    }
  }
</script>

<div class="space-y-8">
  <!-- Main Guest -->
  <div>
    <h2 class="text-xl font-semibold mb-4">{t.mainGuest}</h2>
    
    <!-- Title -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {t.title}
        <select
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          bind:value={$personalDataStore.title}
        >
          {#each Object.entries(t.titleOptions) as [value, label]}
            <option {value}>{label}</option>
          {/each}
        </select>
      </label>
    </div>

    <!-- First Name -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {t.firstName} *
        <input
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          class:border-red-500={$personalDataStore.errors.firstName}
          value={$personalDataStore.firstName}
          on:input={(e) => handleInput('firstName', e)}
        />
      </label>
      {#if $personalDataStore.errors.firstName}
        <p class="mt-1 text-sm text-red-600">{t.requiredField}</p>
      {/if}
    </div>

    <!-- Last Name -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {t.lastName} *
        <input
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          class:border-red-500={$personalDataStore.errors.lastName}
          value={$personalDataStore.lastName}
          on:input={(e) => handleInput('lastName', e)}
        />
      </label>
      {#if $personalDataStore.errors.lastName}
        <p class="mt-1 text-sm text-red-600">{t.requiredField}</p>
      {/if}
    </div>

    <!-- Email -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {t.email} *
        <input
          type="email"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          class:border-red-500={$personalDataStore.errors.email}
          value={$personalDataStore.email}
          on:input={(e) => handleInput('email', e)}
        />
      </label>
      {#if $personalDataStore.errors.email}
        <p class="mt-1 text-sm text-red-600">
          {$personalDataStore.errors.email === 'emailRequired' ? t.requiredField : t.invalidFormat}
        </p>
      {/if}
    </div>

    <!-- Phone -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {t.phone} *
        <input
          type="tel"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          class:border-red-500={$personalDataStore.errors.phone}
          value={$personalDataStore.phone}
          on:input={(e) => handleInput('phone', e)}
        />
      </label>
      {#if $personalDataStore.errors.phone}
        <p class="mt-1 text-sm text-red-600">
          {$personalDataStore.errors.phone === 'phoneRequired' ? t.requiredField : t.invalidFormat}
        </p>
      {/if}
    </div>

    <!-- Street -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {t.street} *
        <input
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          class:border-red-500={$personalDataStore.errors.street}
          value={$personalDataStore.street}
          on:input={(e) => handleInput('street', e)}
        />
      </label>
      {#if $personalDataStore.errors.street}
        <p class="mt-1 text-sm text-red-600">{t.requiredField}</p>
      {/if}
    </div>

    <!-- Postal Code -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {t.postalCode} *
        <input
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          class:border-red-500={$personalDataStore.errors.postalCode}
          value={$personalDataStore.postalCode}
          on:input={(e) => handleInput('postalCode', e)}
        />
      </label>
      {#if $personalDataStore.errors.postalCode}
        <p class="mt-1 text-sm text-red-600">
          {$personalDataStore.errors.postalCode === 'postalCodeRequired' ? t.requiredField : t.invalidFormat}
        </p>
      {/if}
    </div>

    <!-- City -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {t.city} *
        <input
          type="text"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          class:border-red-500={$personalDataStore.errors.city}
          value={$personalDataStore.city}
          on:input={(e) => handleInput('city', e)}
        />
      </label>
      {#if $personalDataStore.errors.city}
        <p class="mt-1 text-sm text-red-600">{t.requiredField}</p>
      {/if}
    </div>

    <!-- Country -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {t.country} *
        <select
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          class:border-red-500={$personalDataStore.errors.country}
          bind:value={$personalDataStore.country}
          on:change={(e) => handleInput('country', e)}
        >
          <option value="">{t.selectCountry}</option>
          {#each Object.entries(t.countries) as [code, name]}
            <option value={code}>{name}</option>
          {/each}
        </select>
      </label>
      {#if $personalDataStore.errors.country}
        <p class="mt-1 text-sm text-red-600">{t.requiredField}</p>
      {/if}
    </div>

    <!-- Comments -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {t.comments}
        <textarea
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          rows="3"
          bind:value={$personalDataStore.comments}
        ></textarea>
      </label>
    </div>
  </div>

  <!-- Additional Adult Guests -->
  {#if numberOfAdditionalGuests > 0}
    <div>
      <h2 class="text-xl font-semibold mb-4">{t.additionalAdultGuests}</h2>
      
      {#each Array(numberOfAdditionalGuests) as _, index}
        <div class="border-t pt-6 mt-6">
          <h3 class="text-lg font-medium mb-4">{t.adultGuest} {index + 2}</h3>
          
          <!-- First Name -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t.firstName} *
              <input
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                value={$personalDataStore.additionalGuests[index]?.firstName || ''}
                on:input={(e) => handleInput('firstName', e, index)}
              />
            </label>
          </div>

          <!-- Last Name -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t.lastName} *
              <input
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                value={$personalDataStore.additionalGuests[index]?.lastName || ''}
                on:input={(e) => handleInput('lastName', e, index)}
              />
            </label>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <!-- Children -->
  {#if numberOfChildren > 0}
    <div>
      <h2 class="text-xl font-semibold mb-4">{t.childGuests}</h2>
      
      {#each $cartStore.searchData.childrenAges as age, index}
        <div class="border-t pt-6 mt-6">
          <h3 class="text-lg font-medium mb-4">{t.childGuest} ({age} {t.yearsOld})</h3>
          
          <!-- First Name -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t.firstName} *
              <input
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                value={$personalDataStore.additionalGuests[numberOfAdditionalGuests + index]?.firstName || ''}
                on:input={(e) => handleInput('firstName', e, numberOfAdditionalGuests + index)}
              />
            </label>
          </div>

          <!-- Last Name -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t.lastName} *
              <input
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                value={$personalDataStore.additionalGuests[numberOfAdditionalGuests + index]?.lastName || ''}
                on:input={(e) => handleInput('lastName', e, numberOfAdditionalGuests + index)}
              />
            </label>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
