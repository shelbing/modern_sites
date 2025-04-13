import type { APIRoute } from "astro";
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const data = await request.json();
  console.log(data);
  const email = data.email;
  if (!email) {
    return new Response(
      JSON.stringify({
        message: "Email address is required",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  // Here you would typically add the email to your newsletter service
  // For example, using a service like Mailchimp or SendGrid
  console.log(`Subscribing email: ${email}`);

  // Simulate a successful subscription
  return new Response(
    JSON.stringify({
      message: "Subscription successful",
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
