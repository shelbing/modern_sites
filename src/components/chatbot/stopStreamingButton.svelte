<script>
  import { chatbotColors } from './chatbotColors.js';
  
  // Use the standardized button styling from project's design system
  const secondaryButtonClass = chatbotColors.button.secondary;
</script>

<button class="inline-flex items-center justify-center whitespace-nowrap p-2 h-10 {secondaryButtonClass}">
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
      <rect x="6" y="6" width="12" height="12"></rect>
    </svg>
</button>