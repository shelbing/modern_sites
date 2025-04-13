// Form for the current offers data

import { writable } from "svelte/store";

export const offersData = writable(null);
export const isLoading = writable(false);
export const error = writable(null);
export const offersLastUpdated = writable(null);
