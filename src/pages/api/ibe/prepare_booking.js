import { loadEnv } from 'vite';

export const prerender = false;

export async function POST({ request }) {
    try {
        const bookingData = await request.json();

        // Load environment variables
        const env = loadEnv('', process.cwd(), '');
        const propertyCode = env.PROPERTY || 'szs';
        const apaleoPropertyId = env.APALEO_PROPERTY_ID || 'SZS';
        const useTestWebhook = env.USE_TEST_WEBHOOK === 'true';

        // Add hotel codes to the booking data
        const enrichedBookingData = {
            ...bookingData,
            propertyCode,
            apaleoPropertyId
        };

        // Enhanced logging for booking data
        console.log("=== PREPARE BOOKING API CALLED ====");
        console.log("Booking data received:", JSON.stringify(enrichedBookingData, null, 2));
        console.log("Property Code:", propertyCode);
        console.log("Apaleo Property ID:", apaleoPropertyId);

        // Determine which webhook URL to use based on environment variable
        const productionWebhookUrl = env.WEBHOOK_URL_PRODUCTION || "https://n8n.siriushms.com/webhook/6526802d-baff-4528-b612-0600e2d9150c";
        const testWebhookUrl = env.WEBHOOK_URL_TEST || "https://n8n.siriushms.com/webhook-test/6526802d-baff-4528-b612-0600e2d9150c";
        const webhookUrl = useTestWebhook ? testWebhookUrl : productionWebhookUrl;

        console.log(`=== WEBHOOK CONFIGURATION ===`)
        console.log(`Using ${useTestWebhook ? 'TEST' : 'PRODUCTION'} webhook: ${webhookUrl}`);
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`Stripe Mode: ${env.STRIPE_MODE || 'test'}`);
        console.log(`=== END WEBHOOK CONFIGURATION ===`);

        try {
            const webhookResponse = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(enrichedBookingData)
            });

            // Enhanced logging for webhook response
            console.log("=== WEBHOOK RESPONSE RECEIVED ====");
            console.log("Response status:", webhookResponse.status);
            console.log("Response headers:", Object.fromEntries(webhookResponse.headers.entries()));

            // Get and log the response body
            const webhookResult = await webhookResponse.json();
            console.log("Webhook response summary:", {
                Status: webhookResult.Status,
                Payment_ID: webhookResult.Payment_ID,
                Booking_ID: webhookResult.Booking_ID,
                Error_Reason: webhookResult.Error_Reason || 'None'
            });
            console.log("Full webhook response data:", JSON.stringify(webhookResult, null, 2));
            
            // Validate the webhook response contains required Stripe data
            if (webhookResult.Status === "Success" && !webhookResult.Payment_ID) {
                console.error("ERROR: Webhook response is missing Payment_ID (Stripe client secret)");
                throw new Error("Missing payment information from payment service");
            }

            // Process the webhook response to ensure it has the correct structure for Stripe
            const processedWebhookResult = {
                ...webhookResult,
                // Ensure the Payment_ID is properly formatted as a Stripe client secret if it's not already
                Payment_ID: webhookResult.Payment_ID && !webhookResult.Payment_ID.startsWith('pi_') 
                    ? `pi_${webhookResult.Payment_ID}_secret_${Date.now().toString(36)}` 
                    : webhookResult.Payment_ID,
                // Add provider-specific data if needed
                provider_specific: webhookResult.provider_specific || null
            };
            
            console.log("=== PROCESSED WEBHOOK RESPONSE ====");
            console.log("Processed Payment_ID:", processedWebhookResult.Payment_ID);
            console.log("Processed Booking_ID:", processedWebhookResult.Booking_ID);
            
            // Return the API response with the processed webhook response included
            return new Response(JSON.stringify({
                success: true,
                message: "Booking data received and payment intent created successfully",
                webhookResponse: processedWebhookResult
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (webhookError) {
            console.error("=== WEBHOOK ERROR ====");
            console.error("Error posting to webhook:", webhookError);
            console.error("Error details:", webhookError.stack || 'No stack trace available');

            // Return an error response if the webhook call fails
            return new Response(JSON.stringify({
                success: false,
                message: "Error forwarding data to webhook",
                error: webhookError.message
            }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    } catch (error) {
        console.error("=== API ERROR ====");
        console.error("Error processing booking data:", error);
        console.error("Error details:", error.stack || 'No stack trace available');
        return new Response(JSON.stringify({
            success: false,
            message: "Error processing booking data",
            error: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
