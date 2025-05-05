import type { APIRoute } from 'astro';
export const prerender = false;
export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();

    // Debug: log all received fields in the request
    console.log('[API] Received fields:', Object.keys(data));
    console.log('[API] RAW incoming request:', data);

    // Extract parameters
    const {
      arrivalDate,
      departureDate,
      adults,
      children,
      childrenAges,
      bundleCode,
      ratePlan,
      categories = [], // Default to empty array if not provided
      PreisAnpassungAbsolut = 0, // Default to 0 if not provided
      PreisanpassungProzent = 0 // Default to 0 if not provided
    } = data;

    // Defensive: check required fields
    if (!arrivalDate || !departureDate || typeof adults !== 'number' || typeof children !== 'number') {
      console.warn('[API] Missing required fields:', { arrivalDate, departureDate, adults, children });
      return new Response(
        JSON.stringify({
          error: 'Missing required fields',
          debug: { arrivalDate, departureDate, adults, children, raw: data }
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Debug log the incoming request
    console.log('[API] Incoming price calculation request:', {
      arrivalDate,
      departureDate,
      adults,
      children,
      childrenAges,
      bundleCode,
      ratePlan,
      categories,
      PreisAnpassungAbsolut,
      PreisanpassungProzent
    });

    // Ensure categories is always an array
    const safeCategories = Array.isArray(categories) ? categories : [];

    // Simulate price calculation logic
    const pricePerAdult = 100;
    const pricePerChild = 50;
    const nights =
      (new Date(departureDate).getTime() - new Date(arrivalDate).getTime()) /
      (1000 * 60 * 60 * 24);

    // Calculate total persons
    const totalPersons = (typeof adults === 'number' ? adults : 0) + (typeof children === 'number' ? children : 0);

    const total =
      (adults * pricePerAdult + (childrenAges?.length || 0) * pricePerChild) *
      (nights > 0 ? nights : 1);

    // Always define results so it is available in all scopes
    const results: any[] = [];

    // --- Call Apaleo API for debugging ---
    try {
      const apaleoUrl = 'https://api.apaleo.com/booking/v1/rate-plan-offers';
      // Format dates for Apaleo (YYYY-MM-DD)
      const formatDate = (d: string) => {
        try {
          return new Date(d).toISOString().split('T')[0];
        } catch {
          return d;
        }
      };
      const apaleoPayload = {
        ratePlanId: ratePlan,
        arrival: arrivalDate, // send original UTC format
        departure: departureDate, // send original UTC format
        channelCode: 'ibe',
        adults: adults,
        childrenAges: Array.isArray(childrenAges) ? childrenAges : []
      };
      console.log('[API] Apaleo payload:', apaleoPayload);
      // Get Apaleo OAuth token using helper
      const apaleoBookingModule = await import('../../lib/apaleo_booking.js');
      const token = await apaleoBookingModule.getApaleoToken();
      // Build Apaleo URL with query parameters for GET
      const apaleoGetUrl = new URL(apaleoUrl);
      // Helper to produce date-only string
      const toDateOnly = (d: string) => {
        try {
          return new Date(d).toISOString().split('T')[0];
        } catch {
          return d;
        }
      };
      // Assume hotelCode is available (e.g., from env or a constant)
      const env = (await import('vite')).loadEnv('', process.cwd(), '');
      const hotelCode = env.APALEO_PROPERTY_ID || 'SZS';
      // categories is an array of room codes/names
      for (const category of safeCategories) {
        // Compose ratePlanId as hotelCode-ratePlan-roomName
        const roomName = category; // or map category to display name if needed
        // Ensure ratePlan is in the form SZS_RRFR
        let apaleoRatePlan = ratePlan;
        if (!ratePlan.startsWith(`${hotelCode}_`)) {
          apaleoRatePlan = `${hotelCode}_${ratePlan}`;
        }
        const ratePlanId = `${hotelCode}-${apaleoRatePlan}-${roomName}`;
        const apaleoGetUrl = new URL(apaleoUrl);
        console.log(`[API] Apaleo GET URL for ${ratePlanId}:`, apaleoGetUrl.toString());
        apaleoGetUrl.searchParams.append('ratePlanId', ratePlanId);
        apaleoGetUrl.searchParams.append('arrival', toDateOnly(arrivalDate));
        apaleoGetUrl.searchParams.append('departure', toDateOnly(departureDate));
        apaleoGetUrl.searchParams.append('channelCode', 'ibe');
        apaleoGetUrl.searchParams.append('adults', adults.toString());
        if (Array.isArray(childrenAges) && childrenAges.length > 0) {
          childrenAges.forEach(age => apaleoGetUrl.searchParams.append('childrenAges', age.toString()));
        }
        const apaleoResp = await fetch(apaleoGetUrl.toString(), {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const apaleoText = await apaleoResp.text();
        const contentType = apaleoResp.headers.get('content-type') || '';
        let apaleoData = null;
        let totalGrossAmount = null;
        if (contentType.includes('application/json') && apaleoText) {
          try {
            apaleoData = JSON.parse(apaleoText);
            // Extract total gross amount from the first offer (if exists)
            if (apaleoData && apaleoData.offers && apaleoData.offers.length > 0) {
              totalGrossAmount = apaleoData.offers[0].totalGrossAmount?.amount;
              console.log(`[API] [${ratePlanId}] Total Gross Amount:`, totalGrossAmount);
            } else {
              console.log(`[API] [${ratePlanId}] No offers found in Apaleo response.`);
            }
            console.log(`[API] Apaleo rate-plan-offers response for ${ratePlanId}:`, apaleoData);
          } catch (err) {
            console.error(`[API] Apaleo response could not be parsed as JSON for ${ratePlanId}:`, apaleoText);
          }
        } else {
          console.log(`[API] Apaleo response (non-JSON or empty) for ${ratePlanId}:`, apaleoText);
        }
        results.push({ ratePlanId, response: apaleoData, totalGrossAmount, raw: apaleoText });
      }
      // Optionally, log all results
      console.log('[API] All Apaleo pricing results:', results);
    } catch (err) {
      console.error('[API] Apaleo API call failed:', err);
    }

    // Build room type price map from results, even if partial
    const roomTypePrices: Record<string, number | null> = {};
    const roomTypeOffers: Record<string, any | null> = {};
    const roomTypePricesByCategory: Record<string, number | null> = {};

    console.log('[API] Processing Apaleo results:', results);

    for (const r of results) {
      roomTypePrices[r.ratePlanId] = r.totalGrossAmount ?? null;

      // Extract the room code/category from the ratePlanId (last segment after last dash)
      // The pattern should match codes like DBS, DES, WSS at the end of the string
      const match = r.ratePlanId.match(/-([A-Z0-9]+)$/);
      console.log(`[API] Extracting room code from ${r.ratePlanId}:`, match ? match[1] : 'no match');

      if (match) {
        const roomCode = match[1];
        // Use the exact totalGrossAmount.amount from the Apaleo offer if available
        let price: number | null = null;
        if (
          r.response &&
          r.response.offers &&
          r.response.offers[0] &&
          r.response.offers[0].totalGrossAmount &&
          typeof r.response.offers[0].totalGrossAmount.amount === 'number'
        ) {
          price = r.response.offers[0].totalGrossAmount.amount;
          console.log(`[API] Found price for ${roomCode}:`, price);
        } else {
          console.log(`[API] No valid price found for ${roomCode} in:`,
            r.response?.offers?.[0]?.totalGrossAmount);
        }

        roomTypePricesByCategory[roomCode] = price;
      }

      // Return the first offer object from Apaleo response, or null
      if (r.response && r.response.offers && r.response.offers.length > 0) {
        roomTypeOffers[r.ratePlanId] = r.response.offers[0];
      } else {
        roomTypeOffers[r.ratePlanId] = null;
      }
    }

    console.log('[API] Final roomTypePricesByCategory:', roomTypePricesByCategory);

    // Generate room prices for each room category using Apaleo prices
    const roomPrices = safeCategories.map((roomCode: string) => {
      const price = roomTypePricesByCategory[roomCode] ?? null;
      if (price !== null) {
        // First apply percentage adjustment, then add absolute adjustment
        const adjustedPrice = (price * (1 + PreisanpassungProzent / 100)) + PreisAnpassungAbsolut;
        return { roomCode, price: adjustedPrice };
      } else {
        return { roomCode, price: null };
      }
    });

    // Build API response object
    const apiResponse = {
      timestamp: new Date().toISOString(),
      arrivalDate,
      departureDate,
      adults,
      children,
      childrenAges,
      bundleCode,
      ratePlan,
      categories: safeCategories,
      totalPersons,
      total,
      roomPrices,
      roomTypePrices,
      roomTypeOffers,
      roomTypePricesByCategory,
      PreisAnpassungAbsolut,
      PreisanpassungProzent
    };

    console.log('[API] Returning data:', apiResponse);
    // Return a response
    return new Response(
      JSON.stringify(apiResponse),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('[API] Error in price-calculation:', error);
    return new Response(
      JSON.stringify({
        error: 'Invalid request',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error && error.stack ? error.stack : undefined
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
