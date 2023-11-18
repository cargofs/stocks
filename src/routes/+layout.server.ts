import type { LayoutServerLoad } from './$types';

import { fail } from '@sveltejs/kit';
import { api } from '$lib/server/api';

export const load: LayoutServerLoad = (async ({ locals, fetch, url, cookies }) => {
    if (!locals.token) {
        console.log("no locals.token");
        return {};
    }

    const whoami: Data.APINormalResponse<Data.WhoAmIResponse> = await api(fetch, "GET", "auth/whoami", null, locals.token, { cookies, url });

    if (whoami.data) {
        const { id, login, money } = whoami.data;

        return {
            id,
            login,
            money
        };
    } else {
        return fail(500, { message: whoami.message });
    }
});
