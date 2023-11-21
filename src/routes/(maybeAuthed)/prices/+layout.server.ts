import { api, plainAPI } from '$lib/server/api';
import type { LayoutServerLoad } from './$types';
import { genericServerError } from '$lib';
import _ from 'lodash';
import { DateTime } from 'luxon';

export const load = (async ({ fetch, depends, locals, cookies }) => {
    depends("app:prices");
    depends("app:token");

    const briefs: Data.SymbolBrief[] = await plainAPI(fetch, "GET", "coins/prices", null, null);
    const briefsTimestamp = DateTime.now().toMillis();

    let usdBalance: number | undefined = undefined;
    if (locals.token) {
        const usdBalanceResponse: Data.APINormalResponse<number> = await api(fetch, "GET", "balance", null, locals.token, { cookies });

        if (!_.isNil(usdBalanceResponse.data)) {
            usdBalance = _.toNumber(usdBalanceResponse.data);
        } else {
            throw genericServerError(usdBalanceResponse.statusCode);
        }
    }

    if (briefs) {
        return {
            symbols: briefs.map(brief => brief.symbol),
            briefs,
            usdBalance,
            briefsTimestamp,
        };
    } else {
        throw genericServerError(undefined);
    }
}) satisfies LayoutServerLoad;
