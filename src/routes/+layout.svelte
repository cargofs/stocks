<script lang="ts">
    import { onMount, setContext } from "svelte";
    import Navbar from "./Navbar.svelte";
    import { writable, type Writable } from "svelte/store";

    const pageTitleParts: Writable<string[]> = writable();
    setContext("pageTitleParts", pageTitleParts);

    onMount(() => {
        pageTitleParts.subscribe((parts) => {
            document.title = ["CoinStocks"]
                .concat(parts)
                .filter((item) => item && item.length > 0)
                .join(" | ");
        });
    });
</script>

<Navbar />

<div class="mx-5 mb-5">
    <div class="container my-5">
        <slot />
    </div>
</div>

<style global>
    @import "node_modules/bulma/css/bulma.min.css";

    @import "node_modules/@fortawesome/fontawesome-free/css/all.min.css";
</style>
