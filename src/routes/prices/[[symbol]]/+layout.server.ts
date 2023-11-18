import { DEFAULT_SYMBOL } from '$lib';
import { plainAPI } from '$lib/server/api';
import { error } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ fetch, params }) => {
    const symbol = params.symbol ?? DEFAULT_SYMBOL;
    const last24hStats: Data.SymbolStats = await plainAPI(fetch, "GET", `coins/statistics/${symbol}`, null, null);

    if (last24hStats) {
        return { last24hStats };
    } else {
        throw error(500, "Произошла неожиданная ошибка. Попробуйте ещё раз позже");
    }
}) satisfies LayoutServerLoad;
