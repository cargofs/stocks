<script lang="ts">
    import { onMount, setContext } from "svelte";
    import { writable, type Writable } from "svelte/store";

    import Navbar from "$lib/components/Navbar.svelte";
    import Footer from "$lib/components/Footer.svelte";

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

<Footer />

<style global>
    @import "node_modules/bulma/css/bulma.min.css";

    @import "node_modules/@fortawesome/fontawesome-free/css/all.min.css";
</style>
