import _ from 'lodash';

import type { PageServerLoad } from './$types';

import { APIStatusCode, DEFAULT_SYMBOL, genericServerError } from '$lib';
import { priceViews } from "$lib/priceViews";
import { api, plainAPI } from '$lib/server/api';
import { error, type Actions } from '@sveltejs/kit';

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
        throw genericServerError(undefined);
    }
}) satisfies PageServerLoad;

export const actions = {
    buyAssets: async ({ fetch, cookies, request, locals }) => {
        if (!locals.token) {
            throw error(403);
        }

        const data = await request.formData();
        const symbol = data.get("symbol") as string | null;
        const pendingUSD = data.get("pendingUSD") as number | null;

        if (!symbol) {
            throw error(400, { message: "Не указан актив" });
        }

        if (!pendingUSD) {
            throw error(400, { message: "Не указана сумма в долларах или она равна нулю" });
        }

        const apiResponse: Data.APINormalResponse<null> = await api(fetch, "POST", "orders/create", {
            assetsSymbol: symbol,
            usdMoney: pendingUSD
        }, locals.token, { cookies });

        if (apiResponse.statusCode == APIStatusCode.SUCCESS) {
            return {};
        } else {
            throw genericServerError(apiResponse.statusCode);
        }
    },
    sellAssets: async ({ fetch, cookies, request, locals }) => {
        if (!locals.token) {
            throw error(403);
        }

        const data = await request.formData();
        const symbol = data.get("symbol") as string | null;
        const pendingAssets = data.get("pendingAssets") as number | null;

        if (!symbol) {
            throw error(400, { message: "Не указан актив" });
        }

        if (!pendingAssets) {
            throw error(400, { message: "Не указана сумма актива или она равна нулю" });
        }

        const apiResponse: Data.APINormalResponse<null> = await api(fetch, "POST", "orders/sail", {
            assetsSymbol: symbol,
            assetsCount: pendingAssets
        }, locals.token, { cookies });

        if (apiResponse.statusCode == APIStatusCode.SUCCESS) {
            return {};
        } else if (apiResponse.statusCode == APIStatusCode.LACK_OF_RESOURCES) {
            throw error(400, {
                apiStatusCode: apiResponse.statusCode,
                message: "Недостаточно акций"
            });
        } else {
            throw genericServerError(apiResponse.statusCode);
        }
    },
    sellAllAssets: async ({ fetch, cookies, request, locals }) => {
        if (!locals.token) {
            throw error(403);
        }

        const data = await request.formData();
        const symbol = data.get("symbol") as string | null;

        if (!symbol) {
            throw error(400, { message: "Не указан актив" });
        }

        const apiResponse: Data.APINormalResponse<null> = await api(fetch, "POST", "orders/sail/all", {
            assetsSymbol: symbol,
        }, locals.token, { cookies });

        if (apiResponse.statusCode == APIStatusCode.SUCCESS) {
            return {};
        } else {
            throw genericServerError(apiResponse.statusCode);
        }
    },
} satisfies Actions;
