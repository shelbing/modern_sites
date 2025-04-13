import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ request, redirect }) => {
    const url = new URL(request.url);
    const checkoutId = url.searchParams.get('id');

    if (!checkoutId) {
        return redirect('/booking-failed?error=missing_checkout_id');
    }

    try {
        const sumupApiKey = import.meta.env.SUMUP_API_KEY;
        if (!sumupApiKey) {
            throw new Error("SUMUP_API_KEY is not configured");
        }

        // Get checkout details from SumUp
        const response = await fetch(`https://api.sumup.com/v0.1/checkouts/${checkoutId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${sumupApiKey}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('SumUp API Error Response:', error);
            throw new Error(`SumUp API Error: ${error.message || 'Unknown error'}`);
        }

        const checkout = await response.json();
        console.log('Retrieved SumUp checkout:', checkout);

        if (!checkout.links?.payment_url) {
            throw new Error('No payment URL found in checkout');
        }

        // Redirect to SumUp's payment page
        return redirect(checkout.links.payment_url);
    } catch (error) {
        console.error('Error getting SumUp checkout:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return redirect(`/booking-failed?error=${encodeURIComponent(errorMessage)}`);
    }
};
