import { writable } from "svelte/store";

const initialPersonalData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  street: "",
  city: "",
  postalCode: "",
  country: "",
  comments: "",
  additionalGuests: [], // Array to store additional guest data
  isValid: false,
  errors: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    postalCode: "",
    country: "",
    additionalGuests: [], // Array to store validation errors for additional guests
  },
};

function createPersonalDataStore() {
  const { subscribe, set, update } = writable(initialPersonalData);

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validatePhone(phone) {
    // Allow +, spaces, and numbers, minimum 8 digits
    const phoneRegex =
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  }

  function validatePostalCode(postalCode, country) {
    // Basic postal code validation by country
    const postalCodeRegex = {
      DE: /^\d{5}$/,
      AT: /^\d{4}$/,
      CH: /^\d{4}$/,
      // Add more country-specific validations as needed
      default: /^[A-Z0-9]{3,10}$/i,
    };

    const regex = postalCodeRegex[country] || postalCodeRegex.default;
    return regex.test(postalCode);
  }

  return {
    subscribe,
    set,
    update,
    validate: (field, value, countryForPostal) => {
      let error = "";

      switch (field) {
        case "firstName":
          if (!value) error = "firstNameRequired";
          else if (value.length < 2) error = "firstNameTooShort";
          break;
        case "lastName":
          if (!value) error = "lastNameRequired";
          else if (value.length < 2) error = "lastNameTooShort";
          break;
        case "email":
          if (!value) error = "emailRequired";
          else if (!validateEmail(value)) error = "invalidEmail";
          break;
        case "phone":
          if (!value) error = "phoneRequired";
          else if (!validatePhone(value)) error = "invalidPhone";
          break;
        case "street":
          if (!value) error = "streetRequired";
          break;
        case "postalCode":
          if (!value) error = "postalCodeRequired";
          else if (!validatePostalCode(value, countryForPostal))
            error = "invalidPostalCode";
          break;
        case "city":
          if (!value) error = "cityRequired";
          break;
        case "country":
          if (!value) error = "countryRequired";
          break;
      }

      update((data) => {
        data.errors[field] = error;

        // Check if all required fields are valid
        const requiredFields = [
          "firstName",
          "lastName",
          "email",
          "phone",
          "street",
          "city",
          "postalCode",
          "country",
        ];
        data.isValid = requiredFields.every(
          (field) => !data.errors[field] && data[field]
        );

        return data;
      });

      return error;
    },
    reset: () => {
      set(initialPersonalData);
    },
  };
}

export const personalDataStore = createPersonalDataStore();
