<script lang="ts">
    import { invalidate } from "$app/navigation";
    import _ from "lodash";
    import { onDestroy, onMount } from "svelte";

    export let invalidationURL: string;
    export let additionalAction: () => void = () => {};

    let loading: boolean = false;

    async function refresh() {
        loading = true;

        let promise = invalidate(invalidationURL);
        additionalAction();
        await promise;

        loading = false;
    }

    let autoEnabled: boolean = false;
    let autoDelay = 5000;
    let interval: number | undefined = undefined;

    async function autoRefresh() {
        if (autoEnabled && !loading) {
            await refresh();
        }
    }

    async function toggleAuto() {
        autoEnabled = !autoEnabled;
    }

    onMount(async () => {
        interval = setInterval(autoRefresh, autoDelay);
    });

    onDestroy(() => {
        autoEnabled = false;
        clearInterval(interval);
    });
</script>

<div class="field has-addons">
    <p class="control">
        <button
            class="button is-danger is-light"
            class:is-loading={loading}
            on:click={refresh}
        >
            <i class="fa-solid fa-refresh" />
        </button>
    </p>

    <p class="control">
        <button class="button is-light" on:click={toggleAuto}>
            <i
                class="fa-solid"
                class:fa-pause={autoEnabled}
                class:fa-play={!autoEnabled}
            />
        </button>
    </p>
</div>
