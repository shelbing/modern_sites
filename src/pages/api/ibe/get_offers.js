import { getApaleoToken } from "./apaleo.js";
import fetch from "node-fetch";
export const prerender = false;

export async function GET({ request }) {
  try {
    const url = new URL(request.url);
    const startDate = url.searchParams.get("start");
    const endDate = url.searchParams.get("end");
    const adults = url.searchParams.get("adults");
    const hotelCode = url.searchParams.get("hotel");
    const lang = url.searchParams.get("lang");
    const childrenAges = url.searchParams.get("childrenAges");
    
    if (!startDate || !endDate || !adults || !hotelCode) {
      return new Response(
        JSON.stringify({
          offers: []
        }),
        {
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    // Get Apaleo API token
    const token = await getApaleoToken();

    // Prepare the Offers API request
    const offersEndpoint = "https://api.apaleo.com/booking/v1/offers";

    // Build query parameters for the Offers API
    const offersUrl = new URL(offersEndpoint);
    offersUrl.searchParams.append("propertyId", hotelCode);
    offersUrl.searchParams.append("arrival", startDate);
    offersUrl.searchParams.append("departure", endDate);
    offersUrl.searchParams.append("adults", adults);
    offersUrl.searchParams.append("channelCode", "Ibe");
    offersUrl.searchParams.append("lang", lang);
    offersUrl.searchParams.append("childrenAges", childrenAges);

    // Make the request to the Offers API
    const offersResponse = await fetch(offersUrl.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!offersResponse.ok) {
      throw new Error(`Apaleo API error: ${offersResponse.statusText}`);
    }

    const apaleoData = await offersResponse.json();

    // If no data or empty data from Apaleo, return empty array
    if (!apaleoData || !apaleoData.offers || apaleoData.offers.length === 0) {
      return new Response(JSON.stringify({
        offers: []
      }), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    return new Response(JSON.stringify(apaleoData), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error in get_offers:", error);
    // Return empty array on error instead of error response
    return new Response(JSON.stringify({
      offers: []
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
