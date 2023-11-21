<script lang="ts">
    // Functionally equal to https://github.com/SauravKanchan/svelte-chartjs/blob/79e8edc2f6be7e696fb392538d6f2665f53a3458/src/Line.svelte
    // but uses the modded LiveChart instead of Chart

    import type { DefaultDataPoint } from "chart.js";
    import { Chart as ChartJS, PieController } from "chart.js";
    import type { ChartBaseProps } from "svelte-chartjs";
    import LiveChart from "./LiveChart.svelte";
    import { useForwardEvents } from "svelte-chartjs";

    interface $$Props<TData = DefaultDataPoint<"pie">, TLabel = unknown>
        extends Omit<ChartBaseProps<"pie", TData, TLabel>, "type"> {
        chart?: ChartJS<"pie", TData, TLabel> | null;
    }

    ChartJS.register(PieController);

    export let chart: $$Props["chart"] = null;
    let props: $$Props;
    let baseChartRef: LiveChart;

    useForwardEvents(() => baseChartRef);

    $: props = $$props as $$Props;
</script>

<LiveChart bind:this={baseChartRef} bind:chart type="pie" {...props} />
