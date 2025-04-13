import { writable } from 'svelte/store';

function createCartStore() {
    const { subscribe, set, update } = writable({});

    return {
        subscribe,
        set: (value) => {
            // Also store in sessionStorage for persistence
            sessionStorage.setItem('cartData', JSON.stringify(value));
            set(value);
        },
        update,
        get: () => {
            // Retrieve from sessionStorage
            const storedData = sessionStorage.getItem('cartData');
            return storedData ? JSON.parse(storedData) : null;
        },
        reset: () => {
            sessionStorage.removeItem('cartData');
            set({});
        }
    };
}

export const cartStore = createCartStore();
