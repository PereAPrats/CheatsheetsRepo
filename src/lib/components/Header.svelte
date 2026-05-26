<script lang="ts">
  import ThemeToggle from "./ThemeToggle.svelte";
</script>

<header
  class="mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-2xl bg-white/90 p-4 shadow-sm backdrop-blur dark:bg-slate-900/70"
>
  <div>
    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Personal Knowledge Base</p>
    <h1 class="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">Dev Cheatsheets</h1>
  </div>
  <ThemeToggle />
</header>
