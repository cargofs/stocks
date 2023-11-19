import type { LayoutServerLoad } from './$types';

import { api } from '$lib/server/api';
import { genericServerError } from '$lib';

export const load: LayoutServerLoad = (async ({ locals, fetch, cookies, depends }) => {
    depends("app:token");

    if (!locals.token) {
        console.log("no locals.token");
        return {};
    }

    const whoami: Data.APINormalResponse<Data.WhoAmIResponse> = await api(fetch, "GET", "auth/whoami", null, locals.token, { cookies });

    if (whoami.data) {
        const { id, login, money } = whoami.data;

        return {
            id,
            login,
            money
        };
    } else {
        throw genericServerError(whoami.statusCode);
    }
});
