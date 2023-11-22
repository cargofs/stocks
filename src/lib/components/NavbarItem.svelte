<script lang="ts">
    import { page } from "$app/stores";
    import _ from "lodash";
    import { invalidateAll } from "$app/navigation";
    import NavbarTargetVisual from "./NavbarTargetVisual.svelte";

    export let target: TargetMod;

    async function click() {
        if (target.logout) {
            await fetch("/?/logout", { method: "POST", body: "" });
            await invalidateAll();
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
        ($page.url.pathname + $page.url.search).startsWith(target.path)) ||
        target.path == $page.url.pathname}
    href={target.logout ? null : target.path}
    on:click={target.inner ? null : click}
>
    {#if target.inner}
        <a class="navbar-link"><NavbarTargetVisual {target} /></a>

        <div class="navbar-dropdown is-right">
            {#each target.inner as innerTarget}
                <svelte:self target={innerTarget} />
            {/each}
        </div>
    {:else}
        <NavbarTargetVisual {target} />
    {/if}
</svelte:element>
