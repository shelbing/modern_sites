// Store for the form data of the booking engine

import { writable, derived } from "svelte/store";

export const formData = writable({
  startDate: "",
  endDate: "",
  adults: 1,
  childrenCount: 0,
  childrenAges: [],
  interests: [],
  lengthOfStay: 0,
});
