<script lang="ts">
  import { auth } from "../stores/auth";

  export let onClose: () => void = () => {};

  type Section = "name" | "email" | "password" | null;
  let activeSection: Section = null;

  let nameValue = $auth.user?.name || "";
  let namePassword = "";
  let nameError = "";
  let nameSuccess = false;
  let savingName = false;

  let emailValue = $auth.user?.email || "";
  let emailPassword = "";
  let emailError = "";
  let emailSuccess = false;
  let savingEmail = false;

  let changePassword = "";
  let newPassword = "";
  let confirmPassword = "";
  let passwordError = "";
  let passwordSuccess = false;
  let savingPassword = false;

  function toggleSection(section: Section) {
    activeSection = activeSection === section ? null : section;
    nameSuccess = false;
    emailSuccess = false;
    passwordSuccess = false;
  }

  async function handleNameSubmit() {
    nameError = "";
    nameSuccess = false;
    if (!namePassword) {
      nameError = "Enter your current password to change name";
      return;
    }
    savingName = true;
    try {
      await auth.updateProfile({ name: nameValue }, namePassword);
      nameSuccess = true;
      namePassword = "";
    } catch (err) {
      nameError = err instanceof Error ? err.message : "Failed to update name";
    } finally {
      savingName = false;
    }
  }

  async function handleEmailSubmit() {
    emailError = "";
    emailSuccess = false;
    if (!emailPassword) {
      emailError = "Enter your current password to change email";
      return;
    }
    savingEmail = true;
    try {
      await auth.updateProfile({ email: emailValue }, emailPassword);
      emailSuccess = true;
      emailPassword = "";
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
      await auth.updatePassword(changePassword, newPassword);
      passwordSuccess = true;
      changePassword = "";
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
      <p class="text-xs font-medium uppercase tracking-wide text-slate-400">Name</p>
      <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-white">{($auth.user?.name || $auth.user?.username).toUpperCase()}</p>
      <p class="mt-2 text-xs font-medium uppercase tracking-wide text-slate-400">Username</p>
      <p class="mt-1 text-sm text-slate-600 dark:text-slate-400">{$auth.user?.username}</p>
    </div>

    <div class="space-y-2">
      <!-- Change name -->
      <div class="rounded-2xl border border-slate-200 dark:border-slate-700">
        <button
          class="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
          on:click={() => toggleSection("name")}
        >
          Change name
          <svg
            class="h-4 w-4 transition {activeSection === 'name' ? 'rotate-180' : ''}"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {#if activeSection === "name"}
          <form on:submit|preventDefault={handleNameSubmit} class="border-t border-slate-200 px-4 py-3 dark:border-slate-700">
            <div class="flex flex-col gap-3">
              <input
                class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                type="text"
                placeholder="New name"
                bind:value={nameValue}
                required
              />
              <input
                class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                type="password"
                placeholder="Current password"
                bind:value={namePassword}
                required
              />
              {#if nameError}
                <p class="text-sm text-rose-500">{nameError}</p>
              {/if}
              {#if nameSuccess}
                <p class="text-sm text-emerald-500">Name updated successfully</p>
              {/if}
              <button
                class="w-full rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-50 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                disabled={savingName}
              >
                {savingName ? "Saving..." : "Save name"}
              </button>
            </div>
          </form>
        {/if}
      </div>

      <!-- Change email -->
      <div class="rounded-2xl border border-slate-200 dark:border-slate-700">
        <button
          class="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
          on:click={() => toggleSection("email")}
        >
          Change email
          <svg
            class="h-4 w-4 transition {activeSection === 'email' ? 'rotate-180' : ''}"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {#if activeSection === "email"}
          <form on:submit|preventDefault={handleEmailSubmit} class="border-t border-slate-200 px-4 py-3 dark:border-slate-700">
            <div class="flex flex-col gap-3">
              <input
                class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                type="email"
                placeholder="New email"
                bind:value={emailValue}
                required
              />
              <input
                class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                type="password"
                placeholder="Current password"
                bind:value={emailPassword}
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
        {/if}
      </div>

      <!-- Change password -->
      <div class="rounded-2xl border border-slate-200 dark:border-slate-700">
        <button
          class="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
          on:click={() => toggleSection("password")}
        >
          Change password
          <svg
            class="h-4 w-4 transition {activeSection === 'password' ? 'rotate-180' : ''}"
            fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {#if activeSection === "password"}
          <form on:submit|preventDefault={handlePasswordSubmit} class="border-t border-slate-200 px-4 py-3 dark:border-slate-700">
            <div class="flex flex-col gap-3">
              <input
                class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                type="password"
                placeholder="Current password"
                bind:value={changePassword}
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
        {/if}
      </div>
    </div>

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
