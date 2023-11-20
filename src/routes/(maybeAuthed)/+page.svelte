<script lang="ts">
    import { page } from "$app/stores";
    import _ from "lodash";

    import CallToLogin from "$lib/components/CallToLogin.svelte";
</script>

<div class="content">
    {#if _.isNil($page.data.login)}
        <section class="hero">
            <div class="hero-body">
                <p class="title">Добро пожаловать в CoinStocks!</p>
                <p class="subtitle">
                    <CallToLogin purpose="увидеть свой баланс" />
                </p>
            </div>
        </section>
    {/if}
</div>
