<script>
    import UserMessageInput from "./userMessageInput.svelte";
    import { chatbotColors } from './chatbotColors.js';
    
    export let input, stop, handleSubmit
    import { afterUpdate } from 'svelte';
    
    // Use client-side color utility instead of server-side configuration
    const containerBgClass = chatbotColors.container.bg;
    const containerBorderClass = chatbotColors.container.border;
    
    let scrollContainer;
    afterUpdate(() => {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    });
</script>
<div class="w-full bg-gray-50 dark:bg-gray-900" style="--tw-bg-opacity: 1;">
    <div class="relative w-full">
      <div class="w-full z-10 flex flex-col rounded-2xl {containerBgClass} border {containerBorderClass} p-4 md:p-6">

        <div class="mt-4 flex-1 overflow-y-auto h-[600px] w-full py-4 hide-scrollbar" bind:this={scrollContainer}>
          <div class="flex flex-col space-y-4 w-full min-h-[300px]">
            <slot></slot>
          </div>
        </div>
        <UserMessageInput input={input} handleSubmit={handleSubmit} stop={stop}/>
      </div>
    </div>
  </div>

  <style>
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
  
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  </style>