<script>
    import { formTranslations } from "../../lib/translations";
    import { Icon } from "svelte-awesome";
    import { 
        shower, 
        image, 
        wifi, 
        tv, 
        bath,
        coffee,
        bed,
        phone,
        desktop,
        cutlery,
        lock,
        leaf
    } from "svelte-awesome/icons";

    export let amenities;
    export let language;

    $: t = formTranslations[language] || formTranslations.en;

    const amenityIcons = {
        foen: shower,
        berg: image,
        toilet: bath,
        wifi: wifi,
        tv: tv,
        coffee: coffee,
        bed: bed,
        phone: phone,
        desk: desktop,
        dining: cutlery,
        safe: lock,
        nature: leaf
    };

    const amenityTranslations = {
        foen: {
            de: "Fön",
            en: "Hair Dryer",
            fr: "Sèche-cheveux",
            es: "Secador de pelo"
        },
        berg: {
            de: "Bergblick",
            en: "Mountain View",
            fr: "Vue sur la montagne",
            es: "Vista a la montaña"
        },
        toilet: {
            de: "Separate Toilette",
            en: "Separate Toilet",
            fr: "Toilettes séparées",
            es: "Aseo separado"
        },
        wifi: {
            de: "WLAN",
            en: "WiFi",
            fr: "Wi-Fi",
            es: "WiFi"
        },
        tv: {
            de: "Flachbildfernseher",
            en: "Flat-screen TV",
            fr: "Télévision à écran plat",
            es: "Televisor de pantalla plana"
        },
        coffee: {
            de: "Kaffeemaschine",
            en: "Coffee Machine",
            fr: "Machine à café",
            es: "Cafetera"
        },
        bed: {
            de: "Komfortbett",
            en: "Comfort Bed",
            fr: "Lit confortable",
            es: "Cama confortable"
        },
        phone: {
            de: "Telefon",
            en: "Phone",
            fr: "Téléphone",
            es: "Teléfono"
        },
        desk: {
            de: "Schreibtisch",
            en: "Desk",
            fr: "Bureau",
            es: "Escritorio"
        },
        dining: {
            de: "Essbereich",
            en: "Dining Area",
            fr: "Coin repas",
            es: "Zona de comedor"
        },
        safe: {
            de: "Safe",
            en: "Safe",
            fr: "Coffre-fort",
            es: "Caja fuerte"
        },
        nature: {
            de: "Naturblick",
            en: "Nature View",
            fr: "Vue sur la nature",
            es: "Vista a la naturaleza"
        }
    };
</script>

{#if amenities && amenities.length > 0}
    <div class="mb-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
        <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">{t.amenities || 'Amenities'}</h4>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {#each amenities as amenity}
                {#if amenityIcons[amenity]}
                    <div class="flex items-center text-sm bg-white dark:bg-gray-800 p-2 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
                        <Icon
                            data={amenityIcons[amenity]}
                            class="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400"
                        />
                        <span class="text-gray-700 dark:text-gray-300">
                            {amenityTranslations[amenity]?.[language] ||
                                amenityTranslations[amenity]?.en ||
                                amenity}
                        </span>
                    </div>
                {:else}
                    <div class="flex items-center text-sm bg-white dark:bg-gray-800 p-2 rounded-md">
                        <span class="text-gray-700 dark:text-gray-300">{amenity}</span>
                    </div>
                {/if}
            {/each}
        </div>
    </div>
{/if}
