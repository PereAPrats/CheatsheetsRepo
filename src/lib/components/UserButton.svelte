<script lang="ts">
  // User icon button in the header — opens the settings panel
  import { auth } from "../stores/auth";
  import { showSettings } from "../stores/ui";
</script>

<button
  class="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 lg:h-10 lg:w-10 lg:rounded-2xl"
  on:click={() => showSettings.set(true)}
  aria-label="User settings"
  title="User settings"
>
  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
</button>
