import { APIStatusCode, CookieName } from '$lib';
import { api } from '$lib/server/api';
import { fail, type Actions } from '@sveltejs/kit';

export const actions = {
    logout: async ({ cookies, fetch, locals }) => {
        if (!locals.token) {
            return fail(400, { error: "Невозможно выйти, если не выполнен вход" });
        }

        const response: Data.APINormalResponse<null> = await api(fetch, "POST", "auth/logout", null, locals.token, null);

        if ([APIStatusCode.SUCCESS, APIStatusCode.WRONG_TOKEN, APIStatusCode.TOKEN_EXPIRED_NEED_LOGIN].includes(response.statusCode)) {
            cookies.delete(CookieName.SESSION);
            console.log("cookie deleted");

            return { message: "Успешный выход из учётной записи" };
        } else {
            return fail(500, { error: "Не удалось выйти" });
        }
    },
} satisfies Actions;
