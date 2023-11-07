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

<p>{data}</p>
