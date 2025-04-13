import { getBundles } from '$lib/api/bundles';
import { json } from '@sveltejs/kit';

export const prerender = false;

export async function GET({ url }) {
    try {
        const lang = url.searchParams.get('lang') || 'de';
        const bundles = await getBundles(lang);
        return json(bundles);
    } catch (error) {
        console.error("Error fetching bundles:", error);
        return json({
            message: "Error fetching bundles",
            error: error.message,
        }, { status: 500 });
    }
}
