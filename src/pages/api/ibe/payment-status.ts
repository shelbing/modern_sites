import type { APIRoute } from "astro";
// Store would be used for persistent payment tracking in a future implementation
// import { stripeStore } from "../../../stores/stripeStore";

export const POST: APIRoute = async ({ request }) => {
    try {
        const data = await request.json();
        console.log('Received payment status webhook:', data);
        
        // Handle SumUp webhook notification
        if (data.event_type === 'PAYMENT_STATUS_CHANGED') {
            const paymentStatus = data.payload.status;
            const checkoutId = data.payload.checkout_id;
            
            // TODO: Update payment status in your system
            // This would typically involve updating a database
            // For now, we'll just log it
            console.log(`Payment status updated for checkout ${checkoutId}: ${paymentStatus}`);
        }
        
        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error processing payment webhook:', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return new Response(JSON.stringify({ 
            success: false, 
            error: errorMessage 
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
};
