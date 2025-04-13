import { writable } from 'svelte/store';

export const availabilityStore = writable([]);
export const availabilityLoading = writable(false);
export const availabilityError = writable(null);
export const availabilityLastUpdated = writable(null);
