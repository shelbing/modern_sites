import { writable } from 'svelte/store';

export const rooms = writable([]);
export const roomsLoading = writable(false);
export const roomsError = writable(null);
export const roomsLastUpdated = writable(null);
