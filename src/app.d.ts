// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}

		interface Platform {
			env?: {
				/// URL of main API server, like "http://1.2.3.4:5678"
				API_SERVER: string;
			};
		}
	}
}

export { };
