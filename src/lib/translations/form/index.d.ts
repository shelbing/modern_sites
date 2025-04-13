export interface FormTranslation {
  // Common fields
  startDate: string;
  endDate: string;
  adults: string;
  children: string;
  age: string;
  search: string;
  availableOffers: string;
  price: string;
  bookNow: string;
  noOffersAvailable: string;
  description: string;
  
  // Payment & booking related fields
  bookingSuccess: string;
  bookingConfirmationSent: string;
  bookingReference: string;
  bookingId: string;
  paymentDetails: string;
  amount: string;
  payment_method?: string;
  
  // Other fields
  [key: string]: string | undefined;
}

export interface FormTranslations {
  en: FormTranslation;
  de: FormTranslation;
  fr: FormTranslation;
  es: FormTranslation;
}

export const formTranslations: FormTranslations;
