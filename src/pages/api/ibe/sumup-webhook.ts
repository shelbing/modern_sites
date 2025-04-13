import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const data = await request.json();
    console.log('SumUp Webhook received:', data);

    // Get the base URL from the request URL
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    // For now, always redirect to booking confirmation with success status
    const redirectUrl = new URL('/booking-confirmation', baseUrl);
    redirectUrl.searchParams.set('payment_provider', 'sumup');
    redirectUrl.searchParams.set('status', 'PAID');
    redirectUrl.searchParams.set('checkout_id', data.checkout_id || data.id);

    return redirect(redirectUrl.toString());
  } catch (error) {
    console.error('Error in SumUp webhook:', error);
    return redirect('/booking-failed?error=webhook_error');
  }
};
