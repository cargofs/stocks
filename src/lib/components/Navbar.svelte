<script lang="ts">
    import { page } from "$app/stores";
    import NavbarItem from "$lib/components/NavbarItem.svelte";
    import _ from "lodash";

    $: username = $page.data.username;

    $: targets = [
        { path: "/prices", name: "Курсы валют" },
        {
            name: username == undefined ? "Учётная запись" : username,
            inner: [
                {
                    path: "/account/create",
                    name: "Зарегистрироваться",
                    condition: username == undefined,
                },
                {
                    path: "/account/login",
                    name: "Войти",
                    condition: username == undefined,
                },
                {
                    logout: true,
                    name: "Выйти",
                    condition: username != undefined,
                    preload: false,
                },
            ],
        },
    ];

    function modTargets(targets: Target[], prefix: string[] = []): TargetMod[] {
        let mods: TargetMod[] = [];

        for (let target of targets) {
            if (_.has(target, "condition")) {
                if (!target.condition) {
                    continue;
                }
            }

            let mod: TargetMod = {
                nameParts: prefix.concat(target.name),
                ..._.pick(target, "path", "preload", "logout", "disabled"),
            };

            if (target.inner) {
                mod.inner = modTargets(target.inner, mod.nameParts);
            }

            mods.push(mod);
        }

        return mods;
    }

    $: targetsMod = modTargets(targets);

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
