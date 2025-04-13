/**
 * TypeScript declarations for apaleo_booking.js
 */

interface BookingData {
  paymentIntentId: string;
  cart: {
    personalData: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      address?: {
        addressLine1?: string;
        addressLine2?: string;
        postalCode?: string;
        city?: string;
        countryCode?: string;
      };
    };
    searchData: {
      arrivalDate: string;
      departureDate: string;
      adults: number;
      children?: number;
      propertyId?: string;
      ratePlanId?: string;
    };
    calculatedAmounts: {
      totalAmount: number;
      currency: string;
    };
    ratePlan?: {
      id: string;
      name?: string;
    };
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Creates a booking in the Apaleo system
 * @param bookingData The booking data including payment and cart information
 * @returns Promise with the booking result containing confirmation details
 */
export function make_booking(bookingData: BookingData): Promise<any>;
