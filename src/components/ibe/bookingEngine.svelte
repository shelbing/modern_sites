<script lang="ts">
  /**
   * Internet Booking Engine (IBE) Core Component
   *
   * This Svelte component implements the core booking engine functionality,
   * managing the complete hotel booking process through multiple steps:
   *
   * Props:
   * @prop {string} language - The current interface language
   * @prop {string} hotelCode - The property code for API requests
   */

  import { bookingStep } from "../../stores/bookingStore";
  import BookingStep1 from "./bookingStep1.svelte";
  import BookingStep2 from "./bookingStep2.svelte";
  import BookingStep3 from "./bookingStep3.svelte";
  import BookingStep4 from "./bookingStep4.svelte";
  import BookingStep5 from "./bookingStep5.svelte";
  import StoreDebugger from "./StoreDebugger.svelte";
  import BookingSearchForm from "./bookingSearchForm.svelte";
  import { renderRichText, storyblokInit } from "@storyblok/js";

  // Initialize Storyblok SDK
  storyblokInit({
    accessToken: "Dx41MBbOcQA5PNgaR2riIgtt", // Replace with your actual access token
  });
  export let language;
  export let hotelCode;

  const showDebugger = false; // Hidden by default, use Ctrl+Shift+D to show
</script>

<div class="bg-background-light dark:bg-background-dark my-2 rounded-2xl">
  <BookingSearchForm {language} {hotelCode} />
  {#if $bookingStep === 1}
    <BookingStep1 {language} />
  {:else if $bookingStep === 2}
    <BookingStep2 {language} />
  {:else if $bookingStep === 3}
    <BookingStep3 {language} />
  {:else if $bookingStep === 4}
    <BookingStep4 {language} />
  {:else if $bookingStep === 5}
    <BookingStep5 {language} />
  {/if}

  <StoreDebugger visible={showDebugger} />
</div>
