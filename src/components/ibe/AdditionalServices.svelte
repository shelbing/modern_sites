<script>
    import { formTranslations } from "../../lib/translations";
    import { cartStore } from "../../stores/cartStore";
    import { renderRichText } from "@storyblok/js";

    export let language;
    $: t = formTranslations[language] || formTranslations.en;

    // Debug logging
    $: if ($cartStore?.offer) {
        console.log("Cart store offer:", $cartStore.offer);
        console.log("Available services:", $cartStore.offer.Services);
        if ($cartStore.offer.Services?.length > 0) {
            console.log("First service structure:", $cartStore.offer.Services[0]);
            console.log("Service fields:", Object.keys($cartStore.offer.Services[0]));
        }
    }

    function formatPrice(amount, currency) {
        return new Intl.NumberFormat(language, {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    function formatPercent(value) {
        return new Intl.NumberFormat(language, {
            style: 'percent',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(value);
    }

    // Add quantity management
    let serviceQuantities = {};

    function getInitialQuantity(service) {
        if (service.Buchbarkeit === "3" || service.Buchbarkeit === "6") {
            return 1;
        }
        return 1;
    }

    function handleServiceSelection(service) {
        const quantity = serviceQuantities[service.id] || getInitialQuantity(service);
        
        cartStore.update(cart => {
            if (!cart) return cart;

            // Get number of guests for Buchbarkeit 5
            const numberOfGuests = cart.searchData?.adults + (cart.searchData?.children || 0) || 1;

            // Update service selection status while preserving all fields
            const updatedServices = cart.offer.Services.map(s => {
                if (s.id === service.id) {
                    const effectiveQuantity = s.Buchbarkeit === "5" ? numberOfGuests : quantity;
                    const basePrice = parseFloat(service.price) || 0;
                    return { 
                        ...service, 
                        selected: !s.selected,
                        quantity: !s.selected ? effectiveQuantity : 0, // Set quantity when selecting, reset when deselecting
                        pricePerUnit: basePrice, // Store original price
                        price: basePrice // Keep original price for display
                    };
                }
                return s;
            });

            // Get selected services
            const selectedServices = updatedServices.filter(s => s.selected);

            // Calculate amounts for all selected services considering quantities
            const amounts = calculateServiceAmounts(selectedServices);

            return {
                ...cart,
                offer: {
                    ...cart.offer,
                    Services: updatedServices
                },
                selectedServices: {
                    items: selectedServices,
                    amounts: amounts,
                    totalTax: amounts.tax,
                    totalAmount: amounts.gross
                },
                calculatedAmounts: {
                    ...cart.calculatedAmounts,
                    total: {
                        gross: amounts.gross,
                        net: amounts.net
                    }
                }
            };
        });
    }

    function calculateServiceAmounts(selectedServices) {
        let amounts = {
            gross: 0,
            net: 0,
            tax: 0
        };

        selectedServices.forEach(service => {
            const basePrice = parseFloat(service.pricePerUnit || service.price) || 0;
            const taxRate = service.taxRate || 0.19;
            const quantity = service.quantity || 1;

            const totalPrice = basePrice * quantity;
            amounts.gross += totalPrice;

            const netAmount = totalPrice / (1 + taxRate);
            amounts.net += netAmount;

            const taxAmount = totalPrice - netAmount;
            amounts.tax += taxAmount;
        });

        amounts.gross = Math.round(amounts.gross * 100) / 100;
        amounts.net = Math.round(amounts.net * 100) / 100;
        amounts.tax = Math.round(amounts.tax * 100) / 100;

        return amounts;
    }

    function updateQuantity(service, newQuantity) {
        serviceQuantities[service.id] = newQuantity;
        
        if (isServiceSelected(service)) {
            cartStore.update(cart => {
                const updatedServices = cart.offer.Services.map(s => {
                    if (s.id === service.id) {
                        return { ...s, quantity: newQuantity };
                    }
                    return s;
                });

                const selectedServices = updatedServices.filter(s => s.selected);
                const amounts = calculateServiceAmounts(selectedServices);

                return {
                    ...cart,
                    offer: {
                        ...cart.offer,
                        Services: updatedServices
                    },
                    selectedServices: {
                        items: selectedServices,
                        amounts: amounts,
                        totalTax: amounts.tax,
                        totalAmount: amounts.gross
                    },
                    calculatedAmounts: {
                        ...cart.calculatedAmounts,
                        total: {
                            gross: amounts.gross,
                            net: amounts.net
                        }
                    }
                };
            });
        }
    }

    function isServiceSelected(service) {
        return $cartStore?.selectedServices?.items?.some(s => s.id === service.id) ?? false;
    }

    // Group services by category
    $: groupedServices = $cartStore?.offer?.Services?.reduce((groups, service) => {
        const category = service.Kategorie || t.uncategorized;
        if (!groups[category]) {
            groups[category] = [];
        }
        groups[category].push(service);
        return groups;
    }, {}) || {};
</script>

<div class="w-full space-y-8">
    {#if $cartStore?.offer?.Services?.length > 0}
        {#each Object.entries(groupedServices) as [category, services]}
            <div class="space-y-6">
                <h2 class="text-h5 font-semibold text-text-light dark:text-text-dark mb-4">
                    {category}
                </h2>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {#each services as service (service.id)}
                        <div class="bg-background-light dark:bg-background-dark border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col md:flex-row gap-4">
                            <!-- Service Image -->
                            {#if service.image}
                                <div class="w-full md:w-1/4">
                                    <img
                                        src={service.image}
                                        alt={service.name}
                                        class="w-full h-32 object-cover rounded-lg"
                                    />
                                </div>
                            {/if}
                            
                            <!-- Service Details -->
                            <div class="flex-1">
                                <h3 class="text-h5 font-semibold mb-2 text-text-light dark:text-text-dark">
                                    {service.Name || service.title || service.name || 'Unnamed Service'}
                                </h3>
                                <p class="text-body-base text-text-light dark:text-text-dark mb-4">
                                    {service.Beschreibung || service.description || ''}
                                </p>
                                
                                <!-- Service Price -->
                                <div class="flex justify-between items-center">
                                    <p class="text-price font-semibold text-price-light dark:text-price-dark">
                                        {formatPrice(service.price, service.currency)}
                                    </p>
                                    
                                    <!-- Add/Remove Button -->
                                    <button 
                                        class="w-full mt-2 px-4 py-2 text-button font-medium text-primarybuttontext-light dark:text-primarybuttontext-dark rounded-md transition-colors duration-200 
                                        {isServiceSelected(service)
                                            ? 'bg-secondarybutton-light dark:bg-secondarybutton-dark'
                                            : 'bg-primarybutton-light dark:bg-primarybutton-dark'}
                                        focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:ring-offset-2"
                                        on:click={() => handleServiceSelection(service)}
                                    >
                                        {isServiceSelected(service) ? t.remove : t.addToBooking}
                                    </button>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/each}
    {:else}
        <div class="text-center py-8">
            <p class="text-body-base text-text-light dark:text-text-dark">{t.noAdditionalServices}</p>
        </div>
    {/if}
</div>

<style>
    :global(.prose) {
        max-width: none;
    }
    :global(.prose p) {
        margin-bottom: 0.5em;
    }
</style>
