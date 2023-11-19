import { DEFAULT_SYMBOL, genericServerError } from '$lib';
import { api, plainAPI } from '$lib/server/api';
import _ from 'lodash';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ fetch, params, depends, locals, cookies }) => {
    depends("app:prices");
    depends("app:token");

    const symbol = params.symbol ?? DEFAULT_SYMBOL;
    const last24hStats: Data.SymbolStats = await plainAPI(fetch, "GET", `coins/statistics/${symbol}`, null, null);

    let assetBalance: number | undefined = undefined;
    if (locals.token) {
        const assetBalanceResponse: Data.APINormalResponse<Data.AssetBalance> = await api(fetch, "GET", "balance/assets/" + symbol, null, locals.token, { cookies });

        if (assetBalanceResponse.data) {
            assetBalance = _.toNumber(assetBalanceResponse.data.assetsCount);
        } else {
            throw genericServerError(assetBalanceResponse.statusCode);
        }
    }

    if (last24hStats) {
        return { last24hStats, assetBalance };
    } else {
        throw genericServerError(undefined);
    }
}) satisfies LayoutServerLoad;
