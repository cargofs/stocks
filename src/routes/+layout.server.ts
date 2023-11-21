import type { LayoutServerLoad } from './$types';

import { api } from '$lib/server/api';

export const load: LayoutServerLoad = (async ({ locals, fetch, depends }) => {
    depends("app:token");

    if (!locals.token) {
        console.log("whoami: no locals.token");
        return {};
    }

    try {
        const whoami: Data.APINormalResponse<Data.WhoAmIResponse> = await api(fetch, "GET", "auth/whoami", null, locals.token, null);

        if (whoami.data) {
            const { id, login } = whoami.data;
            console.log("whoami:", { id, login });

            return {
                id,
                login
            };
        }
    } catch (error) {
        console.log("whoami: optimistically ignoring", { error });
    }

    return {};
});
