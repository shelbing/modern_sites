<script>
    import { formTranslations } from "../../lib/translations";
    import { formData } from "../../stores/formStore";
    import { cartStore } from "../../stores/cartStore";
    import { bookingStep } from "../../stores/bookingStore";
    import { offersData } from "../../stores/offersStore";
    import { get } from "svelte/store";
    import { formatPrice } from "../../lib/priceUtils";
    import { renderRichText } from "@storyblok/js";
    import RoomAmenities from "./RoomAmenities.svelte";
    import { Icon } from "svelte-awesome";
    import { user } from "svelte-awesome/icons";
    import { services } from "../../stores/servicesStore";

    export let room;
    export let offer;
    export let language;

    $: t = formTranslations[language] || formTranslations.en;
    
    function decodeAvailableServices(availableServicesString, servicesData) {
        console.log("=== Starting Service Decoding ===");
        console.log("Available Services String:", availableServicesString);
        console.log("Services Data:", JSON.stringify(servicesData, null, 2));
        
        if (!availableServicesString || !servicesData) {
            console.log("❌ Missing data:");
            console.log("availableServicesString:", availableServicesString);
            console.log("servicesData:", servicesData);
            return [];
        }
        
        // Split the comma-separated string and clean up the codes
        const servicesCodes = availableServicesString
            .split(',')
            .map(code => code.trim())
            .filter(code => code.length > 0);
            
        console.log("🔍 Service Codes after split:", servicesCodes);
        console.log("Available service codes in servicesData:", servicesData.map(s => s.Code));
        
        // Map the codes to full service objects
        const decodedServices = servicesCodes
            .map(code => {
                console.log(`\nLooking for service with code "${code}"`);
                // Find service by Code
                const service = servicesData.find(s => {
                    console.log(`Comparing with service:`, {
                        Code: s.Code,
                        Name: s.Name
                    });
                    const matches = s.Code === code;
                    console.log(`Match found: ${matches}`);
                    return matches;
                });
                
                if (!service) {
                    console.log(`❌ No service found for code: ${code}`);
                } else {
                    console.log(`✅ Found service:`, {
                        Code: service.Code,
                        Name: service.Name,
                        Price: service.Standardpreis
                    });
                }
                return service;
            })
            .filter(service => {
                const valid = service !== undefined;
                if (!valid) {
                    console.log("❌ Filtered out undefined service");
                }
                return valid;
            })
            .map(service => {
                console.log("\nProcessing service:", service.Code);
                const price = parseFloat(service.Standardpreis || 0);
                const taxRate = service.Steuer ? parseFloat(service.Steuer) / 100 : 0.19;
                const taxAmount = price * taxRate;
                const netAmount = price - taxAmount;

                // Preserve all original fields and add calculated ones
                const decoded = {
                    ...service, // Keep all original fields
                    id: service.Code, // Use Code as ID
                    price: price,
                    currency: service.Currency || 'EUR',
                    taxRate: taxRate,
                    taxAmount: taxAmount,
                    netAmount: netAmount,
                    selected: false,
                    quantity: 0,
                    pricePerUnit: price
                };
                console.log("✅ Decoded service:", {
                    id: decoded.id,
                    Name: decoded.Name,
                    price: decoded.price,
                    selected: decoded.selected,
                    quantity: decoded.quantity
                });
                return decoded;
            });
            
        console.log("\n=== Final Results ===");
        console.log("Number of decoded services:", decodedServices.length);
        console.log("Decoded services:", decodedServices.map(s => ({
            Code: s.Code,
            Name: s.Name,
            price: s.price
        })));
        return decodedServices;
    }

    function handleBooking() {
        console.log("\n=== Starting Booking Process ===");
        console.log("Full offer object:", offer);
        const servicesData = get(services);
        console.log("Services data from store:", servicesData);
        
        const currentFormData = get(formData);
        // Find matching offer to get longRatePlan
        const matchingOffer = offer.offers.find(
            (o) => o.room.RoomCode === room.room.RoomCode,
        );
        console.log("Matching Offer:", matchingOffer);
        const longRatePlan = matchingOffer?.ratePlan?.id;
        console.log("Long Rate Plan:", longRatePlan);

        // Decode available services using the services from services store
        console.log("\n=== Decoding Services ===");
        console.log("Available Services String:", offer.AvailableServices);
        console.log("Services Data:", servicesData);
        const availableServices = decodeAvailableServices(
            offer.AvailableServices, 
            servicesData
        );
        console.log("Decoded Services:", availableServices);

        const bookingData = {
            booking: {
                arrival: room.arrival,
                departure: room.departure,
            },
            room: {
                Title: room.room?.Title,
                TagLine: room.room?.TagLine,
                Groesse: room.room?.Groesse,
                Beschreibung: room.room?.Beschreibung,
                Image: room.room?.Image,
                totalGrossAmount: room.totalGrossAmount,
                roomCode: room.RoomCode,
                currency: room.totalGrossAmount?.currency || 'EUR'
            },
            ratePlan: {
                ratePlan: room.ratePlan?.code,
                longRatePlan: longRatePlan,
                description: room.ratePlan?.description,
                id: room.ratePlan?.description,
                name: room.ratePlan?.name,
            },
            timeSlices: room.timeSlices,
            offer: {
                Title: offer.Title,
                Beschreibung: offer.Beschreibung,
                TeaserImage: offer.TeaserImage,
                AvailableServices: offer.AvailableServices || '',
                Services: availableServices,
                AnzahlungProzent: offer.AnzahlungProzent || 0,
                PreisanpassungProzent: offer.PreisanpassungProzent || 0,
                currency: room.totalGrossAmount?.currency || 'EUR'
            },
            searchData: {
                startDate: currentFormData.startDate,
                endDate: currentFormData.endDate,
                adults: currentFormData.adults,
                childrenCount: currentFormData.childrenCount,
                childrenAges: currentFormData.childrenAges,
            },
            calculatedAmounts: room.calculatedAmounts,
            selectedServices: {
                items: [],
                amounts: {
                    net: 0,
                    gross: 0,
                    tax: 0
                }
            }
        };

        console.log("Final booking data:", bookingData);

        cartStore.set(bookingData);
        bookingStep.set(2);
    }

    $: renderedDescription = room.room?.Beschreibung?.content
        ? renderRichText(room.room.Beschreibung)
        : "Keine Beschreibung";

    $: guestsText = (count) => {
        const texts = {
            de: ["Gast", "Gäste"],
            en: ["Guest", "Guests"],
            fr: ["Invité", "Invités"],
            es: ["Huésped", "Huéspedes"],
        };
        return (
            texts[language]?.[count === 1 ? 0 : 1] ||
            texts.en[count === 1 ? 0 : 1]
        );
    };
