import { APIStatusCode, CookieName, genericServerError } from '$lib';
import { api } from '$lib/server/api';
import { error, type Actions } from '@sveltejs/kit';

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
