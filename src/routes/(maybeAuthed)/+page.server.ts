import { APIStatusCode, CookieName, genericServerError } from '$lib';
import { api } from '$lib/server/api';
import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import _ from 'lodash';

export const actions = {
    logout: async ({ cookies, fetch, locals }) => {
        if (!locals.token) {
            throw error(400, "Невозможно выйти, если не выполнен вход");
        }

        const response: Data.APINormalResponse<null> = await api(fetch, "POST", "auth/logout", null, locals.token, null);

        if ([APIStatusCode.SUCCESS, APIStatusCode.WRONG_TOKEN, APIStatusCode.TOKEN_EXPIRED_NEED_LOGIN].includes(response.statusCode)) {
            cookies.delete(CookieName.SESSION);
            console.log("cookie deleted");

            return { message: "Успешный выход из учётной записи" };
        } else {
            throw genericServerError(response.statusCode);
        }
    },
} satisfies Actions;

export const load = (async ({ fetch, depends, cookies, locals }) => {
    depends("app:token");
    depends("app:balances");

    let balanceInfo: Data.FullBalanceInfoFlat | undefined;
    if (locals.token) {
        const response: Data.APINormalResponse<Data.FullBalanceInfo> = await api(fetch, "GET", "balance/info", null, locals.token, { cookies });

        if (!_.isNil(response.data)) {
            balanceInfo = {
                ...response.data,
                assets: response.data.assets.map(asset => {
                    return {
                        ..._.pick(asset, "assetsCount", "assetsSymbol"),
                        ...asset.changeCost
                    } satisfies Data.AssetBalanceFlat;
                })
            }
        } else {
            throw genericServerError(response.statusCode);
        }
    }

    return {
        balanceInfo
    }
}) satisfies PageServerLoad;
