<script lang="ts">
    // Based on https://github.com/SauravKanchan/svelte-chartjs/blob/79e8edc2f6be7e696fb392538d6f2665f53a3458/src/Chart.svelte
    // changed afterUpdate to not recreate objects when unnecessary, for smoother animations when data changes

    import { onMount, afterUpdate, onDestroy } from "svelte";
    import type { ChartType, DefaultDataPoint } from "chart.js";
    import { Chart as ChartJS } from "chart.js";
    import type { ChartBaseProps } from "svelte-chartjs";
    import { useForwardEvents } from "svelte-chartjs";
    import _ from "lodash";

    interface $$Props<
        TType extends ChartType = ChartType,
        TData = DefaultDataPoint<TType>,
        TLabel = unknown,
    > extends ChartBaseProps<TType, TData, TLabel> {
        chart?: ChartJS<TType, TData, TLabel> | null;
    }

    function clean(props: SvelteAllProps) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        let {
            data,
            type,
            options,
            plugins,
            children,
            $$scope,
            $$slots,
            ...rest
        } = props;

        return rest;
    }

    export let type: $$Props["type"];
    export let data: $$Props["data"] = {
        datasets: [],
    };
    export let options: $$Props["options"] = {};
    export let plugins: $$Props["plugins"] = [];
    export let updateMode: $$Props["updateMode"] = undefined;
    export let chart: $$Props["chart"] = null;
    let canvasRef: HTMLCanvasElement;
    let props = clean($$props);

    onMount(() => {
        chart = new ChartJS(canvasRef, {
            type,
            data,
            options,
            plugins,
        });
    });

    afterUpdate(() => {
        if (!chart) return;

        // Number of datasets must not change
        for (const path of [
            "xLabels",
            "yLabels",
            "labels",
            ..._.range(chart.data.datasets.length).map((i) => `datasets[${i}]`),
        ]) {
            if (path.startsWith("datasets")) {
                _.forOwn(_.get(chart.data, path), (_v, k, object) => {
                    _.set(object, k, _.get(data, path + "." + k));
                });
            } else {
                _.set(chart.data, path, _.get(data, path));
            }
        }

        _.assign(chart.options, options);

        chart.update(updateMode);
    });

    onDestroy(() => {
        if (chart) chart.destroy();
        chart = null;
    });

    useForwardEvents(() => canvasRef);
</script>

<canvas bind:this={canvasRef} {...props} />
