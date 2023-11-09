import _ from 'lodash';

import type { PageLoad } from './$types';

import { views } from "./views";

export const load = (async ({ fetch, params }) => {
    const symbol = params.symbol ?? "BTC";
    const view = views.find(view => view.name == params.viewName) ?? views[0];

    const allResponse = await fetch("/api/v1/coins/prices");
    const allJSON = await allResponse.json() as Data.Price[];

    const url = `/api/v1/coins/prices/${symbol}?interval=${view.interval}`;

    const response = await fetch(url);
    const json = await response.json() as Data.PricePoint[];

    return {
        symbol,
        view,
        url,
        symbols: allJSON,
        prices: view.points == Infinity ? json : _.slice(json, json.length - view.points)
    };
}) satisfies PageLoad;
