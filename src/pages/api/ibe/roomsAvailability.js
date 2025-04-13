export const prerender = false;
import { checkUnitGroupAvailability, calculateEndDate } from '../../../lib/apaleoAvailability.js';

export async function GET({ request }) {
    try {
        const url = new URL(request.url);
        const categories = url.searchParams.get('categories') || '';
        const anreiseVon = url.searchParams.get('anreiseVon') || '';
        const anreiseBis = url.searchParams.get('anreiseBis') || '';
        const ratePlan = url.searchParams.get('ratePlan') || '';
        
        // Log the received parameters to the terminal
        console.log('Parameters received in roomsAvailability endpoint:');
        console.log('- Categories:', categories);
        console.log('- AnreiseVon:', anreiseVon);
        console.log('- AnreiseBis:', anreiseBis);
        console.log('- RatePlan:', ratePlan);
        
        // Split categories into an array if it's a comma-separated string
        const categoriesArray = categories.split(',').filter(cat => cat.trim().length > 0);
        
        // Process dates if available
        let formattedAnreiseVon = '';
        let formattedAnreiseBis = '';
        let availabilityData = null;
        
        if (anreiseVon) {
            try {
                const date = new Date(anreiseVon);
                formattedAnreiseVon = date.toISOString().split('T')[0]; // YYYY-MM-DD format
            } catch (e) {
                console.warn('Invalid AnreiseVon date format:', anreiseVon);
            }
        }
        
        if (anreiseBis) {
            try {
                const date = new Date(anreiseBis);
                formattedAnreiseBis = date.toISOString().split('T')[0]; // YYYY-MM-DD format
            } catch (e) {
                console.warn('Invalid AnreiseBis date format:', anreiseBis);
            }
        }
        
        // Check availability if we have all required data
        if (formattedAnreiseVon && formattedAnreiseBis && categoriesArray.length > 0) {
            try {
                // Calculate the end date for availability check (AnreiseBis + 14 days, max 360 days from today)
                const availabilityEndDate = calculateEndDate(formattedAnreiseBis);
                
                console.log(`Checking availability from ${formattedAnreiseVon} to ${availabilityEndDate} for categories:`, categoriesArray);
                
                // Call the Apaleo API to check availability
                availabilityData = await checkUnitGroupAvailability(
                    formattedAnreiseVon,
                    availabilityEndDate,
                    categoriesArray
                );
                
                console.log('Successfully retrieved availability data from Apaleo');
            } catch (error) {
                console.error('Error checking availability:', error.message);
            }
        } else {
            console.log('Missing required data for availability check');
        }
        
        // Return the processed data
        return new Response(JSON.stringify({
            success: true,
            categories: categoriesArray,
            arrivalDateRange: {
                from: formattedAnreiseVon,
                to: formattedAnreiseBis
            },
            ratePlan: ratePlan,
            availability: availabilityData ? availabilityData.processed : null,
            rawData: availabilityData ? availabilityData.raw : null
        }), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error("Error in roomsAvailability endpoint:", error);
        return new Response(JSON.stringify({
            success: false,
            message: "Error processing room availability",
            error: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
