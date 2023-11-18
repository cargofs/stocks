<script lang="ts">
    import { page } from "$app/stores";
    import { getContext } from "svelte";
    import type { Writable } from "svelte/store";
    import _ from "lodash";
    import { goto, invalidateAll } from "$app/navigation";

    export let target: TargetMod;

    const pageTitleParts: Writable<string[]> = getContext("pageTitleParts");

    async function click() {
        pageTitleParts.set(target.nameParts);

        if (target.logout) {
            await fetch("/?/logout", { method: "POST", body: "" });
            await invalidateAll();
            await goto("/");
        }
    }
</script>

<svelte:element
    this={target.inner ? "div" : "a"}
    class="navbar-item"
    class:has-dropdown={target.inner}
    class:is-hoverable={target.inner}
    class:is-active={(target.path &&
        target.path != "/" &&
        $page.url.pathname.startsWith(target.path)) ||
        target.path == $page.url.pathname}
    href={target.logout ? null : target.path}
    on:click={target.inner ? null : click}
>
    {#if target.inner}
        <a class="navbar-link">{_.last(target.nameParts)}</a>

        <div class="navbar-dropdown is-right">
            {#each target.inner as innerTarget}
                <svelte:self target={innerTarget} />
            {/each}
        </div>
    {:else}
        {_.last(target.nameParts)}
    {/if}
</svelte:element>
