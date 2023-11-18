<script lang="ts">
    export let property: keyof Data.UserScoreFlat;
    export let name: string;

    export let sortProperty: string;
    export let sortDirection: number;

    function setSearchBy(property: keyof Data.UserScoreFlat) {
        if (sortProperty == property) {
            sortDirection = -sortDirection;
        } else {
            sortDirection = 1;
            sortProperty = property;
        }
    }
</script>

<th
    on:click={() => {
        setSearchBy(property);
    }}
    class="is-unselectable is-clickable"
>
    {name}
    {#if sortProperty == property}
        <span>
            {#if sortDirection == 1}
                <i class="fa-solid fa-arrow-down-a-z" />
            {:else}
                <i class="fa-solid fa-arrow-up-z-a" />
            {/if}
        </span>
    {/if}
</th>
