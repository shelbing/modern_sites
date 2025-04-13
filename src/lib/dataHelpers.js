export function calculateNumberOfNights(arrival, departure) {
  const arrivalDate = new Date(arrival);
  const departureDate = new Date(departure);
  const diffTime = Math.abs(departureDate - arrivalDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
