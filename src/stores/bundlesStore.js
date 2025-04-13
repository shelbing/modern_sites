import { writable } from 'svelte/store';

export const bundles = writable([]);
export const bundlesLoading = writable(false);
export const bundlesError = writable(null);
export const bundlesLastUpdated = writable(null);
