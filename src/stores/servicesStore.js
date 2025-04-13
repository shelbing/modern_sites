import { writable } from 'svelte/store';

export const services = writable([]);
export const servicesLoading = writable(false);
export const servicesError = writable(null);
export const servicesLastUpdated = writable(null);
