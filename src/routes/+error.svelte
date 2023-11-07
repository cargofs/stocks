<script>
    import { page } from "$app/stores";
</script>

<div class="content">
    <h1>Ошибка {$page.status}</h1>

    <p><i>{$page.error?.message ?? ""}</i></p>
</div>
