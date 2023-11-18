import type { LayoutServerLoad } from './$types';

import { CookieName, logSensitive } from '$lib';

export const load = (async ({ cookies }) => {
    const username = cookies.get(CookieName.DISPLAY_USERNAME);
    const token = cookies.get(CookieName.SESSION);

    console.log({ username });
    logSensitive({ token });

    return {
        username,
        token
    };
}) satisfies LayoutServerLoad;
