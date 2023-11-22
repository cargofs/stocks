<script lang="ts">
    import { page } from "$app/stores";

    export let purpose: string;
</script>

<a
    class="has-text-danger"
    href={`/account/login?continue=${encodeURIComponent(
        $page.url.pathname,
    )}&explicit=1`}>Войдите</a
>
в учётную запись или
<a
    class="has-text-danger"
    href={`/account/create?continue=${encodeURIComponent(
        $page.url.pathname,
    )}&explicit=1`}>создайте новую</a
>, чтобы {purpose}.
