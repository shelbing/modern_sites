import type { APIRoute } from "astro";
import Stripe from "stripe";
import { getStripeConfig } from "../../../lib/env";
import { make_booking } from "../../../lib/apaleo_booking";

export const prerender = false;

const config = getStripeConfig();
const stripe = new Stripe(config.secretKey, {
  //apiVersion: config.apiVersion,
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    console.log("Received request data:", data); // Debug log

    const { paymentIntentId, paymentProvider, cart } = data;

    if (!paymentIntentId) {
      throw new Error("Payment Intent ID is required");
    }

    console.log("Verifying payment intent:", paymentIntentId); // Debug log
    if (!cart) {
      throw new Error('Cart data is required');
    }

    let verifiedPayment = false;
<<<<<<< HEAD
    let paymentIntent;
=======
      // For SumUp, we trust the PAID status from the webhook
      verifiedPayment = true;
    } else if (paymentProvider === 'stripe') {
      // Verify Stripe payment
<<<<<<< HEAD
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
=======
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
>>>>>>> d5960872730481dc4cfb84c5f96df42837be303e
    console.log('Payment intent status:', paymentIntent.status);
    verifiedPayment = paymentIntent.status === 'succeeded';
  }

    if (!verifiedPayment) {
    throw new Error('Payment not verified');
  }

  // Create booking in Apaleo
  const apaleoBooking = await make_booking({
<<<<<<< HEAD
    cartItems: cart,
    paymentIntentId
  });

  return new Response(
    JSON.stringify({
      success: true,
      bookingReference: apaleoBooking.reservationNumber,
      paymentStatus: paymentIntent ? paymentIntent.status : 'paid',
      bookingId: apaleoBooking.bookingId
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
=======
      cart,
      paymentIntentId
    });

    return new Response(JSON.stringify({
      success: true,
      bookingReference: apaleoBooking.reservationNumber,
      bookingId: apaleoBooking.bookingId
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
>>>>>>> d5960872730481dc4cfb84c5f96df42837be303e
    }
  );
} catch (error) {
  console.error("Error confirming booking:", error);
  return new Response(
    JSON.stringify({
      success: false,
      error:
        error instanceof Error ? error.message : "Unknown error occurred",
    }),
    {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
};
