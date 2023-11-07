import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
    const response = await fetch("/api/v1/coins/prices");
    const json = await response.json() as Data.Price[];
    return {
        prices: json
    };
}) satisfies PageLoad;
