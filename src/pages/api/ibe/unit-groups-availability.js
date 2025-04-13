import { getApaleoToken } from './apaleo';

export async function GET() {
  try {
    // Get the access token
    const token = await getApaleoToken();

    // Calculate date range (today to 365 days from now)
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 365);

    // Format dates as YYYY-MM-DD
    const fromDate = today.toISOString().split('T')[0];
    const toDate = endDate.toISOString().split('T')[0];

    // Make request to Apaleo API
    const response = await fetch(
      `https://api.apaleo.com/availability/v1/unit-groups?` +
      `propertyId=SZS` +
      `&from=${fromDate}` +
      `&to=${toDate}` +
      `&timeSliceTemplate=OverNight` +
      `&unitGroupTypes=BedRoom` +
      `&onlySellable=true` +
      `&adults=1`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Apaleo API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    
    // Simplify the response format
    const simplifiedData = data.timeSlices.map(slice => {
      // Calculate totals for each date
      const totalSold = slice.unitGroups.reduce((sum, group) => sum + group.soldCount, 0);
      const totalSellable = slice.unitGroups.reduce((sum, group) => sum + group.sellableCount, 0);

      return {
        date: slice.from.split('T')[0],
        totalSold,
        totalSellable,
        units: slice.unitGroups.map(group => ({
          id: group.unitGroup.id,
          id2: group.unitGroup.id.slice(-3), // Get last 3 characters of ID
          name: group.unitGroup.name,
          soldCount: group.soldCount,
          sellableCount: group.sellableCount
        }))
      };
    });

    // Return the response with proper headers
    return new Response(JSON.stringify(simplifiedData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
      }
    });

  } catch (error) {
    console.error('Error fetching unit group availability:', error);
    
    return new Response(JSON.stringify({
      error: 'Failed to fetch unit group availability',
      message: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
