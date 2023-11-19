import { api, plainAPI } from '$lib/server/api';
import { fail } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ fetch, depends, locals, cookies }) => {
    depends("app:prices");

    const briefs: Data.SymbolBrief[] = await plainAPI(fetch, "GET", "coins/prices", null, null);

    let usdBalance: number | undefined = undefined;
    if (locals.token) {
        const usdBalanceResponse: Data.APINormalResponse<number> = await api(fetch, "GET", "balance", null, locals.token, { cookies });

        if (usdBalanceResponse.data) {
            usdBalance = usdBalanceResponse.data;
        } else {
            return fail(500);
        }
    }

    if (briefs) {
        return {
            symbols: briefs.map(brief => brief.symbol),
            briefs,
            usdBalance,
        };
    } else {
        return fail(500);
    }
}) satisfies LayoutServerLoad;
