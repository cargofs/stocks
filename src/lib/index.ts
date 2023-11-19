import { dev } from '$app/environment';
import { error } from '@sveltejs/kit';

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

export function notFound() {
    return error(404, "Not Found");
}

export function genericServerError(apiStatusCode: APIStatusCode | undefined) {
    return error(500, { message: "Произошла неожиданная ошибка. Попробуйте ещё раз позже", apiStatusCode });
}

export function logSensitive(...data: unknown[]) {
    if (dev) {
        console.debug("[dev]", ...data);
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

export function formatDecimal(value: string | number | undefined, signForPositive: boolean): string {
    const numberValue = cleanNumber(value);

    if (numberValue === undefined) {
        return `???`
    }

    const format = Intl.NumberFormat("ru", {
        signDisplay: signForPositive ? "exceptZero" : "auto",
        style: "decimal"
    });

    return format.format(numberValue);
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
