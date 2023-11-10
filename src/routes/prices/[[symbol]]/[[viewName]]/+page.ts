import _ from 'lodash';

import type { PageLoad } from './$types';

import { views } from "./views";

export const load = (async ({ fetch, params }) => {
    const symbol = params.symbol ?? "BTC";
    const view = views.find(view => view.name == params.viewName) ?? views[0];

    const briefResponse = await fetch("/api/v1/coins/prices");
    const briefs = await briefResponse.json() as Data.SymbolBrief[];

    const url = `/api/v1/coins/prices/${symbol}?interval=${view.interval}`;

    const response = await fetch(url);
    const json = await response.json() as Data.PricePoint[];

    return {
        view,
        url,
        symbol,
        symbols: briefs.map(brief => brief.symbol),
        price: briefs.find(brief => brief.symbol == symbol)?.price ?? null,
        prices: view.points == Infinity ? json : _.slice(json, json.length - view.points)
    };
}) satisfies PageLoad;