</script>

<div
    class="bg-background-light dark:bg-background-dark shadow-md rounded-lg overflow-hidden mb-3 transition-all duration-300 hover:shadow-lg"
>
    <div class="relative">
        {#if room.room?.Image?.filename}
            <img
                src={room.room.Image.filename}
                alt={room.room?.Title || "Room image"}
                class="w-full h-48 object-cover"
            />
        {:else}
            <div
                class="w-full h-48 bg-paper-light dark:bg-paper-dark flex items-center justify-center"
            >
                <span class="text-textSecondary-light dark:text-textSecondary-dark text-xs"
                    >No image available</span
                >
            </div>
        {/if}
        <div
            class="absolute bottom-0 left-0 right-0 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark p-2"
        >
            <h3 class="text-base ml-4 font-semibold">{room.room?.Title}</h3>
        </div>
        <div
            class="absolute top-0 left-4 bg-price-light dark:bg-price-dark text-white px-2 py-1 m-2 rounded-full text-xs font-semibold"
        >
            {room.room?.Groesse} m²
        </div>
        <div
            class="absolute top-0 right-0 bg-price-light dark:bg-price-dark text-white px-2 py-1 m-2 rounded-full text-xs font-semibold"
        >
            {formatPrice(room.calculatedAmounts.total.gross)}
        </div>
        {#if room.room?.MaxPersonen}
            <div
                class="absolute top-12 right-0 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark px-2 py-1 m-2 rounded-full flex items-center"
            >
                {#each Array(room.room.MaxPersonen) as _, i}
                    <Icon data={user} class="w-4 h-4 inline-block mr-1" />
                {/each}
                <span class="text-xs font-semibold ml-1"
                    >{room.room.MaxPersonen}
                    {guestsText(room.room.MaxPersonen)}</span
                >
            </div>
        {/if}
    </div>
    <div class="p-4">
        {#if room.room?.TagLine}
            <p class="text-lg text-text-light dark:text-text-dark mb-2">
                {room.room.TagLine}
            </p>
        {/if}
        {#if renderedDescription}
            <div
                class="text-sm text-text-light dark:text-text-dark mb-3 rich-text"
            >
                {@html renderedDescription}
            </div>
        {/if}
        <RoomAmenities amenities={room.room?.Ausstattung} {language} />

        <button
            class="px-4 py-2 bg-primarybutton-light dark:bg-primarybutton-dark text-primarybuttontext-light dark:text-primarybuttontext-dark rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:ring-offset-2 text-sm"
            on:click={handleBooking}
        >
            {t.bookNow}
        </button>
    </div>
</div>

<style>
    .rich-text :global(p) {
        text-align: justify !important;
        margin-bottom: 1rem;
    }
</style>
