<script lang="ts">
  // Registration form — creates a new account with name, username, email, and password
  import { auth } from "../stores/auth";

  export let onSwitch: () => void = () => {};

  let name = "";
  let username = "";
  let email = "";
  let password = "";
  let confirm = "";
  let error = "";
  let loading = false;

  async function handleSubmit() {
    error = "";
    if (password !== confirm) {
      error = "Passwords do not match";
      return;
    }
    loading = true;
    try {
      await auth.register(name, username, email, password);
    } catch (err) {
      error = err instanceof Error ? err.message : "Registration failed";
    } finally {
      loading = false;
    }
  }
</script>

<div class="mx-auto mt-24 max-w-sm rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
  <h1 class="mb-1 text-center text-2xl font-semibold text-slate-900 dark:text-white">Create account</h1>
  <p class="mb-6 text-center text-sm text-slate-500 dark:text-slate-400">Start your personal cheatsheet collection</p>

  <form on:submit|preventDefault={handleSubmit} class="flex flex-col gap-4">
    <input
      class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
      type="text"
      placeholder="Full name"
      bind:value={name}
      required
    />
    <input
      class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
      type="text"
      placeholder="Username"
      bind:value={username}
      required
    />
    <input
      class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
      type="email"
      placeholder="Email"
      bind:value={email}
      required
    />
    <input
      class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
      type="password"
      placeholder="Password (min 6 characters)"
      bind:value={password}
      required
      minlength={6}
    />
    <input
      class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
      type="password"
      placeholder="Confirm password"
      bind:value={confirm}
      required
    />
    {#if error}
      <p class="text-sm text-rose-500">{error}</p>
    {/if}
    <button
      class="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
      disabled={loading}
    >
      {loading ? "Creating account..." : "Create account"}
    </button>
  </form>

  <p class="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
    Already have an account?
    <button class="font-semibold text-slate-900 underline dark:text-white" on:click={onSwitch}>Log In</button>
  </p>
</div>
