import { Resend } from "resend";
export const prerender = false;
const resend = new Resend("re_RPwoeXNV_BNNU7MbWP194tc6uaSCQjNN5");

const emailTemplates = {
  en: {
    subject: "Welcome to Hotel Stern Newsletter",
    text: "Thank you for subscribing to our newsletter!\n\nBest regards,\nHotel Stern Team",
  },
  de: {
    subject: "Willkommen beim Hotel Stern Newsletter",
    text: "Vielen Dank für Ihre Newsletter-Anmeldung!\n\nMit besten Grüßen,\nIhr Hotel Stern Team",
  },
  fr: {
    subject: "Bienvenue à la newsletter de l'Hôtel Stern",
    text: "Merci de vous être inscrit à notre newsletter !\n\nCordialement,\nL'équipe de l'Hôtel Stern",
  },
  es: {
    subject: "Bienvenido al boletín del Hotel Stern",
    text: "¡Gracias por suscribirse a nuestro boletín!\n\nSaludos cordiales,\nEl equipo del Hotel Stern",
  },
};

export async function POST({ request }) {
  try {
    const { email, lang = "de" } = await request.json();
    console.log("Processing newsletter signup:", { email, lang });

    if (!email) {
      throw new Error("Email is required");
    }

    const template = emailTemplates[lang] || emailTemplates.de;

    await resend.emails.send({
      from: "info@siriusmailer.com",
      to: email,
      subject: template.subject,
      text: template.text,
    });

    return new Response(
      JSON.stringify({ message: "Successfully subscribed to newsletter" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Newsletter error:", error);
    
    return new Response(
      JSON.stringify({
        message: "Failed to subscribe to newsletter",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
