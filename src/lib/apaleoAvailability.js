import { loadEnv } from "vite";

// Import the token fetching function from the existing apaleo_booking.js
import { getApaleoToken } from "./apaleo_booking";

const APALEO_API_URL = "https://api.apaleo.com";

/**
 * Check availability for unit groups (room categories) in Apaleo
 * 
 * @param {string} fromDate - Start date in YYYY-MM-DD format
 * @param {string} toDate - End date in YYYY-MM-DD format
 * @param {string[]} unitGroupIds - Array of unit group IDs (room categories) - Not currently used in API call
 * @returns {Promise<object>} - Availability data
 */
export async function checkUnitGroupAvailability(fromDate, toDate, unitGroupIds) {
  try {
    // Load environment variables
    const env = loadEnv("", process.cwd(), "");
    const propertyId = env.APALEO_PROPERTY_ID;

    if (!propertyId) {
      throw new Error("Missing APALEO_PROPERTY_ID in environment variables");
    }

    // Validate and format dates
    if (!fromDate || !toDate) {
      throw new Error("Both fromDate and toDate are required");
    }

    // We still check unitGroupIds for backward compatibility, but don't use it in the API call
    if (!Array.isArray(unitGroupIds) || unitGroupIds.length === 0) {
      throw new Error("unitGroupIds must be a non-empty array");
    }

    // Get Apaleo token
    const token = await getApaleoToken();

    if (!token) {
      throw new Error("Failed to obtain Apaleo access token");
    }

    // Build the URL with query parameters
    const url = new URL(`${APALEO_API_URL}/availability/v1/unit-groups`);
    url.searchParams.append("propertyId", propertyId);
    url.searchParams.append("from", fromDate);
    url.searchParams.append("to", toDate);

    // No longer passing unitGroupIds to Apaleo API
    // This will return all unit groups for the property
    
    console.log(`Checking availability with URL: ${url.toString()}`);

    // Make the API request
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Apaleo API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const availabilityData = await response.json();
    console.log("Availability data received:", JSON.stringify(availabilityData, null, 2));
    
    // Process the availability data to extract and group the sellable counts
    const processedData = processAvailabilityData(availabilityData);
    
    return {
      raw: availabilityData,
      processed: processedData
    };
  } catch (error) {
    console.error("Error checking unit group availability:", error);
    throw error;
  }
}

/**
 * Calculate a valid end date for availability check
 * AnreiseBis + 14 days, but no more than 360 days after today
 * 
 * @param {string} anreiseBis - End date of arrival period in YYYY-MM-DD format
 * @returns {string} - Calculated end date in YYYY-MM-DD format
 */
export function calculateEndDate(anreiseBis) {
  try {
    // Parse the anreiseBis date
    const anreiseBisDate = new Date(anreiseBis);

    // Add 14 days to anreiseBis
    const endDate = new Date(anreiseBisDate);
    endDate.setDate(endDate.getDate() + 14);

    // Calculate max date (360 days from today)
    const today = new Date();
    const maxDate = new Date(today);
    maxDate.setDate(maxDate.getDate() + 360);

    // Use the earlier of the two dates
    const finalEndDate = endDate > maxDate ? maxDate : endDate;

    // Format as YYYY-MM-DD
    return finalEndDate.toISOString().split('T')[0];
  } catch (error) {
    console.error("Error calculating end date:", error);

    // Fallback to today + 30 days if there's an error
    const fallbackDate = new Date();
    fallbackDate.setDate(fallbackDate.getDate() + 30);
    return fallbackDate.toISOString().split('T')[0];
  }
}

/**
 * Process Apaleo availability data to extract sellable counts grouped by date
 * 
 * @param {Object} apiResponse - Raw response from Apaleo API
 * @returns {Array} - Processed data with dates, property ID, and sellable counts by unit group
 */
export function processAvailabilityData(apiResponse) {
  try {
    // Log the structure of the API response for debugging
    console.log("API Response structure:", typeof apiResponse, apiResponse ? Object.keys(apiResponse) : 'null');
    
    // Based on the example provided, the response has a numeric array property and a 'count' property
    // Example: { '0': [...], '1': [...], ..., count: 17 }
    
    let availabilityData = [];
    
    // Check if we have the expected structure with numeric keys and a count
    if (apiResponse && typeof apiResponse === 'object' && 'count' in apiResponse) {
      // Extract all numeric keys that contain arrays
      const numericKeys = Object.keys(apiResponse)
        .filter(key => !isNaN(parseInt(key)) && Array.isArray(apiResponse[key]));
      
      if (numericKeys.length > 0) {
        // We found numeric keys, now get the first one that should contain our data
        availabilityData = apiResponse[numericKeys[0]];
      } else {
        // Look for any array property
        for (const key in apiResponse) {
          if (Array.isArray(apiResponse[key])) {
            availabilityData = apiResponse[key];
            break;
          }
        }
      }
    } else if (Array.isArray(apiResponse)) {
      // If the response is already an array
      availabilityData = apiResponse;
    } else if (apiResponse && typeof apiResponse === 'object') {
      // Try to find any array property
      for (const key in apiResponse) {
        if (Array.isArray(apiResponse[key])) {
          availabilityData = apiResponse[key];
          break;
        }
      }
      
      // If we still don't have an array, check if the response itself has unitGroups
      if (availabilityData.length === 0 && apiResponse.unitGroups) {
        availabilityData = [apiResponse]; // Wrap in array for consistent processing
      }
    }
    
    // If we couldn't find any valid data, log and return empty
    if (!availabilityData || availabilityData.length === 0) {
      console.error("Could not extract availability data from response", apiResponse);
      return [];
    }
    
    // Load environment variables to get property ID
    const env = loadEnv("", process.cwd(), "");
    const propertyId = env.APALEO_PROPERTY_ID;

    // Process and group the data by date
    const processedData = availabilityData.map(dateEntry => {
      // Extract the date from the 'from' field
      const fromDate = new Date(dateEntry.from).toISOString().split('T')[0];
      
      // Extract unit group codes and their sellable counts (without name)
      const unitGroupsData = dateEntry.unitGroups.map(group => ({
        code: group.unitGroup.code,
        sellableCount: group.sellableCount
      }));
      
      // Calculate total sellable count across all unit groups
      const totalSellableCount = dateEntry.unitGroups.reduce((total, group) => {
        return total + (group.sellableCount || 0);
      }, 0);
      
      // Create a summary object for this date with property ID and total sellable count
      return {
        date: fromDate,
        propertyId,  // Only include property ID
        totalSellableCount,  // Add total sellable count at date level
        unitGroups: unitGroupsData
      };
    });
    
    console.log("Processed availability data:", JSON.stringify(processedData, null, 2));
    return processedData;
  } catch (error) {
    console.error("Error processing availability data:", error);
    return [];
  }
}
