import { dev } from '$app/environment';
import { env as dynamicPrivateEnv } from '$env/dynamic/private';
import { fail } from '@sveltejs/kit';

export function env<
    K extends keyof App.Env & keyof typeof dynamicPrivateEnv
>(
    platform: Readonly<App.Platform> | undefined,
    key: K
): string {
    let value: string | undefined = undefined;

    if (dev) {
        value = dynamicPrivateEnv[key];
    } else {
        const platformEnv = platform?.env;
        if (platformEnv) {
            value = platformEnv[key];
        }
    }

    if (value === undefined) {
        console.log("environment variable not available", { dev, key });
        throw fail(500, { error: "environment variable not available", dev, key })
    }

    return value;
}
