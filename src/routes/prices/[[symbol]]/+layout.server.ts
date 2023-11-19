import { DEFAULT_SYMBOL } from '$lib';
import { api, plainAPI } from '$lib/server/api';
import { fail } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ fetch, params, depends, locals, cookies }) => {
    depends("app:prices");

    const symbol = params.symbol ?? DEFAULT_SYMBOL;
    const last24hStats: Data.SymbolStats = await plainAPI(fetch, "GET", `coins/statistics/${symbol}`, null, null);

    let assetBalance: number | undefined = undefined;
    if (locals.token) {
        const assetBalanceResponse: Data.APINormalResponse<Data.AssetBalance> = await api(fetch, "GET", "balance/assets/" + symbol, null, locals.token, { cookies });

        if (assetBalanceResponse.data) {
            assetBalance = assetBalanceResponse.data.assetsCount;
        } else {
            return fail(500);
        }
    }

    if (last24hStats) {
        return { last24hStats, assetBalance };
    } else {
        return fail(500);
    }
}) satisfies LayoutServerLoad;
