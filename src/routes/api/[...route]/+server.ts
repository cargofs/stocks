import _ from 'lodash';
import type { RequestEvent, RequestHandler } from './$types';
import { env } from '$lib/server';

async function respond({ request, url, platform, fetch }: RequestEvent): Promise<Response> {
    const apiServer = env(platform, "API_SERVER");

    const newUrl = apiServer + url.pathname + url.search;

    console.log("gateway calling", { method: request.method, url: url.toString(), newUrl });

    const headers: { [key: string]: string } = {};
    for (const header of request.headers.keys()) {
        headers[header] = request.headers.get(header)!;
    }

    const newRequest = new Request(newUrl, {
        method: request.method,
        body: request.body,
        headers: _.pick(headers, "token", "content-type"),
        duplex: "half", // duplex is a thing: https://github.com/whatwg/fetch/pull/1457
    } as RequestInit);

    const response = await fetch(newRequest);

    return response;
}

export const GET: RequestHandler = async (requestEvent) => {
    return respond(requestEvent);
}

export const POST: RequestHandler = async (requestEvent) => {
    return respond(requestEvent);
}
