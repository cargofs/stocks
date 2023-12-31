import _ from 'lodash';

import type { PageServerLoad } from './$types';

import { APIStatusCode, ASSET_PRECISION, DEFAULT_SYMBOL, USD_PRECISION, genericServerError } from '$lib';
import { DEFAULT_VIEW_NAME, priceViews } from "$lib/priceViews";
import { api, plainAPI } from '$lib/server/api';
import { error, type Actions } from '@sveltejs/kit';

export const load = (async ({ fetch, params, depends }) => {
    depends("app:prices");

    const symbol = params.symbol ?? DEFAULT_SYMBOL;

    const viewName = params.viewName ?? DEFAULT_VIEW_NAME;
    const view = priceViews.find(view => view.name == viewName)!;

    const pricePoints: Data.PricePoint[] = await plainAPI(fetch, "GET", `coins/prices/${symbol}?interval=${view.interval}`, null, null);

    if (pricePoints) {
        const prices = view.points == Infinity ? pricePoints : _.slice(pricePoints, pricePoints.length - view.points);

        return {
            view,
            symbol,
            prices,
            priceOpenTimes: prices.map((point) => point.openTime),
            priceOpens: prices.map((point) => point.open),
        };
    } else {
        throw genericServerError(undefined);
    }
}) satisfies PageServerLoad;

export const actions = {
    buyAssets: async ({ fetch, cookies, request, locals }) => {
        if (_.isNil(locals.token)) {
            throw error(403);
        }

        const data = await request.formData();
        const symbol = data.get("symbol") as string | null;
        const pendingUSD = data.get("pendingUSD") as number | null;

        if (_.isNil(symbol)) {
            throw error(400, { message: "Не указан актив" });
        }

        if (_.isNil(pendingUSD)) {
            throw error(400, { message: "Не указана сумма в долларах или она равна нулю" });
        }

        const apiResponse: Data.APINormalResponse<null> = await api(fetch, "POST", "orders/create", {
            assetsSymbol: symbol,
            usdMoney: _.round(pendingUSD, USD_PRECISION)
        }, locals.token, { cookies });

        if (apiResponse.statusCode == APIStatusCode.SUCCESS) {
            return {};
        } else if (apiResponse.statusCode == APIStatusCode.VALIDATION_ERROR_USD) {
            throw error(400, {
                apiStatusCode: apiResponse.statusCode,
                message: "Недостаточно долларов"
            });
        } else {
            throw genericServerError(apiResponse.statusCode);
        }
    },
    sellAssets: async ({ fetch, cookies, request, locals }) => {
        if (_.isNil(locals.token)) {
            throw error(403);
        }

        const data = await request.formData();
        const symbol = data.get("symbol") as string | null;
        const pendingAssets = data.get("pendingAssets") as number | null;

        if (_.isNil(symbol)) {
            throw error(400, { message: "Не указан актив" });
        }

        if (_.isNil(pendingAssets)) {
            throw error(400, { message: "Не указана сумма актива или она равна нулю" });
        }

        const apiResponse: Data.APINormalResponse<null> = await api(fetch, "POST", "orders/sell", {
            assetsSymbol: symbol,
            assetsCount: _.round(pendingAssets, ASSET_PRECISION)
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
        if (_.isNil(locals.token)) {
            throw error(403);
        }

        const data = await request.formData();
        const symbol = data.get("symbol") as string | null;

        if (_.isNil(symbol)) {
            throw error(400, { message: "Не указан актив" });
        }

        const apiResponse: Data.APINormalResponse<null> = await api(fetch, "POST", "orders/sell/all", {
            assetsSymbol: symbol,
        }, locals.token, { cookies });

        if (apiResponse.statusCode == APIStatusCode.SUCCESS) {
            return {};
        } else {
            throw genericServerError(apiResponse.statusCode);
        }
    },
} satisfies Actions;
