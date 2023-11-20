<script lang="ts">
    import { invalidate } from "$app/navigation";

    export let invalidationURL: string;
    export let additionalAction: () => void = () => {};

    let loading: boolean = false;
</script>

<button
    class="button is-danger is-light"
    class:is-loading={loading}
    on:click={async () => {
        loading = true;

        let promise = invalidate(invalidationURL);
        additionalAction();
        await promise;

        loading = false;
    }}
>
    <i class="fa-solid fa-refresh" />
</button>
