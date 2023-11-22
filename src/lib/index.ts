import { dev } from '$app/environment';
import { error } from '@sveltejs/kit';
import _ from 'lodash';

export const DEFAULT_SYMBOL = "BTC";

export const USD_PRECISION = 2;
export const USD_MIN = Math.pow(10, -USD_PRECISION);

export const ASSET_PRECISION = 6;
export const ASSET_MIN = Math.pow(10, -ASSET_PRECISION);

export const PERCENTAGE_PRECISION = 2;

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

export function genericServerError(apiStatusCode: APIStatusCode | undefined, httpStatusCode: number | undefined = undefined) {
    return error(500, {
        message: "Произошла неожиданная ошибка. Попробуйте ещё раз позже",
        apiStatusCode,
        httpStatusCode
    });
}

export function logSensitive(...data: unknown[]) {
    if (dev) {
        console.debug("[dev]", ...data);
    }
}

export function compareFn<T>(sortProperty: keyof T, sortDirection: number) {
    return (a: T, b: T) => {
        let ap = _.get(a, sortProperty);
        let bp = _.get(b, sortProperty);

        if (typeof ap == "string") {
            ap = ap.toLowerCase();
        }
        if (typeof bp == "string") {
            bp = bp.toLowerCase();
        }

        if (_.isNil(ap)) {
            return sortDirection;
        }
        if (_.isNil(bp)) {
            return -sortDirection;
        }

        return sortDirection * (ap === bp ? 0 : ap < bp ? -1 : 1);
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

    if (_.isNil(numberValue)) {
        return "??? %"
    }

    const format = Intl.NumberFormat("ru", {
        signDisplay: signForPositive ? "exceptZero" : "auto",
        style: "percent",
        minimumFractionDigits: PERCENTAGE_PRECISION,
        maximumFractionDigits: PERCENTAGE_PRECISION
    });

    return format.format(numberValue / 100);
}

export function formatDecimal(value: string | number | undefined, signForPositive: boolean): string {
    const numberValue = cleanNumber(value);

    if (_.isNil(numberValue)) {
        return `???`
    }

    const format = Intl.NumberFormat("ru", {
        signDisplay: signForPositive ? "exceptZero" : "auto",
        style: "decimal",
        minimumFractionDigits: ASSET_PRECISION,
        maximumFractionDigits: ASSET_PRECISION,
    });

    return format.format(numberValue);
}

export function formatUSD(value: string | number | undefined, signForPositive: boolean): string {
    const numberValue = cleanNumber(value);

    if (_.isNil(numberValue)) {
        return "??? $"
    }

    const format = Intl.NumberFormat("ru", {
        signDisplay: signForPositive ? "exceptZero" : "auto",
        style: "currency",
        currency: "USD",
        minimumFractionDigits: USD_PRECISION,
        maximumFractionDigits: USD_PRECISION,
    });

    return format.format(numberValue);
}
