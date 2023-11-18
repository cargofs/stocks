import type { LayoutServerLoad } from './$types';

import { APIStatusCode, CookieName, api } from '$lib';
import { fail, redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = (async ({ locals, fetch, url, cookies }) => {
    if (!locals.token) {
        console.log("no locals.token");
        return {};
    }

    const whoami: Data.APINormalResponse<Data.WhoAmIResponse> = await api(fetch, "GET", "auth/whoami", null, locals.token);

    if (whoami.data) {
        const { id, login, money } = whoami.data;

        return {
            id,
            username: login,
            money
        };
    } else if ([APIStatusCode.WRONG_TOKEN, APIStatusCode.TOKEN_EXPIRED_NEED_LOGIN].includes(whoami.statusCode)) {
        cookies.delete(CookieName.SESSION);
        console.log("cookie deleted");

        throw redirect(303, `account/login?continue=${url.pathname}&forcedLogout=1`);
    } else {
        return fail(500, { message: whoami.message });
    }
});
