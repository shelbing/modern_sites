// getApaleoToken.js

import fetch from "node-fetch";
import { loadEnv } from 'vite';

export async function getApaleoToken() {
  // Load environment variables using Vite's loadEnv
  // '' is the mode (can be 'development' or 'production')
  // process.cwd() gets the current working directory
  // '' means load all env vars (no prefix filtering)
  const env = loadEnv('', process.cwd(), '');

  // Access environment variables from the loaded env object
  const clientId = env.APALEO_CLIENT_ID;
  const clientSecret = env.APALEO_CLIENT_SECRET;
  const tokenEndpoint = env.APALEO_TOKEN_ENDPOINT;

  // Validate environment variables
  if (!clientId || !clientSecret || !tokenEndpoint) {
    throw new Error('Missing required Apaleo configuration in environment variables');
  }

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", clientId);
  params.append("client_secret", clientSecret);

  const response = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Failed to get token: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  const data = await response.json();
  return data.access_token;
}

export async function getAvailability(startDate, days, propertyId) {
    const token = await getApaleoToken();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + days);
    
    const endDateStr = endDate.toISOString().split('T')[0];
    const url = `https://api.apaleo.com/inventory/v1/room-types/availability?propertyId=${propertyId}&from=${startDate}&to=${endDateStr}&includeOutOfOrder=false`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        }
    });

    if (!response.ok) {
        console.error('Failed to fetch availability:', await response.text());
        return [];
    }

    const data = await response.json();
    
    // Transform the data into our desired format
    const availability = data.timeSlices.map(slice => ({
        date: slice.from.split('T')[0],
        totalSold: slice.roomTypes.reduce((acc, rt) => acc + rt.soldCount, 0),
        totalSellable: slice.roomTypes.reduce((acc, rt) => acc + rt.sellableCount, 0),
        units: slice.roomTypes.map(rt => ({
            id: rt.id,
            id2: rt.id.split('-')[1],
            name: rt.name,
            soldCount: rt.soldCount,
            sellableCount: rt.sellableCount
        }))
    }));

    return availability;
}
