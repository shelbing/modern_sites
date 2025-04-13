<script>
  import { chatbotColors } from './chatbotColors.js';
  
  // Use the standardized button styling from project's design system
  const primaryButtonClass = chatbotColors.button.primary;
</script>

<button class="inline-flex items-center justify-center whitespace-nowrap p-2 h-10 {primaryButtonClass}">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="h-5 w-5"
    >
      <path d="m22 2-7 20-4-9-9-4Z"></path>
      <path d="M22 2 11 13"></path>
    </svg>
  </button>