import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';
import _ from 'lodash';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request, url, platform, fetch }) => {
    let apiServer = "";
    if (dev) {
        apiServer = env.API_SERVER;
    } else {
        apiServer = platform!.env!.API_SERVER;
    }

    const newUrl = apiServer + url.pathname;

    console.log("gateway calling", { url: url.toString(), newUrl });

    const headers: { [key: string]: string } = {};
    for (const header of request.headers.keys()) {
        headers[header] = request.headers.get(header)!;
    }

    const newRequest = new Request(newUrl, {
        method: "GET",
        body: request.body,
        headers: _.pick(headers, "token")
    });

    return await fetch(newRequest);
}
