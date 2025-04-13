import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { checkoutId } = await request.json();
    const sumupApiKey = import.meta.env.SUMUP_API_KEY;

    if (!checkoutId) {
      throw new Error('Checkout ID is required');
    }

    if (!sumupApiKey) {
      throw new Error('SUMUP_API_KEY is not configured');
    }

    // Check payment status with SumUp API
    const response = await fetch(`https://api.sumup.com/v0.1/checkouts/${checkoutId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sumupApiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`SumUp API Error: ${error.message || 'Unknown error'}`);
    }

    const checkout = await response.json();
    
    return new Response(JSON.stringify({
      success: true,
      status: checkout.status,
      checkout_id: checkout.id,
      checkout_reference: checkout.checkout_reference
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error checking SumUp payment status:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
