<script lang="ts">
    import type { PageData } from "./$types";

    import HeaderCell from "$lib/components/HeaderCell.svelte";
    import RefreshButton from "$lib/components/RefreshButton.svelte";

    import _ from "lodash";
    import { compareFn, formatPercentage, formatUSD } from "$lib";

    export let data: PageData;

    let searchQuery = "";

    let sortProperty: keyof Data.UserScoreFlat = "percent";
    let sortDirection = -1;

    $: sortedLeaderboard = (data.userScoreFlatList ?? [])
        .filter((userScoreFlat) => {
            return (
                searchQuery.length < 1 ||
                userScoreFlat.login
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            );
        })
        .sort(compareFn(sortProperty, sortDirection));

    let headers: [keyof Data.UserScoreFlat, string][] = [
        ["login", "Имя пользователя"],
        ["spentUsd", "Потрачено на активы"],
        ["costUsd", "Текущая стоимость активов"],
        ["percent", "Выигрыш"],
    ];
</script>

<div class="field is-grouped">
    <div class="control is-expanded">
        <input
            class="input is-danger"
            type="text"
            bind:value={searchQuery}
            maxlength="200"
            placeholder="Поиск по имени пользователя"
        />
    </div>

    <div class="control">
        <RefreshButton invalidationURL="app:leaderboard" />
    </div>
</div>

{#if sortedLeaderboard.length > 0}
    <div class="table-container">
        <table class="table is-hoverable is-fullwidth">
            <thead>
                <tr>
                    {#each headers as header}
                        <HeaderCell
                            bind:sortProperty
                            bind:sortDirection
                            property={header[0]}
                            name={header[1]}
                            class={header[0] == "login" ? "" : "has-text-right"}
                        />
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#each sortedLeaderboard as userScoreFlat}
                    <tr
                        class:has-background-danger={userScoreFlat.login ==
                            data.login}
                        class:has-text-white={userScoreFlat.login == data.login}
                    >
                        <td>{userScoreFlat.login}</td>
                        <td class="has-text-right is-family-monospace"
                            >{formatUSD(userScoreFlat.spentUsd, false)}</td
                        >
                        <td class="has-text-right is-family-monospace"
                            >{formatUSD(userScoreFlat.costUsd, false)}</td
                        >
                        <td class="has-text-right is-family-monospace"
                            >{formatPercentage(userScoreFlat.percent, true)}</td
                        >
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>
{:else}
    <div class="content">
        <p>Не найдено ни одного пользователя</p>
    </div>
{/if}
