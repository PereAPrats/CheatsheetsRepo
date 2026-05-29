<script lang="ts">
  import { auth } from "../stores/auth";

  export let onClose: () => void = () => {};

  let email = $auth.user?.email || "";
  let currentPassword = "";
  let newPassword = "";
  let confirmPassword = "";
  let emailError = "";
  let emailSuccess = false;
  let passwordError = "";
  let passwordSuccess = false;
  let savingEmail = false;
  let savingPassword = false;

  async function handleEmailSubmit() {
    emailError = "";
    emailSuccess = false;
    if (!currentPassword) {
      emailError = "Enter your current password to change email";
      return;
    }
    savingEmail = true;
    try {
      await auth.updateProfile(email, currentPassword);
      emailSuccess = true;
      currentPassword = "";
    } catch (err) {
      emailError = err instanceof Error ? err.message : "Failed to update email";
    } finally {
      savingEmail = false;
    }
  }

  async function handlePasswordSubmit() {
    passwordError = "";
    passwordSuccess = false;
    if (newPassword !== confirmPassword) {
      passwordError = "Passwords do not match";
      return;
    }
    if (newPassword.length < 6) {
      passwordError = "Password must be at least 6 characters";
      return;
    }
    savingPassword = true;
    try {
      await auth.updatePassword(currentPassword, newPassword);
      passwordSuccess = true;
      currentPassword = "";
      newPassword = "";
      confirmPassword = "";
    } catch (err) {
      passwordError = err instanceof Error ? err.message : "Failed to update password";
    } finally {
      savingPassword = false;
    }
  }
</script>

<div class="fixed inset-0 z-50 flex items-start justify-center bg-black/30 pt-16 backdrop-blur-sm">
  <div class="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-700 dark:bg-slate-900">
    <div class="mb-6 flex items-center justify-between">
      <h2 class="text-xl font-semibold text-slate-900 dark:text-white">Settings</h2>
      <button
        class="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
        on:click={onClose}
        aria-label="Close settings"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <div class="mb-6 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800">
      <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Username</p>
      <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{$auth.user?.username}</p>
      <p class="mt-3 text-xs text-slate-400">Username cannot be changed</p>
    </div>

    <form on:submit|preventDefault={handleEmailSubmit} class="mb-6">
      <h3 class="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Change email</h3>
      <div class="flex flex-col gap-3">
        <input
          class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          type="email"
          placeholder="New email"
          bind:value={email}
          required
        />
        <input
          class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          type="password"
          placeholder="Current password"
          bind:value={currentPassword}
          required
        />
        {#if emailError}
          <p class="text-sm text-rose-500">{emailError}</p>
        {/if}
        {#if emailSuccess}
          <p class="text-sm text-emerald-500">Email updated successfully</p>
        {/if}
        <button
          class="w-full rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          disabled={savingEmail}
        >
          {savingEmail ? "Saving..." : "Save email"}
        </button>
      </div>
    </form>

    <form on:submit|preventDefault={handlePasswordSubmit}>
      <h3 class="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">Change password</h3>
      <div class="flex flex-col gap-3">
        <input
          class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          type="password"
          placeholder="Current password"
          bind:value={currentPassword}
          required
        />
        <input
          class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          type="password"
          placeholder="New password (min 6 characters)"
          bind:value={newPassword}
          required
          minlength={6}
        />
        <input
          class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          type="password"
          placeholder="Confirm new password"
          bind:value={confirmPassword}
          required
        />
        {#if passwordError}
          <p class="text-sm text-rose-500">{passwordError}</p>
        {/if}
        {#if passwordSuccess}
          <p class="text-sm text-emerald-500">Password updated successfully</p>
        {/if}
        <button
          class="w-full rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          disabled={savingPassword}
        >
          {savingPassword ? "Saving..." : "Save password"}
        </button>
      </div>
    </form>

    <div class="mt-6 border-t border-slate-200 pt-4 dark:border-slate-700">
      <button
        class="w-full rounded-2xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-500 transition hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-900/20"
        on:click={() => { auth.logout(); onClose(); }}
      >
        Sign out
      </button>
    </div>
  </div>
</div>
