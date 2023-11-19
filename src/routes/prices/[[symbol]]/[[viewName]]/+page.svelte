<script lang="ts">
    import { Line } from "svelte-chartjs";
    import "chart.js/auto";
    import "chartjs-adapter-luxon";
    import { DateTime } from "luxon";
    import _ from "lodash";

    import type { PageData } from "./$types";
    import { goto, invalidate } from "$app/navigation";

    import {
        APIStatusCode,
        formatDecimal,
        formatPercentage,
        formatUSD,
    } from "$lib";
    import { priceViews } from "$lib/priceViews";
    import { page } from "$app/stores";
    import { enhance } from "$app/forms";

    export let data: PageData;

    $: currentPrice =
        data.briefs.find((brief) => brief.symbol == data.symbol)?.price ?? 0;

    let showPercent = true;
    function toggleShowPercent() {
        showPercent = !showPercent;
    }

    let pendingUSD = 0;
    let pendingAssets = 0;

    let lackOfAssets = false;
</script>

<div class="columns">
    <div class="column" class:is-three-quarters={$page.data.login}>
        <div class="level">
            <div class="level-left">
                <div class="level-item">
                    <div class="control">
                        <div class="select is-danger">
                            <select
                                value={data.symbol}
                                on:input={async (ev) => {
                                    const symbol = ev.currentTarget.value;
                                    await goto(
                                        `/prices/${symbol}/${data.view.name}`
                                    );
                                }}
                            >
                                {#each data.symbols as symbol}
                                    <option value={symbol}>{symbol}</option>
                                {/each}
                            </select>
                        </div>
                    </div>
                </div>

                <div class="level-item">
                    <div class="control">
                        <div class="select is-danger">
                            <select
                                value={data.view.name}
                                on:input={async (ev) => {
                                    const viewName = ev.currentTarget.value;
                                    await goto(
                                        `/prices/${data.symbol}/${viewName}`
                                    );
                                }}
                            >
                                {#each priceViews.map((view) => view.name) as viewName}
                                    <option value={viewName}>{viewName}</option>
                                {/each}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div class="level-right">
                <div
                    class="level-item has-text-right is-clickable"
                    on:click={toggleShowPercent}
                    on:keypress={toggleShowPercent}
                >
                    <div>
                        <p class="heading">За последние 24ч</p>
                        <p class="title">
                            {showPercent
                                ? formatPercentage(
                                      data.last24hStats.priceChangePercent,
                                      true
                                  )
                                : formatUSD(
                                      data.last24hStats.priceChange,
                                      true
                                  )}
                        </p>
                    </div>
                </div>

                <div class="field">
                    <p class="control">
                        <button
                            class="button is-danger is-light"
                            on:click={async () => {
                                await invalidate("app:prices");
                            }}
                        >
                            <i class="fa-solid fa-refresh" />
                        </button>
                    </p>
                </div>
            </div>
        </div>

        <Line
            data={{
                labels: _.concat(
                    data.prices.map((point) => point.openTime),
                    [DateTime.now().toMillis()]
                ),
                datasets: [
                    {
                        label: "Открытие",
                        data: _.concat(
                            data.prices.map((point) => point.open),
                            [currentPrice]
                        ),
                        fill: true,
                        borderColor: "#f14668",
                        tension: 0.1,
                    },
                ],
            }}
            options={{
                scales: {
                    x: {
                        type: "time",
                        time: {
                            unit: data.view.timeUnit,
                            isoWeekday: true,
                        },
                    },
                    y: {
                        ticks: {
                            callback: function (value, index, ticks) {
                                return formatUSD(value, false);
                            },
                        },
                    },
                },
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                let label = context.dataset.label || "";

                                if (label) {
                                    label += ": ";
                                }
                                if (context.parsed.y !== null) {
                                    label += formatUSD(context.parsed.y, false);
                                }
                                return label;
                            },
                        },
                    },
                },
            }}
        />
    </div>

    {#if $page.data.login}
        <div class="column">
            <form
                method="POST"
                use:enhance={() => {
                    return async ({ result, update }) => {
                        console.log(result);

                        if (result.type === "success") {
                            await invalidate("app:prices");
                        } else if (
                            result.type === "error" &&
                            result.error?.apiStatusCode ==
                                APIStatusCode.LACK_OF_RESOURCES
                        ) {
                            lackOfAssets = true;
                            await invalidate("app:prices");
                        } else {
                            update();
                        }
                    };
                }}
            >
                <input type="hidden" name="symbol" value={data.symbol} />

                <div class="block has-text-centered">
                    <div>
                        <p class="heading">Баланс</p>
                        <p class="title">{formatUSD(data.usdBalance, false)}</p>
                    </div>
                </div>

                <div class="field">
                    <p class="control has-icons-left">
                        <input
                            class="input is-danger"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Сумма"
                            name="pendingUSD"
                            bind:value={pendingUSD}
                            on:input={(event) => {
                                pendingAssets =
                                    event.currentTarget.value / currentPrice;
                            }}
                        />
                        <span class="icon is-small is-left">
                            <i class="fa-solid fa-dollar-sign" />
                        </span>
                    </p>
                </div>

                <div class="block has-text-centered mt-5">
                    <div>
                        <p class="heading">{data.symbol}</p>
                        <p class="title">
                            {formatDecimal(data.assetBalance, false)}
                        </p>
                    </div>
                </div>

                <div class="field">
                    <p class="control has-icons-left">
                        <input
                            class="input is-danger"
                            type="number"
                            min="0"
                            step="any"
                            placeholder="Сумма"
                            name="pendingAssets"
                            bind:value={pendingAssets}
                            on:input={(event) => {
                                lackOfAssets = false;

                                pendingUSD =
                                    event.currentTarget.value * currentPrice;
                            }}
                        />
                        <span class="icon is-small is-left">
                            <i class="fa-solid fa-coins" />
                        </span>
                    </p>
                    {#if lackOfAssets}
                        <p class="help is-danger">
                            Недостаточно акций для продажи
                        </p>
                    {/if}
                </div>

                <div class="field is-grouped is-grouped-centered">
                    <p class="control">
                        <button
                            class="button is-danger"
                            type="submit"
                            formaction="?/buyAssets"
                            disabled={pendingUSD < 0.01}
                        >
                            Купить {data.symbol}
                        </button>
                    </p>

                    <p class="control">
                        <button
                            class="button is-danger"
                            type="submit"
                            formaction="?/sellAssets"
                            disabled={pendingAssets <= 0 ||
                                pendingAssets > data.assetBalance}
                        >
                            Продать {data.symbol}
                        </button>
                    </p>
                </div>

                <div class="field is-grouped is-grouped-centered">
                    <p class="control">
                        <button
                            class="button is-danger"
                            type="submit"
                            formaction="?/sellAllAssets"
                            disabled={data.assetBalance <= 0}
                        >
                            Продать все {data.symbol}
                        </button>
                    </p>
                </div>
            </form>
        </div>
    {/if}
</div>
