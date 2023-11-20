<script lang="ts">
    import { page } from "$app/stores";
    import _ from "lodash";

    import type { PageData } from "./$types";
    import {
        formatDecimal,
        formatPercentage,
        formatUSD,
        compareFn,
    } from "$lib";

    import CallToLogin from "$lib/components/CallToLogin.svelte";
    import HeaderCell from "$lib/components/HeaderCell.svelte";
    import RefreshButton from "$lib/components/RefreshButton.svelte";

    export let data: PageData;

    let searchQuery = "";

    let sortProperty: keyof Data.AssetBalanceFlat = "costUsd";
    let sortDirection = -1;

    $: sortedBalances = (data.balanceInfo?.assets ?? [])
        .filter((asset) => {
            return (
                searchQuery.length < 1 ||
                asset.assetsSymbol
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            );
        })
        .sort(compareFn(sortProperty, sortDirection));

    let headers: [keyof Data.AssetBalanceFlat, string][] = [
        ["assetsSymbol", "Актив"],
        ["assetsCount", "Баланс"],
        ["spentUsd", "Потрачено"],
        ["costUsd", "Текущая стоимость"],
        ["percent", "Процент выигрыша"],
    ];
</script>

<div class="content">
    {#if _.isNil($page.data.login)}
        <section class="hero">
            <div class="hero-body">
                <p class="title">Добро пожаловать в CoinStocks!</p>
                <p class="subtitle">
                    <CallToLogin purpose="увидеть свой баланс" />
                </p>
            </div>
        </section>
    {:else}
        <div class="level">
            <div class="level-item has-text-centered">
                <div>
                    <p class="heading">Баланс</p>
                    <p class="title">
                        {formatUSD(data.balanceInfo?.usdMoney, false)}
                    </p>
                </div>
            </div>

            <div class="level-item has-text-centered">
                <div>
                    <p class="heading">Активов на</p>
                    <p class="title">
                        {formatUSD(data.balanceInfo?.changeCost.costUsd, false)}
                    </p>
                </div>
            </div>

            <div class="level-item has-text-centered">
                <div>
                    <p class="heading">Итого</p>
                    <p class="title">
                        {formatUSD(
                            (data.balanceInfo?.usdMoney ?? 0) +
                                (data.balanceInfo?.changeCost.costUsd ?? 0),
                            false
                        )}
                    </p>
                </div>
            </div>
        </div>

        <div class="field is-grouped">
            <div class="control is-expanded">
                <input
                    class="input is-danger"
                    type="text"
                    bind:value={searchQuery}
                    maxlength="200"
                    placeholder="Поиск по названию актива"
                />
            </div>

            <div class="control">
                <RefreshButton invalidationURL="app:balances" />
            </div>
        </div>

        {#if sortedBalances.length > 0}
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
                                />
                            {/each}
                        </tr>
                    </thead>
                    <tbody>
                        {#each sortedBalances as balance}
                            <tr>
                                <td>
                                    <a
                                        class="has-text-danger"
                                        href={"/prices/" +
                                            encodeURIComponent(
                                                balance.assetsSymbol
                                            )}>{balance.assetsSymbol}</a
                                    >
                                </td>
                                <td
                                    >{formatDecimal(
                                        balance.assetsCount,
                                        false
                                    )}</td
                                >
                                <td>{formatUSD(balance.spentUsd, false)}</td>
                                <td>{formatUSD(balance.costUsd, false)}</td>
                                <td
                                    >{formatPercentage(
                                        balance.percent,
                                        true
                                    )}</td
                                >
                            </tr>
                        {/each}
                    </tbody>
                    {#if searchQuery.length == 0}
                        <tfoot>
                            <tr>
                                <th>Итого</th>
                                <th />
                                <th
                                    >{formatUSD(
                                        data.balanceInfo?.changeCost.spentUsd,
                                        false
                                    )}</th
                                >
                                <th
                                    >{formatUSD(
                                        data.balanceInfo?.changeCost.costUsd,
                                        false
                                    )}</th
                                >
                                <th
                                    >{formatPercentage(
                                        data.balanceInfo?.changeCost.percent,
                                        true
                                    )}</th
                                >
                            </tr>
                        </tfoot>
                    {/if}
                </table>
            </div>
        {:else}
            <div class="content">
                <p>
                    {#if data.balanceInfo?.assets.length ?? 0 > 0}
                        Не найдено ни одного актива.
                    {:else}
                        У вас нет активов!
                    {/if}

                    Перейдите в
                    <a class="has-text-danger" href="/prices">биржу</a>, чтобы
                    купить
                </p>
            </div>
        {/if}
    {/if}
</div>
