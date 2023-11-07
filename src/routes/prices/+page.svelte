<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

{#if data.prices.length > 0}
    <table class="table is-hoverable is-striped is-bordered">
        <thead>
            <tr>
                <th>Монета</th>
                <th>Цена (USD)</th>
            </tr>
        </thead>
        <tbody>
            {#each data.prices as price}
                <tr>
                    <td>{price.symbol}</td>
                    <td>{price.price}</td>
                </tr>
            {/each}
        </tbody>
    </table>
{:else}
    Нет данных
{/if}
