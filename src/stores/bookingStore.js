import { writable, derived } from 'svelte/store';

// Create stores for booking process
export const bookingStep = writable(1);
export const error = writable(null);
export const bookingDetails = writable({
  hotelCode: '',
  offerCode: '',
  bundleCode: '',
  roomCode: '',
  roomName: '',
  arrivalDate: '',
  departureDate: '',
  adults: 0,
  childrenCount: 0,
  childrenAges: [],
  totalPrice: '',
  totalPriceRaw: 0
});

export const personalData = writable({
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  comments: '',
  phone: '',
  city: '',
  postalCode: '',
  country: ''
});

// Helper functions for booking step management
export const bookingStepActions = {
  next: () => {
    bookingStep.update(step => Math.min(step + 1, 4));
  },
  prev: () => {
    bookingStep.update(step => Math.max(step - 1, 1));
  },
  goTo: (step) => {
    if (step >= 1 && step <= 4) {
      bookingStep.set(step);
    }
  },
  reset: () => {
    bookingStep.set(1);
  }
};
