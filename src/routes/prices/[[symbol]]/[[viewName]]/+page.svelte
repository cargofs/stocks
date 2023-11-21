<script lang="ts">
    import LiveLine from "$lib/components/charts/LiveLine.svelte";
    import "chart.js/auto";
    import "chartjs-adapter-luxon";
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

    import RefreshButton from "$lib/components/RefreshButton.svelte";
    import CallToLogin from "$lib/components/CallToLogin.svelte";

    export let data: PageData;

    $: firstPrice = _.toNumber(_.first(data.prices)?.open ?? 0);
    $: currentPrice =
        data.briefs.find((brief) => brief.symbol == data.symbol)?.price ?? 0;

    $: haveBalances =
        data.usdBalance !== undefined && data.assetBalance !== undefined;
    $: showTradingUI = !_.isNil($page.data.login) && haveBalances;
    $: {
        if (!_.isNil($page.data.login) && !haveBalances) {
            invalidate("app:token");
        }
    }

    let showPercent = true;
    function toggleShowPercent() {
        showPercent = !showPercent;
    }

    let pendingUSD = 0;
    let pendingAssets = 0;

    let lackOfAssets = false;
    let lackOfUSD = false;

    let lastChangedAssets = true;

    function recalculate() {
        if (lastChangedAssets) {
            if (pendingAssets <= 0) {
                return;
            }
            pendingUSD = _.round(_.toNumber(pendingAssets) * currentPrice, 2);
            lackOfUSD = false;
        } else {
            if (pendingUSD <= 0) {
                return;
            }
            pendingAssets = _.round(_.toNumber(pendingUSD) / currentPrice, 10);
            lackOfAssets = false;
        }
    }

    let buyAssetsLoading = false;
    let sellAssetsLoading = false;
    let sellAllAssetsLoading = false;
    $: anyLoading =
        buyAssetsLoading || sellAssetsLoading || sellAllAssetsLoading;

    function reset() {
        buyAssetsLoading = false;
        sellAssetsLoading = false;
        sellAllAssetsLoading = false;
    }
</script>

