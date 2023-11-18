<script lang="ts">
    import { enhance } from "$app/forms";
    import { goto, invalidateAll } from "$app/navigation";
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
</script>

<div class="content">
    <h1>{data.action == "login" ? "Вход" : "Регистрация"}</h1>

    {#if data.continue}
        <article class="message is-warning">
            <div class="message-body">
                {#if data.forcedLogout}
                    Ваш сеанс работы истёк. Для продолжения работы необходимо
                    войти в свою учётную запись заново.
                {:else}
                    Для перехода на запрошенную страницу необходимо войти в свою
                    учётную запись или создать новую.
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
            await invalidateAll();

            if (result.type === "success") {
                if (data.continue) {
                    await goto(data.continue);
                } else {
                    await goto("/");
                }
            } else if (result.type === "error") {
                if (
                    result.error?.apiStatusCode ==
                    APIStatusCode.LOGIN_ALREADY_EXIST
                ) {
                    knownTakenLogins = [...knownTakenLogins, login];
                }
            } else {
                update();
            }
        };
    }}
>
    <div class="field">
        <p class="control has-icons-left has-icons-right">
            <input
                class="input"
                type="text"
                placeholder="Имя пользователя"
                autocomplete="username"
                name="login"
                {pattern}
                bind:value={login}
            />
            <span class="icon is-small is-left">
                <i class="fas fa-user" />
            </span>
        </p>
        {#if login.length > 0 && !loginOk}
            <p class="help is-danger">Только a-z, A-Z, 0-9</p>
        {:else if data.action == "create" && knownTakenLogins.includes(login)}
            <p class="help is-danger">Данное имя уже занято</p>
        {/if}
    </div>

    <div class="field">
        <p class="control has-icons-left">
            <input
                class="input"
                type="password"
                placeholder="Пароль"
                name="password"
                {pattern}
                bind:value={password}
            />
            <span class="icon is-small is-left">
                <i class="fas fa-lock" />
            </span>
        </p>
        {#if password.length > 0 && !passwordOk}
            <p class="help is-danger">Только a-z, A-Z, 0-9</p>
        {/if}
    </div>

    {#if data.action == "create"}
        <div class="field">
            <p class="control has-icons-left">
                <input
                    class="input"
                    type="password"
                    placeholder="Пароль (ещё раз)"
                    name="passwordAgain"
                    {pattern}
                    bind:value={passwordAgain}
                />
                <span class="icon is-small is-left">
                    <i class="fas fa-lock" />
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
                href={data.continue
                    ? `/account/create?continue=${data.continue}`
                    : `/account/create`}>Зарегистрироваться</a
            >
        {:else}
            Уже есть учётная запись? <a
                href={data.continue
                    ? `/account/login?continue=${data.continue}`
                    : `/account/login`}>Войти</a
            >
        {/if}
    </p>

    <div class="field">
        <p class="control">
            <button
                class="button is-danger"
                formaction={data.action == "login" ? "?/login" : "?/create"}
                type="submit"
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
