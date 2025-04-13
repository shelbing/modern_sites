import { getBundles } from "./bundles.js";
export const prerender = false;

export async function GET({ request }) {
    try {
        const url = new URL(request.url);
        const lang = url.searchParams.get('lang') || 'de';
        const data = await getBundles(lang);
        // Extract different types of offers
        const bundles = data.Bundles || [];
        const rooms = data.Rooms || [];
        const services = data.Services || [];

        return new Response(JSON.stringify({
            bundles,
            rooms,
            services
        }), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error("Error fetching offers:", error);
        return new Response(JSON.stringify({
            message: "Error fetching offers",
            error: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
