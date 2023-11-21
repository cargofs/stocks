import type { RequestEvent, RequestHandler } from './$types';
import { env } from '$lib/server';

async function respond({ request, url, platform, fetch }: RequestEvent): Promise<Response> {
    const apiServer = env(platform, "API_SERVER");

    const newUrl = apiServer + url.pathname + url.search;

    console.log("gateway calling", { method: request.method, url: url.toString(), newUrl });

    const newRequest = new Request(newUrl, request);

    const response = await fetch(newRequest);

    return response;
}

export const GET: RequestHandler = async (requestEvent) => {
    return respond(requestEvent);
}

export const POST: RequestHandler = async (requestEvent) => {
    return respond(requestEvent);
}
