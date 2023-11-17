// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        // interface Locals {}
        // interface PageData {}

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
    }

    interface TargetMod {
        path?: string;
        nameParts: string[];
        inner?: TargetMod[];
    }

    namespace Data {
        type APIResponse<T> = APIUnexpectedResponse | APINormalResponse<T>;

        interface APIUnexpectedResponse {
            timestamp: string
            status: number
            error: string
            path: string
        }

        interface APINormalResponse<T> {
            statusCode: number
            message: string
            data: T?
        }

        interface SymbolBrief {
            symbol: string
            price: number
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
    }
}

export { };
