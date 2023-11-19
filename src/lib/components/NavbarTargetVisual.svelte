<script lang="ts">
    import _ from "lodash";

    export let target: TargetMod;
</script>

<span class="icon-text">
    {#if target.iconClasses}
        <span class="icon">
            <i class={target.iconClasses} />
        </span>
    {/if}
    <span>{_.last(target.nameParts)}</span>
</span>
