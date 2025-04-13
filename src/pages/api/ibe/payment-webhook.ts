import type { APIRoute } from "astro";
import { PaymentService } from "../../../services/payment/PaymentService";

export const prerender = false;

export const POST: APIRoute = async ({ request, params }) => {
  try {
    console.log("Payment webhook received");
    
    // Get the provider from the request or URL params
    const url = new URL(request.url);
    const providerId = params.provider || url.searchParams.get('provider');
    
    // Extract the signature from headers if available
    // Different providers use different header names for signatures
    const signature = 
      request.headers.get('stripe-signature') || 
      request.headers.get('x-webhook-signature') || 
      request.headers.get('x-sumup-signature') ||
      request.headers.get('x-signature');
    
    // Get the payload from the request
    const payload = await request.json();
    
    console.log(`Processing webhook for provider: ${providerId || 'default'}`);
    
    // Process the webhook with the appropriate provider
    const response = await PaymentService.handleWebhook(
      payload,
      signature || undefined,
      providerId || undefined
    );
    
    console.log("Webhook processing result:", response);
    
    // Return appropriate response
    return new Response(JSON.stringify({
      success: response.success,
      message: response.message,
      event_type: response.event
    }), {
      status: response.success ? 200 : 400,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error("Error processing payment webhook:", error);
    
    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error processing webhook",
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

// Also handle GET requests for webhook verification (some providers require this)
export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const providerId = url.searchParams.get('provider');
    const verificationCode = url.searchParams.get('hub_challenge') ||
                             url.searchParams.get('verification') ||
                             url.searchParams.get('challenge');
    
    if (verificationCode) {
      console.log(`Webhook verification request for provider: ${providerId || 'default'}`);
      
      // Just return the verification code for webhook setup
      return new Response(verificationCode, {
        status: 200
      });
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: "Webhook endpoint is active"
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};
