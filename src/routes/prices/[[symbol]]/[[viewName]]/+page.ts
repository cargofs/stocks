import _ from 'lodash';

import type { PageLoad } from './$types';

import { priceViews } from "$lib/priceViews";

export const load = (async ({ fetch, params, parent }) => {
    const symbol = params.symbol ?? "BTC";

    const viewName = params.viewName ?? priceViews[0].name;
    const view = priceViews.find(view => view.name == viewName)!;

    const url = `/api/v1/coins/prices/${symbol}?interval=${view.interval}`;

    const response = await fetch(url);
    const json = await response.json() as Data.PricePoint[];

    const { briefs } = await parent();

    return {
        view,
        url,
        symbol,
        symbols: briefs.map(brief => brief.symbol),
        price: briefs.find(brief => brief.symbol == symbol)?.price ?? null,
        prices: view.points == Infinity ? json : _.slice(json, json.length - view.points)
    };
}) satisfies PageLoad;
