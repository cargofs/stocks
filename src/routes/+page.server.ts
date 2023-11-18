import { CookieName } from '$lib';
import type { Actions } from '@sveltejs/kit';

export const actions = {
    logout: async ({ cookies }) => {
        cookies.delete(CookieName.SESSION);
        cookies.delete(CookieName.DISPLAY_USERNAME);
        console.log("cookies deleted");
        return { message: "Успешный выход из учётной записи" };
    },
} satisfies Actions;
