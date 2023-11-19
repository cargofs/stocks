import _ from 'lodash';

import type { PageServerLoad } from './$types';

import { DEFAULT_SYMBOL } from '$lib';
import { priceViews } from "$lib/priceViews";
import { plainAPI } from '$lib/server/api';
import { error } from '@sveltejs/kit';

export const load = (async ({ fetch, params, depends }) => {
    depends("app:prices");

    const symbol = params.symbol ?? DEFAULT_SYMBOL;

    const viewName = params.viewName ?? priceViews[0].name;
    const view = priceViews.find(view => view.name == viewName)!;

    const pricePoints: Data.PricePoint[] = await plainAPI(fetch, "GET", `coins/prices/${symbol}?interval=${view.interval}`, null, null);

    if (pricePoints) {
        return {
            view,
            symbol,
            prices: view.points == Infinity ? pricePoints : _.slice(pricePoints, pricePoints.length - view.points)
        };
    } else {
        throw error(500, "Произошла неожиданная ошибка. Попробуйте ещё раз позже");
    }
}) satisfies PageServerLoad;
