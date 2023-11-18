<script lang="ts">
    import { Line } from "svelte-chartjs";
    import "chart.js/auto";
    import "chartjs-adapter-luxon";

    import { DateTime } from "luxon";

    import type { PageData } from "./$types";
    import { goto } from "$app/navigation";

    import { priceViews } from "$lib/priceViews";

    import _ from "lodash";

    export let data: PageData;
</script>

<div class="field is-grouped">
    <div class="control">
        <div class="select">
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

    <div class="control">
        <div class="select">
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
                    [data.price ?? 0]
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
                        return "$" + value.toLocaleString();
                    },
                },
            },
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || "";

                        if (label) {
                            label += ": ";
                        }
                        if (context.parsed.y !== null) {
                            label += "$" + context.parsed.y.toLocaleString();
                        }
                        return label;
                    },
                },
            },
        },
    }}
/>
