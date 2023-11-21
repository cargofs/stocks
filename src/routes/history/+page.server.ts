import _ from 'lodash';
import type { PageServerLoad } from './$types';
import { genericServerError } from '$lib';
import { api } from '$lib/server/api';

export const load = (async ({ fetch, depends, cookies, locals }) => {
    depends("app:token");
    depends("app:history");

    let orders: Data.Order[] | undefined;
    if (locals.token) {
        const response: Data.APINormalResponse<Data.Order[]> = await api(fetch, "GET", "orders", null, locals.token, { cookies });

        if (!_.isNil(response.data)) {
            orders = response.data;
        } else {
            throw genericServerError(response.statusCode);
        }
    }

    return {
        orders
    }
}) satisfies PageServerLoad;
