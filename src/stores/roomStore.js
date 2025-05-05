import { writable } from 'svelte/store';

// Create a writable store with initial empty state
export const roomData = writable({
  isLoaded: false,
  isLoading: false,
  data: [],      // availability data
  rooms: [],     // room data
  services: [],  // services data
  error: null,
  lastFetched: null,
  startDate: null,
  endDate: null,
  currentBundle: null  // current active bundle
});

// Function to load room data into the store
export function loadRoomData(data) {
  roomData.update(state => ({
    ...state,
    isLoaded: true,
    isLoading: false,
    data: data,
    lastFetched: new Date()
  }));
}

// Function to load rooms data into the store
export function loadRoomsData(rooms) {
  roomData.update(state => ({
    ...state,
    rooms: rooms || []
  }));
}

// Function to load services data into the store
export function loadServicesData(services) {
  roomData.update(state => ({
    ...state,
    services: services || []
  }));
}

// Function to set current bundle
export function setCurrentBundle(bundle) {
  roomData.update(state => ({
    ...state,
    currentBundle: bundle
  }));
}

// Function to set loading state
export function setRoomDataLoading(isLoading) {
  roomData.update(state => ({
    ...state,
    isLoading
  }));
}

// Function to set error state
export function setRoomDataError(error) {
  roomData.update(state => ({
    ...state,
    isLoading: false,
    error
  }));
}

// Set start date
export function setStartDate(date) {
  console.log('[roomStore] setStartDate called with:', date);
  roomData.update(state => ({
    ...state,
    startDate: date
  }));
}

// Set end date
export function setEndDate(date) {
  console.log('[roomStore] setEndDate called with:', date);
  roomData.update(state => ({
    ...state,
    endDate: date
  }));
}

// Function to filter room data by date range
export function filterRoomDataByDateRange(arrivalDate, departureDate) {
  if (!arrivalDate || !departureDate) return [];
  
  let filteredData = [];
  
  roomData.update(state => {
    if (!state.isLoaded || !state.data || state.data.length === 0) {
      return state;
    }
    
    const arrivalTime = new Date(arrivalDate).getTime();
    const departureTime = new Date(departureDate).getTime();
    
    filteredData = state.data.filter(item => {
      const itemDate = new Date(item.date).getTime();
      return itemDate >= arrivalTime && itemDate <= departureTime;
    });
    
    return state;
  });
  
  return filteredData;
}
