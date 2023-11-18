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
    console.log("api calling", { method, path });
    logSensitive({ body });

    const headers = {};
    if (method == "POST") {
        headers["content-type"] = "application/json";
    }
    if (token !== null) {
        headers["token"] = "token";
    }

    const response = await fetch("/api/v1/" + path, {
        method,
        body: JSON.stringify(body),
        headers
    });

    const json: Data.APIResponse<Res> = await response.json();
    logSensitive("api got full", json);

    if (isAPIUnexpectedResponse(json)) {
        console.log("api got", json);
        throw fail(500, { error: "APIUnexpectedResponse" });
    } else {
        console.log("api got", _.pick(json, "statusCode", "message"));
    }

    return json;
}

function isAPIUnexpectedResponse<T>(response: Data.APIResponse<T>): response is Data.APIUnexpectedResponse {
    return (response as Data.APIUnexpectedResponse).timestamp !== undefined;
}

export function logSensitive(...data: unknown[]) {
    if (dev) {
        console.log(...data);
    }
}
