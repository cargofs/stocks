<script lang="ts">
    import { Line } from "svelte-chartjs";
    import "chart.js/auto";

    import { DateTime } from "luxon";

    import type { PageData } from "./$types";
    import { goto } from "$app/navigation";

    import { views } from "./views";

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
        <div class="field-label is-normal">
            <label class="label">Текущая цена: {data.price}</label>
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
