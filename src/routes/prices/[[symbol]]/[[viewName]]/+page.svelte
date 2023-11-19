<script lang="ts">
    import { Line } from "svelte-chartjs";
    import "chart.js/auto";
    import "chartjs-adapter-luxon";
    import { DateTime } from "luxon";
    import _ from "lodash";

    import type { PageData } from "./$types";
    import { goto, invalidate } from "$app/navigation";

    import { formatPercentage, formatUSD } from "$lib";
    import { priceViews } from "$lib/priceViews";

    export let data: PageData;

    let showPercent = true;
    function toggleShowPercent() {
        showPercent = !showPercent;
    }
</script>

<div class="level">
    <div class="level-left">
        <div class="level-item">
            <div class="control">
                <div class="select is-danger">
                    <select
                        value={data.symbol}
                        on:input={async (ev) => {
                            const symbol = ev.currentTarget.value;
                            await goto(`/prices/${symbol}/${data.view.name}`);
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
                            await goto(`/prices/${data.symbol}/${viewName}`);
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
                        : formatUSD(data.last24hStats.priceChange, true)}
                </p>
            </div>
        </div>

        <div class="field">
            <p class="control">
                <button
                    class="button is-danger is-light"
                    on:click={() => {
                        invalidate("app:prices");
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
                    [
                        data.briefs.find((brief) => brief.symbol == data.symbol)
                            ?.price ?? 0,
                    ]
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
