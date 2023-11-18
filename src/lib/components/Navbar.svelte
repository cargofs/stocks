<script lang="ts">
    import { page } from "$app/stores";
    import NavbarItem from "$lib/components/NavbarItem.svelte";
    import _ from "lodash";

    let targets: Target[] = [
        { path: "/prices", name: "Курсы валют" },
        {
            name: "Учётная запись",
            inner: [
                { path: "/account/create", name: "Зарегистрироваться" },
                { path: "/account/login", name: "Войти" },
                { path: "/account/logout", name: "Выйти" },
            ],
        },
    ];

    function modTargets(targets: Target[], prefix: string[] = []): TargetMod[] {
        let mods: TargetMod[] = [];

        for (let target of targets) {
            let mod: TargetMod = {
                nameParts: prefix.concat([target.name]),
                ..._.pick(target, "name", "path"),
            };

            if (target.inner) {
                mod.inner = modTargets(target.inner, mod.nameParts);
            }

            mods.push(mod);
        }

        return mods;
    }

    let targetsMod = modTargets(targets);

    let navbarExpanded = false;
</script>

<nav
    class="navbar is-danger px-5 is-fixed-top has-shadow"
    aria-label="Основная навигация"
>
    <div class="navbar-brand">
        <a class="navbar-item is-size-5" href="/">CoinStocks</a>

        <a
            role="button"
            class="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="main-navbar"
            on:click={() => {
                navbarExpanded = !navbarExpanded;
            }}
            class:is-active={navbarExpanded}
        >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
        </a>
    </div>

    <div id="main-navbar" class="navbar-menu" class:is-active={navbarExpanded}>
        <div class="navbar-end">
            {#each targetsMod as target}
                <NavbarItem {target} />
            {/each}
        </div>
    </div>
</nav>
