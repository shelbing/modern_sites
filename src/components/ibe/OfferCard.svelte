<script>
    import { formTranslations } from "../../lib/translations";
    import RoomOption from "./RoomOption.svelte";
    import { formData } from "../../stores/formStore";
    import { formatPrice } from "../../lib/priceUtils";
    import { renderRichText } from "@storyblok/js";

    export let offer;
    export let language;

    let showRoomOptions = false;

    $: t = formTranslations[language] || formTranslations.en;
    $: pricePerNight =
        $formData.lengthOfStay > 0
            ? offer.cheapestOffer / $formData.lengthOfStay
            : offer.cheapestOffer;
    $: roomOptionsCount = offer.offers ? offer.offers.length : 0;
    $: roomOptionsText = roomOptionsCount === 1 ? t.roomOption : t.roomOptions;
    $: renderedDescription = offer?.Beschreibung?.content
        ? renderRichText(offer.Beschreibung)
        : "Keine Beschreibung";
</script>

<div class="bg-background-light dark:bg-background-dark shadow-md rounded-lg p-4 mb-6">
    <div
        class="flex justify-between items-center mb-3 bg-paper-light dark:bg-paper-dark p-2 rounded-lg"
    >
        <h1 class="text-h4 font-semibold text-text-light dark:text-text-dark">
            {offer.Title}
        </h1>
        <span
            class="bg-price-light text-white dark:bg-price-dark dark:text-white px-3 py-1 rounded-full text-body-sm font-semibold"
        >
            {t.from}
            {formatPrice(offer.cheapestOffer)}
        </span>
    </div>
    <div class="flex flex-col md:flex-row gap-4">
        <div class="md:w-1/3">
            {#if offer.TeaserImage?.filename}
                <img
                    src={offer.TeaserImage.filename}
                    alt={offer.Title}
                    class="w-full h-auto rounded-lg shadow-md"
                />
            {:else}
                <div
                    class="w-full h-48 bg-background-light dark:bg-background-dark rounded-lg flex items-center justify-center"
                >
                    <span class="text-text-light dark:text-text-dark"
                        >No image available</span
                    >
                </div>
            {/if}
        </div>
        <div class="md:w-2/3">
            <p class="text-text-light dark:text-text-dark rich-text text-sm">
                {@html renderedDescription}
            </p>
        </div>
    </div>
    <div class="mt-4">
        <button
            type="button"
            class="w-full text-left p-2 rounded-lg transition-colors duration-300 {showRoomOptions
                ? 'bg-button-light dark:bg-button-dark text-buttontext-light dark:text-buttontext-dark'
                : 'bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark'}"
            on:click={() => (showRoomOptions = !showRoomOptions)}
        >
            <h2
                class="text-h5 font-semibold mb-2 flex justify-between items-center"
            >
                <span>
                    {roomOptionsCount}
                    {roomOptionsText}
                </span>
                <span class="text-price text-price-light dark:text-price-dark">
                    {t.from}
                    {formatPrice(pricePerNight)} / {t.night}
                    <span class="ml-2">{showRoomOptions ? "▼" : "▶"}</span>
                </span>
            </h2>
        </button>
        {#if showRoomOptions}
            {#if offer.offers && offer.offers.length > 0}
                {#each offer.offers as room}
                    <RoomOption {room} {language} {offer} />
                {/each}
            {:else}
                <p class="text-sm text-text-light dark:text-text-dark">
                    {t.noRoomOptions}
                </p>
            {/if}
        {/if}
    </div>
</div>

<style>
    .rich-text :global(p) {
        text-align: justify !important;
        margin-bottom: 1rem;
    }
</style>
