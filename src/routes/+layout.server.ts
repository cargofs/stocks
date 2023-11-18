import type { LayoutServerLoad } from './$types';

import { CookieName } from '$lib';

export const load = (async ({ cookies }) => {
    const username = cookies.get(CookieName.DISPLAY_USERNAME);

    console.log({ username });

    return {
        username
    };
}) satisfies LayoutServerLoad;
