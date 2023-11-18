import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad, RequestEvent } from './$types';
import { APIStatusCode, CookieName, logSensitive } from '$lib';
import { dev } from '$app/environment';
import { api } from '$lib/server/api';

export const load = (async ({ locals, url }) => {
    if (locals.token) {
        console.log("already logged in! redirecting");
        throw redirect(303, url.searchParams.get("continue") ?? "/")
    }
}) satisfies PageServerLoad;

export const actions = {
    create: async (requestEvent) => {
        return authAction("registration", "Успешные регистрация и вход", requestEvent)
    },
    login: async (requestEvent) => {
        return authAction("login", "Успешный вход", requestEvent);
    },
} satisfies Actions;

async function authAction(path: string, successMessage: string, { request, cookies, fetch }: RequestEvent) {
    const data = await request.formData();

    const login = data.get("login") as string | null;
    const password = data.get("password") as string | null;

    console.log("account", { path, login });
    logSensitive("...with", { password });

    if (!login || !password) {
        return fail(400, { error: "Не указано имя пользователя или пароль" });
    }

    const apiResponse = await api<Data.AuthRequest, Data.AuthResponse>(fetch, "POST", "auth/" + path, {
        login: login,
        password
    }, null, null);

    const token = apiResponse.data?.token;
    logSensitive("got", { token });

    if (token) {
        cookies.set(CookieName.SESSION, token, { path: "/", secure: !dev });
        console.log("cookie set");
        return { message: successMessage };
    } else if (path == "registration" && apiResponse.statusCode == APIStatusCode.LOGIN_ALREADY_EXIST) {
        throw error(403, {
            apiStatusCode: apiResponse.statusCode,
            message: "Пользователь с данным именем уже существует"
        });
    } else {
        return fail(500, { error: "Произошла неожиданная ошибка. Попробуйте ещё раз позже" });
    }
}
