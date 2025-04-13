export interface PersonalData {
    firstName: string;
    lastName: string;
    email: string;
    street: string;
    zipCode: string;
    comments?: string;
}

export interface BookingData {
    cart: {
        room: {
            Title: string;
            totalGrossAmount: {
                amount: number;
                currency: string;
            };
            // ... other room properties
        };
        personalData: PersonalData;
        // ... other cart properties
    };
}

export interface PaymentIntentResponse {
    clientSecret: string;
    paymentIntentId: string;
    availablePaymentMethods: string[];
}

export interface BookingConfirmationResponse {
    success: boolean;
    bookingReference: string;
    bookingId: string;
}
