<script>
    export let message
    export let messageTime
    import { chatbotColors } from './chatbotColors.js';
    
    // Use client-side color utility instead of server-side configuration
    const userMessageBgClass = chatbotColors.userMessage.bg;
    const userMessageTextClass = chatbotColors.userMessage.text;
    const userMessageTimeClass = chatbotColors.userMessage.time;
</script>
<div class="flex items-start space-x-4 justify-end">
    <div class="flex-1 rounded-lg {userMessageBgClass} p-4 {userMessageTextClass} text-left shadow-sm border border-accent-light border-opacity-10 dark:border-accent-dark dark:border-opacity-10">
      <p class="text-left prose-sm prose-p:my-1">{message}</p>
      <p class="text-xs {userMessageTimeClass} text-left mt-2">{messageTime}</p>
    </div>
    <span class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
      <span class="flex h-full w-full items-center justify-center rounded-full bg-muted"></span>
    </span>
  </div>