import type { LayoutLoad } from './$types';

export const load = (async ({ fetch }) => {
    const briefResponse = await fetch("/api/v1/coins/prices");
    const briefs = await briefResponse.json() as Data.SymbolBrief[];

    return {
        briefs
    };
}) satisfies LayoutLoad;
