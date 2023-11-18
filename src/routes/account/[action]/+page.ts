import type { PageLoad } from './$types';
import { notFound } from '$lib';

export const load: PageLoad = async ({ params, url }) => {
    if (!["create", "login"].includes(params.action)) {
        throw notFound();
    }

    return {
        action: params.action,
        continue: url.searchParams.get("continue"),
        forcedLogout: url.searchParams.get("forcedLogout")
    }
};
