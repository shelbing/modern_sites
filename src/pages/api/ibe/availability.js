import { getAvailability } from "./apaleo.js";

export const prerender = false;

export async function GET({ request }) {
    try {
        const url = new URL(request.url);
        const startDate = url.searchParams.get('start');
        const days = parseInt(url.searchParams.get('days') || '7');
        const hotel = url.searchParams.get('hotel');

        // Validate required parameters
        if (!startDate || !hotel) {
            return new Response(JSON.stringify([]), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Get availability from Apaleo
        const availability = await getAvailability(startDate, days, hotel);

        // Return the availability data
        return new Response(JSON.stringify(availability), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("Error in availability:", error);
        return new Response(JSON.stringify([]), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
