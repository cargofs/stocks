<script lang="ts">
    import { page } from "$app/stores";
    import { invalidate } from "$app/navigation";
    import _ from "lodash";

    import type { PageData } from "./$types";
    import { formatAsset, formatUSD, compareFn } from "$lib";

    import CallToLogin from "$lib/components/CallToLogin.svelte";
    import HeaderCell from "$lib/components/HeaderCell.svelte";
    import RefreshButton from "$lib/components/RefreshButton.svelte";
    import { DateTime } from "luxon";

    export let data: PageData;

    $: haveOrdersData = !_.isNil(data.orders);
    $: showData = !_.isNil($page.data.login) && haveOrdersData;
    $: {
        if (!_.isNil($page.data.login) && !haveOrdersData) {
            invalidate("app:token");
        }
    }

    let searchQuery = "";

    let sortProperty: keyof Data.Order = "id";
    let sortDirection = -1;

    $: sortedOrders = (data.orders ?? [])
        .filter((order) => {
            return (
                searchQuery.length < 1 ||
                order.assetsSymbol
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                order.id
                    .toString()
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
            );
        })
        .sort(compareFn(sortProperty, sortDirection));

    let headers: [keyof Data.Order, string][] = [
        ["id", "Идентификатор операции"],
        ["date", "Дата"],
        ["assetsSymbol", "Актив"],
        ["assetsCount", "Изменение актива"],
        ["money", "Изменение баланса"],
    ];
</script>

<svelte:head>
    <title>CoinStocks | История операций</title>
</svelte:head>

<div class="content">
    {#if !showData}
        <div class="content">
            <article class="message">
                <div class="message-body">
                    <CallToLogin purpose="просмотреть историю операций" />
                </div>
            </article>
        </div>
    {:else}
        <div class="field is-grouped">
            <div class="control is-expanded">
                <input
                    class="input is-danger"
                    type="text"
                    bind:value={searchQuery}
                    maxlength="200"
                    placeholder="Поиск по названию актива или идентификатору операции"
                />
            </div>

            <div class="control">
                <RefreshButton invalidationURL="app:history" />
            </div>
        </div>

        {#if sortedOrders.length > 0}
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
                                    class={["assetsCount", "money"].includes(
                                        header[0],
                                    )
                                        ? "has-text-right"
                                        : ""}
                                />
                            {/each}
                        </tr>
                    </thead>
                    <tbody>
                        {#each sortedOrders as order}
                            <tr>
                                <td class="is-family-monospace">{order.id}</td>
                                <td
                                    >{DateTime.fromISO(order.date)
                                        .setLocale("ru")
                                        .toLocaleString(
                                            DateTime.DATETIME_MED_WITH_SECONDS,
                                        )}</td
                                >
                                <td>
                                    <a
                                        class="has-text-danger"
                                        href={"/prices/" +
                                            encodeURIComponent(
                                                order.assetsSymbol,
                                            )}>{order.assetsSymbol}</a
                                    >
                                </td>
                                <td
                                    class="has-text-right is-family-monospace"
                                    class:has-text-link={order.assetsCount < 0}
                                    >{formatAsset(order.assetsCount, true)}</td
                                >
                                <td
                                    class="has-text-right is-family-monospace"
                                    class:has-text-link={order.money < 0}
                                    >{formatUSD(order.money, true)}</td
                                >
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        {:else}
            <div class="content">
                <p>
                    {#if data.orders?.length ?? 0 > 0}
                        Не найдено ни одной операции.
                    {:else}
                        У вас ещё не было операций!
                    {/if}

                    Перейдите в
                    <a class="has-text-danger" href="/prices">биржу</a>, чтобы
                    произвести операцию
                </p>
            </div>
        {/if}
    {/if}
</div>
