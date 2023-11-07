<script lang="ts">
    import Navbar from "./Navbar.svelte";
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
