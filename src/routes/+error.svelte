<script>
    import { dev } from "$app/environment";
    import { page } from "$app/stores";
    import { APIStatusCode } from "$lib";

    $: isTokenError =
        $page.error?.apiStatusCode &&
        [
            APIStatusCode.WRONG_TOKEN,
            APIStatusCode.TOKEN_EXPIRED_NEED_LOGIN,
        ].includes($page.error?.apiStatusCode);
</script>

<div class="content">
    <h1>
        Ошибка {$page.status}{$page.error?.apiStatusCode
            ? ` (${$page.error?.apiStatusCode})`
            : ""}
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
