import { getApaleoToken } from './apaleo';

export async function GET() {
    try {
        const token = await getApaleoToken();
        
        // Calculate date range for availability
        const today = new Date();
        const endDate = new Date();
        endDate.setDate(today.getDate() + 365);
        const fromDate = today.toISOString().split('T')[0];
        const toDate = endDate.toISOString().split('T')[0];

        // Fetch availability data
        const availabilityResponse = await fetch(
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

        // Fetch rooms data
        const roomsResponse = await fetch(
            'https://api.apaleo.com/inventory/v1/unit-groups?propertyId=SZS',
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            }
        );

        // Fetch services data
        const servicesResponse = await fetch(
            'https://api.apaleo.com/service/v1/service-types?propertyId=SZS',
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            }
        );

        if (!availabilityResponse.ok || !roomsResponse.ok || !servicesResponse.ok) {
            throw new Error('One or more API requests failed');
        }

        const [availabilityData, roomsData, servicesData] = await Promise.all([
            availabilityResponse.json(),
            roomsResponse.json(),
            servicesResponse.json()
        ]);

        // Process availability data
        const availability = availabilityData.timeSlices.map(slice => ({
            date: slice.from.split('T')[0],
            totalSold: slice.unitGroups.reduce((sum, group) => sum + group.soldCount, 0),
            totalSellable: slice.unitGroups.reduce((sum, group) => sum + group.sellableCount, 0),
            units: slice.unitGroups.map(group => ({
                id: group.unitGroup.id,
                id2: group.unitGroup.id.slice(-3),
                name: group.unitGroup.name,
                soldCount: group.soldCount,
                sellableCount: group.sellableCount
            }))
        }));

        return new Response(JSON.stringify({
            availability,
            rooms: roomsData,
            services: servicesData
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
            }
        });

    } catch (error) {
        console.error('Error fetching Apaleo data:', error);
        return new Response(JSON.stringify({
            error: 'Failed to fetch Apaleo data',
            message: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
