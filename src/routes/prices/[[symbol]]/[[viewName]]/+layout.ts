import type { LayoutLoad } from './$types';

export const load = (async ({ fetch }) => {
    console.log("begin layout load");

    const briefResponse = await fetch("/api/v1/coins/prices");
    const briefs = await briefResponse.json() as Data.SymbolBrief[];

    console.log("end layout load");

    return {
        briefs
    };
}) satisfies LayoutLoad;
