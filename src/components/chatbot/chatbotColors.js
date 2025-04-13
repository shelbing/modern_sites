/**
 * Client-side color utility for the chatbot
 * This avoids server-side configuration dependencies that cause hydration errors
 */

// Hardcoded color classes for chatbot components
export const chatbotColors = {
  // Container colors
  container: {
    bg: 'bg-gray-400 dark:bg-background-dark',
    border: 'border-gray-200 dark:border-gray-700'
  },
  // Bot message colors (using semantic color tokens)
  botMessage: {
    bg: 'bg-orange-200 dark:bg-orange-600',
    text: 'text-text-light dark:text-text-dark',
    time: 'text-textSecondary-light dark:text-textSecondary-dark'
  },
  // User message colors (using semantic color tokens)
  userMessage: {
    bg: 'bg-gray-500 dark:bg-accent-dark dark:bg-opacity-20',
    text: 'text-text-light dark:text-text-dark',
    time: 'text-textSecondary-light dark:text-textSecondary-dark'
  },
  // Input colors aligned with design system
  input: {
    bg: 'bg-input-light dark:bg-input-dark',
    border: 'border-inputBorder-light dark:border-inputBorder-dark',
    text: 'text-text-light dark:text-text-dark',
    placeholder: 'placeholder:text-textSecondary-light dark:placeholder:text-textSecondary-dark',
    focus: 'focus:border-inputFocus-light dark:focus:border-inputFocus-dark'
  },
  // Button colors - aligned with the project's design system
  button: {
    primary: 'bg-primarybutton-light text-primarybuttontext-light dark:bg-primarybutton-dark dark:text-primarybuttontext-dark rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark focus:ring-offset-2',
    secondary: 'border border-gray-300 bg-secondarybutton-light text-secondarybuttontext-light dark:bg-secondarybutton-dark dark:text-secondarybuttontext-dark rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-secondary-light dark:focus:ring-secondary-dark focus:ring-offset-2'
  }
};
