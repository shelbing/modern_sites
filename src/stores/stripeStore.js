import { writable } from 'svelte/store';

const initialState = {
    clientSecret: null,
    paymentIntentId: null,
    paymentStatus: null,
    bookingReference: null,
    availablePaymentMethods: [],
    payment_provider: import.meta.env.PUBLIC_PAYMENT_PROVIDER || 'stripe',
    provider_specific: null,
    errorMessage: null
};

export const stripeStore = writable(initialState);

// Helper function to update store with payment intent response
export const updateWithPaymentIntent = (store, response) => {
    store.update(state => ({
        ...state,
        clientSecret: response.clientSecret,
        paymentIntentId: response.paymentIntentId,
        paymentStatus: response.status || 'pending',
        provider_specific: response.provider_specific || null
    }));
};
