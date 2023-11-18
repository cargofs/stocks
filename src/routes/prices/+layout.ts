import { plainAPI } from '$lib';
import { error } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

export const load = (async ({ fetch }) => {
    const briefs: Data.SymbolBrief[] = await plainAPI(fetch, "GET", "coins/prices", null, null);

    if (briefs) {
        return { briefs };
    } else {
        throw error(500, "Произошла неожиданная ошибка. Попробуйте ещё раз позже");
    }
}) satisfies LayoutLoad;
