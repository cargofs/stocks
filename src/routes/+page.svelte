<script lang="ts">
    import { onMount } from "svelte";

    let data = "";

    onMount(() => {
        fetch("/api/v1/coins/prices")
            .then((res) => res.json())
            .then((json) => {
                console.log(json);
                data = JSON.stringify(json);
            });
    });
</script>

<h1>Welcome to SvelteKit</h1>
<p>
    Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>
<p>{data}</p>
