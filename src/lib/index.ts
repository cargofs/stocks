import { dev } from '$app/environment';
import { error, fail } from '@sveltejs/kit';
import _ from 'lodash';

export enum CookieName {
    SESSION = "SESSION",
    DISPLAY_USERNAME = "DISPLAY_USERNAME"
}

type FetchFunction = (input: URL | RequestInfo, init?: RequestInit | undefined) => Promise<Response>;

export function notFound() {
    return error(404, "Not Found");
}

export async function api<Req, Res>(fetch: FetchFunction, method: string, path: string, body: Req | null, token: string | null): Promise<Data.APINormalResponse<Res>> {
    const normalResponse: Data.APINormalResponse<Res> = await plainAPI(fetch, method, path, body, token);
    console.log("api status", _.pick(normalResponse, "statusCode", "message"));
    return normalResponse;
}

export async function plainAPI<Req, Res>(fetch: FetchFunction, method: string, path: string, body: Req | null, token: string | null): Promise<Res> {
    console.log("plain api calling", { method, path });
    logSensitive("...with", { body, token });

    const headers = new Headers();
    let bodyString: string | undefined = undefined;

    if (method == "POST") {
        headers.set("content-type", "application/json");
        bodyString = JSON.stringify(body);
    }

    if (token !== null) {
        headers.set("token", token);
    }

    const response = await fetch("/api/v1/" + path, {
        method,
        headers,
        body: bodyString
    });

    const json: Data.APIPlainResponse<Res> = await response.json();

    if (isAPIUnexpectedResponse(json)) {
        console.log("api got 'unexpected' response", json);
        throw fail(500, { error: "APIUnexpectedResponse" });
    } else {
        if (_.isArray(json) && json.length > 0) {
            logSensitive(`api got array with ${json.length} items, first item`, json[0]);
        } else {
            logSensitive("api got full", json);
        }
    }

    return json;
}

function isAPIUnexpectedResponse<T>(response: Data.APIResponse<T> | Data.APIPlainResponse<T>): response is Data.APIUnexpectedResponse {
    return (response as Data.APIUnexpectedResponse).timestamp !== undefined;
}

export function logSensitive(...data: unknown[]) {
    if (dev) {
        console.log(...data);
    }
}
