<script lang="ts">
  import { auth } from "../stores/auth";

  export let onSwitch: () => void = () => {};

  let username = "";
  let password = "";
  let error = "";
  let loading = false;

  async function handleSubmit() {
    error = "";
    loading = true;
    try {
      await auth.login(username, password);
    } catch (err) {
      error = err instanceof Error ? err.message : "Login failed";
    } finally {
      loading = false;
    }
  }
</script>

<div class="mx-auto mt-24 max-w-sm rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
  <h1 class="mb-1 text-center text-2xl font-semibold text-slate-900 dark:text-white">Welcome back</h1>
  <p class="mb-6 text-center text-sm text-slate-500 dark:text-slate-400">Log in to your cheatsheets</p>

  <form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-4">
    <input
      class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
      type="text"
      placeholder="Username"
      bind:value={username}
      required
    />
    <input
      class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
      type="password"
      placeholder="Password"
      bind:value={password}
      required
    />
    {#if error}
      <p class="text-sm text-rose-500">{error}</p>
    {/if}
    <button
      class="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
      disabled={loading}
    >
      {loading ? "Logging in..." : "Log in"}
    </button>
  </form>

  <p class="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
    Don't have an account?
    <button class="font-semibold text-slate-900 underline dark:text-white" on:click={onSwitch}>Register</button>
  </p>
</div>
