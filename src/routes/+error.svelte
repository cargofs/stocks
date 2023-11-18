<script>
    import { dev } from "$app/environment";
    import { page } from "$app/stores";
</script>

<div class="content">
    <h1>Ошибка {$page.status}</h1>

    <p><i>{$page.error?.message ?? ""}</i></p>

    {#if dev}
        <pre>Debug: $page.error: {JSON.stringify($page.error)}</pre>
    {/if}
</div>
