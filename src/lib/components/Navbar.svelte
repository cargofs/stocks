<script lang="ts">
    import { dev } from "$app/environment";
    import { page } from "$app/stores";
    import NavbarItem from "$lib/components/NavbarItem.svelte";
    import _ from "lodash";

    $: login = $page.data.login;

    $: targets = [
        { path: "/", name: "Главная" },
        { path: "/prices", name: "Биржа" },
        { path: "/leaderboard", name: "Таблица лидеров" },
        { path: "/history", name: "История операций" },
        {
            iconClasses: "fa-solid fa-user",
            name: _.isNil(login)
                ? "Учётная запись"
                : dev
                  ? `${login} (${$page.data.id})`
                  : login,
            inner: [
                {
                    path: $page.url.pathname.startsWith("/account")
                        ? ($page.url.pathname + $page.url.search).replace(
                              "/login",
                              "/create",
                          )
                        : `/account/create?continue=${encodeURIComponent(
                              $page.url.pathname,
                          )}&explicit=1`,
                    name: "Регистрация",
                    condition: _.isNil(login),
                },
                {
                    path: $page.url.pathname.startsWith("/account")
                        ? ($page.url.pathname + $page.url.search).replace(
                              "/create",
                              "/login",
                          )
                        : `/account/login?continue=${encodeURIComponent(
                              $page.url.pathname,
                          )}&explicit=1`,
                    name: "Вход",
                    condition: _.isNil(login),
                },
                {
                    logout: true,
                    name: "Выйти",
                    condition: !_.isNil(login),
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
                ..._.pick(
                    target,
                    "path",
                    "preload",
                    "logout",
                    "disabled",
                    "iconClasses",
                ),
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
        <a class="navbar-item is-size-5" href="/"
            >CoinStocks{dev ? " (dev)" : ""}</a
        >

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
