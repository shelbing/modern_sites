const APALEO_API_URL = "https://api.apaleo.com";
import { loadEnv } from "vite";
import { sendBookingConfirmation } from "./email";

async function getApaleoToken() {
  // Load environment variables using Vite's loadEnv
  // '' is the mode (can be 'development' or 'production')
  // process.cwd() gets the current working directory
  // '' means load all env vars (no prefix filtering)
  const env = loadEnv("", process.cwd(), "");

  // Access environment variables from the loaded env object
  const clientId = env.APALEO_CLIENT_ID;
  const clientSecret = env.APALEO_CLIENT_SECRET;
  const tokenEndpoint = env.APALEO_TOKEN_ENDPOINT;

  // Validate environment variables
  if (!clientId || !clientSecret || !tokenEndpoint) {
    throw new Error(
      "Missing required Apaleo configuration in environment variables"
    );
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

export async function make_booking(bookingData) {
  try {
    console.log(
      "Creating Apaleo booking with data:",
      JSON.stringify(bookingData, null, 2)
    );

    if (!bookingData.paymentIntentId) {
      throw new Error("Payment Intent ID is required for booking");
    }

    if (!bookingData.cart) {
      throw new Error("Cart data is required for booking");
    }

    const APALEO_API_URL = "https://api.apaleo.com";
    // Get token
    const token = await getApaleoToken();

    console.log(bookingData);
    // Extract data from bookingData
    const { cart, paymentIntentId } = bookingData;
    const { personalData, searchData, calculatedAmounts, ratePlan } = cart;

    if (!personalData || !searchData) {
      throw new Error("Personal data and search data are required for booking");
    }

    // Prepare the booking payload according to Apaleo API spec
    const bookingPayload = {
      paymentAccount: {
        accountNumber: paymentIntentId,
        accountHolder: `${personalData.firstName} ${personalData.lastName}`,
        payerEmail: personalData.email,
        paymentMethod: "card",
        isVirtual: false,
      },
      booker: {
        firstName: personalData.firstName,
        lastName: personalData.lastName,
        email: personalData.email,
        address: {
          addressLine1: personalData.street,
          postalCode: personalData.zipCode,
          city: personalData.city || "",
          countryCode: personalData.country || "DE",
        },
      },
      reservations: [
        {
          arrival: searchData.startDate,
          departure: searchData.endDate,
          adults: searchData.adults,
          childrenAges: searchData.childrenAges || [],
          channelCode: "IBE",
          primaryGuest: {
            firstName: personalData.firstName,
            lastName: personalData.lastName,
            email: personalData.email,
            address: {
              addressLine1: personalData.street,
              postalCode: personalData.zipCode,
              city: personalData.city || "",
              countryCode: personalData.country || "DE",
            },
          },

          // Add additional guests if present
          additionalGuests:
            personalData.additionalGuests?.map((guest) => ({
              firstName: guest.firstName,
              lastName: guest.lastName,
            })) || [],

          prePaymentAmount: {
            amount: calculatedAmounts.Anzahlung.gross,
            currency: "EUR",
          },
          guaranteeType: "CreditCard",
          timeSlices: (() => {
            const arrival = new Date(searchData.startDate);
            const departure = new Date(searchData.endDate);
            const lengthOfStay = Math.ceil(
              (departure - arrival) / (1000 * 60 * 60 * 24)
            );
            const ratePlanId = ratePlan.longRatePlan;

            return Array.from({ length: lengthOfStay }, (_, index) => ({
              RatePlanId: ratePlanId,
              TotalAmount: {
                Amount: calculatedAmounts.total.gross / lengthOfStay,
                Currency: "EUR",
              },
            }));
          })(),

          services: (() => {
            if (!cart.offer?.Services) return [];

            const selectedServices = cart.offer.Services.filter(
              (s) => s.selected
            );
            return selectedServices.map((service) => ({
              serviceId: service.Apaleo_Code,
              serviceDate: searchData.startDate,
              amount: {
                amount: parseFloat(service.Standardpreis),
                currency: "EUR",
              },
            }));
          })(),

          guestComment: (() => {
            let comment = "Online booking via IBE\n";

            // Add offer name
            if (cart.offer?.Title) {
              comment += `Selected offer: ${cart.offer.Title}\n`;
            }

            // Add selected services to comment if they exist
            if (cart.offer?.Services) {
              const selectedServices = cart.offer.Services.filter(
                (s) => s.selected
              );
              if (selectedServices.length > 0) {
                comment += "\nSelected additional services:\n";
                selectedServices.forEach((service) => {
                  comment += `- ${service.Name} (${service.Standardpreis}€, ${service.Steuer}% MwSt)\n`;
                });
              }
            }

            // Add user comments if they exist
            if (personalData.comments) {
              comment += "\nGuest comments:\n" + personalData.comments;
            }

            return comment;
          })(),
        },
      ],
    };

    console.log(
      "Sending Apaleo payload:",
      JSON.stringify(bookingPayload, null, 2)
    );

    // Make the API call to the correct endpoint
    const response = await fetch(`${APALEO_API_URL}/booking/v1/bookings`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingPayload),
    });

    // Handle the response
    const responseText = await response.text();
    let responseData;

    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse Apaleo response:", responseText);
      throw new Error("Invalid response from Apaleo API");
    }

    if (!response.ok) {
      console.error("Apaleo booking failed:", responseData);
      throw new Error(responseData.message || "Failed to create booking");
    }

    console.log("Apaleo booking created successfully:", responseData);

    // After successful booking, send confirmation email
    await sendBookingConfirmation(bookingData, responseData);

    return {
      success: true,
      bookingId: responseData.id,
      reservationNumber: responseData.reservationId,
      apaleoResponse: responseData,
    };
  } catch (error) {
    console.error("Error creating Apaleo booking:", error);
    throw error;
  }
}
