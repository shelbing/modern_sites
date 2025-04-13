import { writable } from 'svelte/store';

export const availability = writable([]);
export const availabilityLastUpdated = writable(null);

export const loadAvailability = async () => {
    try {
        const response = await fetch('/api/ibe/unit-groups-availability');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        availability.set(data);
        availabilityLastUpdated.set(new Date().toISOString());
        return data;
    } catch (error) {
        console.error('Error loading availability:', error);
        throw error;
    }
};
