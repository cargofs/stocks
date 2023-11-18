import { dev } from '$app/environment';
import { error, fail } from '@sveltejs/kit';
import _ from 'lodash';

export const DEFAULT_SYMBOL = "BTC";

export enum CookieName {
    SESSION = "SESSION"
}

export enum APIStatusCode {
    SUCCESS = 0,

    INTERNAL_SERVER_ERROR = 1000,

    TOKEN_HEADER_NOT_FOUND = 1101,
    WRONG_TOKEN = 1102,
    TOKEN_EXPIRED_NEED_LOGIN = 1103,
    WRONG_LOGIN_OR_PASSWORD = 1104,
    LOGIN_ALREADY_EXIST = 1105,

    VALIDATION_ERROR = 1200,
    VALIDATION_ERROR_USD = 1201,
    VALIDATION_ERROR_ASSETS = 1202,

    NOT_FOUND = 1301,
    LACK_OF_RESOURCES = 1302,
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

function cleanNumber(value: string | number | undefined): number | undefined {
    let numberValue: number | undefined;

    if (typeof value == "string") {
        numberValue = Number(value);
    } else {
        numberValue = value;
    }

    return numberValue;
}

export function formatPercentage(value: string | number | undefined, signForPositive: boolean): string {
    const numberValue = cleanNumber(value);

    if (numberValue === undefined) {
        return "??? %"
    }

    const format = Intl.NumberFormat("ru", {
        signDisplay: signForPositive ? "exceptZero" : "auto",
        style: "percent",
        maximumFractionDigits: 2
    });

    return format.format(numberValue / 100);
}

export function formatUSD(value: string | number | undefined, signForPositive: boolean): string {
    const numberValue = cleanNumber(value);

    if (numberValue === undefined) {
        return "??? $"
    }

    const format = Intl.NumberFormat("ru", {
        signDisplay: signForPositive ? "exceptZero" : "auto",
        style: "currency",
        currency: "USD"
    });

    return format.format(numberValue);
}
