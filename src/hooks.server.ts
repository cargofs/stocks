import { CookieName } from '$lib';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.token = event.cookies.get(CookieName.SESSION);

    const response = await resolve(event);
    return response;
};
