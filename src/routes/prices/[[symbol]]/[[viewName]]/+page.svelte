<script lang="ts">
    import { Line } from "svelte-chartjs";
    import "chart.js/auto";

    import { DateTime } from "luxon";

    import type { PageData } from "./$types";
    import { goto } from "$app/navigation";

    import { views } from "./views";

    import _ from "lodash";

    export let data: PageData;

    let currentSymbol = data.symbol;
    let currentViewName = data.view.name;

    async function symbolOrViewNameChanged() {
        await goto(`/prices/${currentSymbol}/${currentViewName}`);
    }
</script>

<div class="field is-grouped">
    <div class="control">
        <div class="select">
            <select
                bind:value={currentSymbol}
                on:change={symbolOrViewNameChanged}
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
                bind:value={currentViewName}
                on:change={symbolOrViewNameChanged}
            >
                {#each views.map((view) => view.name) as viewName}
                    <option value={viewName}>{viewName}</option>
                {/each}
            </select>
        </div>
    </div>
</div>

<Line
    data={{
        labels: _.concat(
            data.prices.map((point) => DateTime.fromMillis(point.openTime)),
            [DateTime.now()]
        ).map((dt) => dt.setLocale("ru").toFormat(data.view.dateFormat)),
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
            y: {
                ticks: {
                    callback: function (value, index, ticks) {
                        return "$" + value.toLocaleString();
                    },
                },
            },
        },
    }}
/>
