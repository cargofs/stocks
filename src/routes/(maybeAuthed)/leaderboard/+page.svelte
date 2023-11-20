<script lang="ts">
    import type { PageData } from "./$types";

    import LeaderboardHeaderCell from "$lib/components/LeaderboardHeaderCell.svelte";
    import RefreshButton from "$lib/components/RefreshButton.svelte";

    import _ from "lodash";
    import { formatPercentage, formatUSD } from "$lib";

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
        .sort((a, b) => {
            let ap = _.get(a, sortProperty);
            let bp = _.get(b, sortProperty);

            if (typeof ap == "string") {
                ap = ap.toLowerCase();
            }
            if (typeof bp == "string") {
                bp = bp.toLowerCase();
            }

            if (_.isNil(ap)) {
                return sortDirection;
            }
            if (_.isNil(bp)) {
                return -sortDirection;
            }

            return sortDirection * (ap === bp ? 0 : ap < bp ? -1 : 1);
        });

    let headers: [keyof Data.UserScoreFlat, string][] = [
        ["login", "Имя пользователя"],
        ["spentUsd", "Баланс относительно начального"],
        ["costUsd", "Стоимость активов"],
        ["percent", "Процент выигрыша"],
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
        <table class="table is-hoverable is-striped is-bordered">
            <thead>
                <tr>
                    {#each headers as header}
                        <LeaderboardHeaderCell
                            bind:sortProperty
                            bind:sortDirection
                            property={header[0]}
                            name={header[1]}
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
                        <td>{formatUSD(userScoreFlat.spentUsd, false)}</td>
                        <td>{formatUSD(userScoreFlat.costUsd, false)}</td>
                        <td>{formatPercentage(userScoreFlat.percent, true)}</td>
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

<style>
    td {
        width: max-content;
    }
</style>
