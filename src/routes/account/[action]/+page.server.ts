import { fail } from '@sveltejs/kit';
import type { Actions, RequestEvent } from './$types';
import { SESSION_COOKIE_NAME, api, logSensitive } from '$lib';
import { dev } from '$app/environment';

export const actions = {
    create: async (requestEvent) => {
        return authAction("registration", "Успешные регистрация и вход", requestEvent)
    },
    login: async (requestEvent) => {
        return authAction("login", "Успешный вход", requestEvent);
    }
} satisfies Actions;

async function authAction(path: string, successMessage: string, { request, cookies, fetch }: RequestEvent) {
    const data = await request.formData();

    const username = data.get("username") as string | null;
    const password = data.get("password") as string | null;

    console.log("account", { path, username });
    logSensitive({ password });

    if (!username || !password) {
        return fail(400, { error: "Не указано имя пользователя или пароль" });
    }

    try {
        const apiResponse = await api<Data.AuthRequest, Data.AuthResponse>(fetch, "POST", "auth/" + path, {
            login: username,
            password
        });

        const token = apiResponse.data?.token;
        logSensitive("got", { token });

        if (token) {
            cookies.set(SESSION_COOKIE_NAME, token, { path: "/", secure: !dev });
            console.log("cookie set");
            return { message: successMessage };
        } else {
            return fail(500, { error: "Произошла неожиданная ошибка. Попробуйте ещё раз позже" });
        }
    } catch (err) {
        console.log({ err });

        return fail(500, { error: "Произошла неожиданная ошибка. Попробуйте ещё раз позже" });
    }
}
