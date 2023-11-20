<script lang="ts" generics="T">
    export let property: T;
    export let name: string;

    export let sortProperty: T;
    export let sortDirection: number;

    function setSearchBy(property: T) {
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
