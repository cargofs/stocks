<script lang="ts">
    import { Line } from "svelte-chartjs";
    import "chart.js/auto";

    import { DateTime } from "luxon";

    import type { PageData } from "./$types";
    import { goto } from "$app/navigation";

    import { views } from "./views";

    export let data: PageData;

    let symbol = data.symbol;
    let viewName = data.view.name;

    async function symbolOrViewNameChanged() {
        await goto(`/prices/${symbol}/${viewName}`);
    }
</script>

<div class="field is-grouped">
    <div class="control">
        <div class="select">
            <select bind:value={symbol} on:change={symbolOrViewNameChanged}>
                {#each data.symbols.map((price) => price.symbol) as symbol}
                    <option value={symbol}>{symbol}</option>
                {/each}
            </select>
        </div>
    </div>

    <div class="control">
        <div class="field-label is-normal">
            <label class="label"
                >Текущая цена: {data.symbols.find(
                    (price) => price.symbol == data.symbol
                )?.price}</label
            >
        </div>
    </div>

    <div class="control">
        <div class="select">
            <select bind:value={viewName} on:change={symbolOrViewNameChanged}>
                {#each views.map((view) => view.name) as view}
                    <option value={view}>{view}</option>
                {/each}
            </select>
        </div>
    </div>

    <div class="control">
        <div class="field-label is-normal">
            <label class="label">
                Debug: showing last <u>{data.view.points}</u> points from
                <u>{data.url}</u>
            </label>
        </div>
    </div>
</div>

<Line
    data={{
        labels: data.prices.map((point) =>
            DateTime.fromMillis(point.closeTime)
                .setLocale("ru")
                .toFormat(data.view.dateFormat)
        ),
        datasets: [
            {
                label: "Закрытие",
                data: data.prices.map((point) => point.close),
                fill: true,
                borderColor: "#f14668",
                tension: 0.1,
            },
        ],
    }}
/>
