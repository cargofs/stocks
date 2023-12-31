<script lang="ts">
    import { enhance } from "$app/forms";
    import { goto, invalidate } from "$app/navigation";
    import { page } from "$app/stores";
    import { APIStatusCode } from "$lib";
    import type { PageData } from "./$types";

    export let data: PageData;

    let login = "";
    let password = "";
    let passwordAgain = "";

    const pattern = "^[a-zA-Z0-9]{1,32}$";
    $: loginOk = (login.match(pattern)?.length ?? 0) > 0;
    $: passwordOk = (password.match(pattern)?.length ?? 0) > 0;

    let knownTakenLogins: string[] = [];
    let loginOrPasswordWasWrong = false;

    let loading = false;
</script>

<svelte:head>
    <title>CoinStocks | {data.action == "login" ? "Вход" : "Регистрация"}</title
    >
</svelte:head>

<div class="content">
    <h1>{data.action == "login" ? "Вход" : "Регистрация"}</h1>

    {#if data.continue && !data.explicit}
        <article class="message is-warning">
            <div class="message-body">
                {#if data.forcedLogout}
                    Для продолжения необходимо войти в учётную запись заново.
                {:else}
                    Для перехода на страницу необходимо войти в учётную запись
                    или создать новую.
                {/if}
            </div>
        </article>
    {/if}
</div>

<form
    method="POST"
    use:enhance={() => {
        return async ({ result, update }) => {
            console.log(result);
            await invalidate("app:token");

            if (result.type === "success") {
                if (data.continue) {
                    await goto(data.continue);
                } else {
                    await goto("/");
                }
            } else if (
                result.type === "error" &&
                result.error?.apiStatusCode == APIStatusCode.LOGIN_ALREADY_EXIST
            ) {
                knownTakenLogins = [...knownTakenLogins, login];
            } else if (
                result.type === "error" &&
                result.error?.apiStatusCode ==
                    APIStatusCode.WRONG_LOGIN_OR_PASSWORD
            ) {
                loginOrPasswordWasWrong = true;
            } else {
                update();
            }

            loading = false;
        };
    }}
>
    <div class="field">
        <p class="control has-icons-left">
            <input
                class="input is-danger"
                type="text"
                placeholder="Имя пользователя"
                autocomplete="username"
                name="login"
                {pattern}
                bind:value={login}
                on:input={() => {
                    loginOrPasswordWasWrong = false;
                }}
            />
            <span class="icon is-small is-left">
                <i class="fa-solid fa-user" />
            </span>
        </p>
        {#if login.length > 32}
            <p class="help is-danger">Максимум 32 символа</p>
        {:else if login.length > 0 && !loginOk}
            <p class="help is-danger">Только a-z, A-Z, 0-9</p>
        {:else if data.action == "create" && knownTakenLogins.includes(login)}
            <p class="help is-danger">Данное имя уже занято</p>
        {/if}
    </div>

    <div class="field">
        <p class="control has-icons-left">
            <input
                class="input is-danger"
                type="password"
                placeholder="Пароль"
                autocomplete={data.action == "login"
                    ? "current-password"
                    : "new-password"}
                name="password"
                {pattern}
                bind:value={password}
                on:input={() => {
                    loginOrPasswordWasWrong = false;
                }}
            />
            <span class="icon is-small is-left">
                <i class="fa-solid fa-lock" />
            </span>
        </p>
        {#if password.length > 32}
            <p class="help is-danger">Максимум 32 символа</p>
        {:else if password.length > 0 && !passwordOk}
            <p class="help is-danger">Только a-z, A-Z, 0-9</p>
        {:else if loginOrPasswordWasWrong}
            <p class="help is-danger">Неверное имя пользователя или пароль</p>
        {/if}
    </div>

    {#if data.action == "create"}
        <div class="field">
            <p class="control has-icons-left">
                <input
                    class="input is-danger"
                    type="password"
                    placeholder="Пароль (ещё раз)"
                    autocomplete="new-password"
                    name="passwordAgain"
                    {pattern}
                    bind:value={passwordAgain}
                />
                <span class="icon is-small is-left">
                    <i class="fa-solid fa-lock" />
                </span>
            </p>
            {#if passwordAgain.length > 0 && password != passwordAgain}
                <p class="help is-danger">Пароли не совпадают</p>
            {/if}
        </div>
    {/if}

    <p class="block">
        {#if data.action == "login"}
            Нет учётной записи? <a
                class="has-text-danger"
                href={($page.url.pathname + $page.url.search).replace(
                    "/login",
                    "/create",
                )}>Зарегистрироваться</a
            >
        {:else}
            Уже есть учётная запись? <a
                class="has-text-danger"
                href={($page.url.pathname + $page.url.search).replace(
                    "/create",
                    "/login",
                )}>Войти</a
            >
        {/if}
    </p>

    <div class="field">
        <p class="control">
            <button
                class="button is-danger"
                class:is-loading={loading}
                formaction={data.action == "login" ? "?/login" : "?/create"}
                type="submit"
                on:click={() => {
                    loading = true;
                }}
                disabled={login.length == 0 ||
                    !loginOk ||
                    password.length == 0 ||
                    !passwordOk ||
                    (data.action == "create" &&
                        (passwordAgain.length == 0 ||
                            password != passwordAgain ||
                            knownTakenLogins.includes(login)))}
            >
                {data.action == "login" ? "Войти" : "Зарегистрироваться"}
            </button>
        </p>
    </div>
</form>
