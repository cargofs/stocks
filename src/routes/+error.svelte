<script lang="ts">
    import { dev } from "$app/environment";
    import { page } from "$app/stores";
    import { APIStatusCode } from "$lib";
    import _ from "lodash";

    $: isTokenError =
        $page.error?.apiStatusCode &&
        [
            APIStatusCode.WRONG_TOKEN,
            APIStatusCode.TOKEN_EXPIRED_NEED_LOGIN,
        ].includes($page.error?.apiStatusCode);

    let errorCodeString: string | undefined = undefined;

    $: {
        if (
            !_.isNil($page.error?.apiStatusCode) &&
            !_.isNil($page.error?.httpStatusCode)
        ) {
            errorCodeString = `${$page.error?.httpStatusCode}, ${$page.error?.apiStatusCode}`;
        } else if (!_.isNil($page.error?.apiStatusCode)) {
            errorCodeString = `${$page.error?.apiStatusCode}`;
        } else if (!_.isNil($page.error?.httpStatusCode)) {
            errorCodeString = `${$page.error?.httpStatusCode}`;
        }
    }
</script>

<div class="content">
    <h1>
        Ошибка {$page.status}{_.isNil(errorCodeString)
            ? ""
            : ` (${errorCodeString})`}
    </h1>

    <p><i>{$page.error?.message ?? ""}</i></p>

    <a
        class="button is-danger"
        data-sveltekit-reload
        href={isTokenError
            ? `/account/login?continue=${encodeURIComponent(
                  $page.url.pathname
              )}&forcedLogout=1`
            : $page.url.pathname}
    >
        {#if isTokenError}
            Войти заново
        {:else}
            Обновить страницу
        {/if}
    </a>

    {#if dev}
        <pre>Debug: {JSON.stringify($page.error)}</pre>
    {/if}
</div>
