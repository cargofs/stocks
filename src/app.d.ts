import type { APIStatusCode } from '$lib'

declare global {
    namespace App {
        interface Error {
            apiStatusCode?: APIStatusCode
        }

        interface Locals {
            token?: string
        }

        interface PageData {
            id?: number
            login?: string
            money?: number
        }

        interface Platform {
            env?: Env;
        }

        interface Env {
            /// URL of main API server, like "http://1.2.3.4:5678"
            API_SERVER: string;
        }
    }

    interface Target {
        path?: string;
        name: string;
        inner?: Target[];
        condition?: boolean;
        preload?: boolean;
        logout?: boolean;
    }

    interface TargetMod {
        path?: string;
        nameParts: string[];
        inner?: TargetMod[];
        preload?: boolean;
        logout?: boolean;
    }

    namespace Data {
        type APIResponse<T> = APIUnexpectedResponse | APINormalResponse<T>;
        type APIPlainResponse<T> = APIUnexpectedResponse | T;

        interface APIUnexpectedResponse {
            timestamp: string
            status: number
            error: string
            path: string
        }

        interface APINormalResponse<T> {
            statusCode: APIStatusCode
            message: string
            data: T?
        }

        interface SymbolBrief {
            symbol: string
            price: number
        }

        interface SymbolStats {
            priceChange: number
            priceChangePercent: number
            weightedAvgPrice: number
            prevClosePrice: number
            lastPrice: number
            bidPrice: number
            askPrice: number
            openPrice: number
            highPrice: number
            lowPrice: number
            volume: number
            openTime: number
            closeTime: number
            firstId: number
            lastId: number
            count: number
        }

        interface PricePoint {
            openTime: number
            open: number
            high: number
            low: number
            close: number
            volume: number
            closeTime: number
            quoteAssetVolume: number
            numberOfTrades: number
            takerBuyBaseAssetVolume: number
            takerBuyQuoteAssetVolume: number
        }

        interface AuthRequest {
            login: string,
            password: string,
        }

        interface AuthResponse {
            token: string
        }

        interface WhoAmIResponse {
            id: number
            login: string
            token: string
            money: number
        }
    }
}

export { };