<div class="columns is-desktop is-multiline">
    <div class="column is-12-desktop is-8-widescreen is-9-fullhd">
        <div class="level">
            <div class="level-left">
                <div class="level-item">
                    <div class="field is-grouped">
                        <div class="control">
                            <div class="select is-danger">
                                <select
                                    value={data.symbol}
                                    on:input={async (ev) => {
                                        const symbol = ev.currentTarget.value;
                                        await goto(
                                            `/prices/${symbol}/${data.view.name}`
                                        );
                                        reset();
                                    }}
                                >
                                    {#each data.symbols as symbol}
                                        <option value={symbol}>{symbol}</option>
                                    {/each}
                                </select>
                            </div>
                        </div>

                        <div class="control">
                            <div class="select is-danger">
                                <select
                                    value={data.view.name}
                                    on:input={async (ev) => {
                                        const viewName = ev.currentTarget.value;
                                        await goto(
                                            `/prices/${data.symbol}/${viewName}`
                                        );
                                        reset();
                                    }}
                                >
                                    {#each priceViews.map((view) => view.name) as viewName}
                                        <option value={viewName}
                                            >{viewName}</option
                                        >
                                    {/each}
                                </select>
                            </div>
                        </div>

                        <div class="control">
                            <RefreshButton
                                invalidationURL="app:prices"
                                additionalAction={reset}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div class="level-right">
                <div class="field is-grouped is-grouped-right">
                    <div class="control mr-5">
                        <div
                            class="level-item has-text-right is-clickable is-unselectable"
                            on:click={toggleShowPercent}
                            on:keypress={toggleShowPercent}
                        >
                            <div>
                                <p class="heading">За последние 24ч</p>
                                <p
                                    class="title"
                                    class:has-text-success={data.last24hStats
                                        .priceChangePercent > 0}
                                    class:has-text-link={data.last24hStats
                                        .priceChangePercent < 0}
                                >
                                    {showPercent
                                        ? formatPercentage(
                                              data.last24hStats
                                                  .priceChangePercent,
                                              true
                                          )
                                        : formatUSD(
                                              data.last24hStats.priceChange,
                                              true
                                          )}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="control">
                        <div class="level-item has-text-right is-unselectable">
                            <div>
                                <p class="heading">Сейчас 1 {data.symbol}</p>
                                <p class="title">
                                    {formatUSD(currentPrice, false)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <LiveLine
            data={{
                labels: _.concat(data.priceOpenTimes, data.briefsTimestamp),
                datasets: [
                    {
                        label: "Открытие",
                        data: _.concat(data.priceOpens, currentPrice),
                        fill: true,
                        borderColor:
                            firstPrice == currentPrice
                                ? "hsl(48, 100%, 67%)"
                                : firstPrice < currentPrice
                                ? "hsl(141, 71%, 48%)"
                                : "hsl(217, 71%, 53%)",
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

    {#if showTradingUI}
        <div class="column">
            <form
                method="POST"
                use:enhance={() => {
                    return async ({ result, update }) => {
                        console.log(result);

                        if (result.type === "success") {
                            await invalidate("app:prices");
                            reset();
                        } else if (
                            result.type === "error" &&
                            result.error?.apiStatusCode ==
                                APIStatusCode.VALIDATION_ERROR_USD
                        ) {
                            await invalidate("app:prices");
                            reset();
                            lackOfUSD = true;
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
                            placeholder="Сумма в долларах"
                            name="pendingUSD"
                            bind:value={pendingUSD}
                            on:input={(event) => {
                                lackOfUSD = false;
                                lastChangedAssets = false;
                                recalculate();
                            }}
                        />
                        <span class="icon is-small is-left">
                            <i class="fa-solid fa-dollar-sign" />
                        </span>
                    </p>
                    {#if lackOfUSD}
                        <p class="help is-danger">Недостаточно долларов</p>
                    {/if}
                </div>

                <div class="field">
                    <div class="control">
                        <button
                            class="button is-danger is-fullwidth"
                            class:is-loading={buyAssetsLoading}
                            on:click={() => {
                                buyAssetsLoading = true;
                            }}
                            type="submit"
                            formaction="?/buyAssets"
                            disabled={(anyLoading && !buyAssetsLoading) ||
                                !data.usdBalance ||
                                pendingUSD < 0.01 ||
                                pendingUSD > data.usdBalance}
                        >
                            Купить {data.symbol} за {formatUSD(
                                pendingUSD,
                                false
                            )}
                        </button>
                    </div>
                </div>
            </form>

            <form
                method="POST"
                use:enhance={() => {
                    return async ({ result, update }) => {
                        console.log(result);

                        if (result.type === "success") {
                            await invalidate("app:prices");
                            reset();
                        } else if (
                            result.type === "error" &&
                            result.error?.apiStatusCode ==
                                APIStatusCode.LACK_OF_RESOURCES
                        ) {
                            await invalidate("app:prices");
                            reset();
                            lackOfAssets = true;
                        } else {
                            update();
                        }
                    };
                }}
            >
                <input type="hidden" name="symbol" value={data.symbol} />

                <div class="block has-text-centered mt-5">
                    <div>
                        <p class="heading">Активов {data.symbol}</p>
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
                            placeholder="Сумма активов"
                            name="pendingAssets"
                            bind:value={pendingAssets}
                            on:input={(event) => {
                                lackOfAssets = false;
                                lastChangedAssets = true;
                                recalculate();
                            }}
                        />
                        <span class="icon is-small is-left">
                            <i class="fa-solid fa-coins" />
                        </span>
                    </p>
                    {#if lackOfAssets}
                        <p class="help is-danger">Недостаточно активов</p>
                    {/if}
                </div>

                <div class="field">
                    <div class="control">
                        <button
                            class="button is-danger is-fullwidth"
                            class:is-loading={sellAssetsLoading}
                            on:click={() => {
                                sellAssetsLoading = true;
                            }}
                            type="submit"
                            formaction="?/sellAssets"
                            disabled={(anyLoading && !sellAssetsLoading) ||
                                !data.assetBalance ||
                                pendingAssets <= 0 ||
                                pendingAssets > data.assetBalance}
                        >
                            Продать {formatDecimal(pendingAssets, false)}
                            {data.symbol}
                        </button>
                    </div>
                </div>
            </form>

            <div class="content">
                <hr />
            </div>

            <form
                method="POST"
                use:enhance={() => {
                    return async ({ result, update }) => {
                        console.log(result);

                        if (result.type === "success") {
                            await invalidate("app:prices");
                            reset();
                        } else {
                            update();
                        }
                    };
                }}
            >
                <input type="hidden" name="symbol" value={data.symbol} />

                <div class="field">
                    <div class="control">
                        <button
                            class="button is-danger is-fullwidth"
                            class:is-loading={sellAllAssetsLoading}
                            on:click={() => {
                                sellAllAssetsLoading = true;
                            }}
                            type="submit"
                            formaction="?/sellAllAssets"
                            disabled={(anyLoading && !sellAllAssetsLoading) ||
                                !data.assetBalance ||
                                data.assetBalance <= 0}
                        >
                            Продать все {formatDecimal(
                                data.assetBalance,
                                false
                            )}
                            {data.symbol}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    {:else}
        <div class="content">
            <article class="message">
                <div class="message-body">
                    <CallToLogin purpose="играть" />
                </div>
            </article>
        </div>
    {/if}
</div>
