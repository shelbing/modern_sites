import type { APIRoute } from "astro";
// These services are used client-side in the generated HTML response
// import { stripe } from '../lib/stripe';
// import { make_booking } from '../lib/apaleo_booking';
// import { cartStore } from '../stores/cartStore';

export const GET: APIRoute = async ({ request, redirect }) => {
    const url = new URL(request.url);
    const checkoutId = url.searchParams.get('checkout_id');
    const status = url.searchParams.get('status');
    const paymentProvider = url.searchParams.get('payment_provider') || 'stripe';
    const paymentIntentId = url.searchParams.get('payment_intent');
    const paymentIntentClientSecret = url.searchParams.get('payment_intent_client_secret');
    const amount = url.searchParams.get('amount');

    console.log('Payment confirmation:', { 
        checkoutId, 
        status, 
        paymentProvider,
        paymentIntentId,
        hasClientSecret: !!paymentIntentClientSecret,
        amount
    });

    try {
        // Get the base URL from the request URL
        const baseUrl = `${url.protocol}//${url.host}`;

        // Create a confirmation page that will handle the cart data client-side
        return new Response(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Processing Payment...</title>
            </head>
            <body>
                <div id="message">Processing your payment...</div>
                <script>
                    (async function() {
                        try {
                            // Get cart data from localStorage
                            const cartData = localStorage.getItem('booking_cart_data');
                            if (!cartData) {
                                throw new Error('Cart data not found');
                            }

                            // For SumUp, redirect to checkout after storing data
                            if ('${paymentProvider}' === 'sumup') {
                                const checkoutId = localStorage.getItem('sumup_checkout_id');
                                if (!checkoutId) {
                                    throw new Error('Checkout ID not found');
                                }
                                window.location.href = '${baseUrl}/api/ibe/get-sumup-checkout?id=' + encodeURIComponent(checkoutId);
                                return;
                            }

                            // For Stripe, proceed with booking confirmation
                            const response = await fetch('${baseUrl}/api/ibe/confirm_booking', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    paymentIntentId: '${paymentIntentId || checkoutId}',
                                    paymentProvider: '${paymentProvider}',
                                    cart: JSON.parse(cartData)
                                }),
                            });

                            const result = await response.json();

                            if (!result.success) {
                                throw new Error(result.error || 'Failed to confirm booking');
                            }

                            // Clear cart data
                            localStorage.removeItem('booking_cart_data');
                            if ('${paymentProvider}' === 'sumup') {
                                localStorage.removeItem('sumup_checkout_id');
                            }

                            // Redirect to success page
                            window.location.href = '/booking-success?' + new URLSearchParams({
                                payment_provider: '${paymentProvider}',
                                amount: '${amount || ''}',
                                booking_reference: result.bookingReference || '',
                                payment_id: '${paymentIntentId || checkoutId}'
                            }).toString();
                        } catch (error) {
                            console.error('Error:', error);
                            window.location.href = '/booking-failed?error=' + encodeURIComponent(error.message || 'Unknown error');
                        }
                    })();
                </script>
            </body>
            </html>
        `, {
            status: 200,
            headers: {
                'Content-Type': 'text/html',
            },
        });
    } catch (error) {
        console.error('Error in payment confirmation:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        return redirect(`/booking-failed?error=${encodeURIComponent(errorMessage)}`);
    }
};
