<script>
    import SubmitMessageButton from "./submitMessageButton.svelte";
    import StopStreamingButton from "./stopStreamingButton.svelte";
    import { chatbotColors } from './chatbotColors.js';
    
    export let input, stop, handleSubmit
    
    // Use client-side color utility for input styling
    const inputBg = chatbotColors.input.bg;
    const inputBorder = chatbotColors.input.border;
    const inputText = chatbotColors.input.text;
    const inputPlaceholder = chatbotColors.input.placeholder;
    const inputFocus = chatbotColors.input.focus;
</script>

<div class="mt-4 space-x-2">
    <form on:submit={handleSubmit} class="flex flex-row justify-between">
        <input bind:value={$input}
            class="flex h-10 mr-4 w-full border {inputBorder} ring-offset-background file:border-0 file:bg-transparent
             file:text-lg file:font-bold {inputPlaceholder} text-lg
             focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
             disabled:cursor-not-allowed disabled:opacity-50 flex-1 rounded-lg {inputBg} 
             px-4 py-2 {inputText} focus:outline-none"
            placeholder="Wie kann ich Dir helfen? ......"
            type="text" />
        <button class="mr-2" on:click={stop}><StopStreamingButton/></button>
        <button type="submit"><SubmitMessageButton/></button>
    </form>
</div>

