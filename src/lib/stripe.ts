import Stripe from "stripe";

function validateEnv() {
  const requiredEnvVars = ["PUBLIC_STRIPE_KEY", "STRIPE_SECRET_KEY"];
  for (const envVar of requiredEnvVars) {
    if (!import.meta.env[envVar]) {
      throw new Error(`Missing required environment variable: ${envVar}`);
    }
  }
}

export function getStripeConfig() {
  validateEnv();
  return {
    publicKey: import.meta.env.PUBLIC_STRIPE_KEY,
    secretKey: import.meta.env.STRIPE_SECRET_KEY,
    apiVersion: "2024-09-30.acacia" as const,
  };
}

const config = getStripeConfig();
const stripe = new Stripe(config.secretKey, {
  apiVersion: config.apiVersion,
});

export { stripe };

export async function createPaymentIntent(
  amount: number,
  currency: string = "eur"
) {
  try {
    console.log("Creating payment intent with amount:", amount);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      payment_method_types: [
        "card", // Credit & Debit cards
        "ideal", // iDEAL (Netherlands)
        "sofort", // SOFORT (Germany, Austria)
        "giropay", // Giropay (Germany)
        "sepa_debit", // SEPA Direct Debit
        "bancontact", // Bancontact (Belgium)
        "eps", // EPS (Austria)
        "p24", // Przelewy24 (Poland)
      ],
      metadata: {
        integration_check: "accept_a_payment",
      },
      payment_method_options: {
        sofort: {
          preferred_language: "de",
        },
        card: {
          request_three_d_secure: "automatic",
        },
      },
    });

    console.log("Payment intent created:", {
      id: paymentIntent.id,
      availablePaymentMethods: paymentIntent.payment_method_types,
    });

    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      availablePaymentMethods: paymentIntent.payment_method_types,
    };
  } catch (error) {
    console.error("Error creating payment intent:", error);
    if (error instanceof Stripe.errors.StripeError) {
      console.error("Stripe error details:", {
        type: error.type,
        code: error.code,
        message: error.message,
      });
    }
    throw new Error("Failed to initialize payment");
  }
}
