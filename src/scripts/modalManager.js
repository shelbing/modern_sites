// Global modal management system
// This file creates a shared modal manager available to all components

// Check if we're in a browser environment - crucial for Astro SSR compatibility
const isBrowser = typeof window !== 'undefined';

// Only run this code in the browser
if (isBrowser) {
  // Create the global modal manager if it doesn't exist yet
  if (!window.modalManager) {
    // First time setup - create the global modal manager
    window.modalManager = {
      // Register a show modal handler
      showModal: function(modalId) {
        console.log(`Global showModal called for: ${modalId}`);
        const modal = document.getElementById(modalId);
        if (!modal) {
          console.error(`Modal not found: ${modalId}`);
          return;
        }
        
        // Show the modal
        modal.classList.remove('hidden');
        document.body.classList.add('overflow-hidden');
        
        // Dispatch a custom event that the modal can listen for
        const event = new CustomEvent('bundleModalShown', { detail: { id: modalId } });
        document.dispatchEvent(event);
      }
    };
    
    console.log('Global modal manager created');
  }
}

// Export a safe version of the modalManager for module usage
export const modalManager = isBrowser ? window.modalManager : null;
