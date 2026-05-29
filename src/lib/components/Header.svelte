<script lang="ts">
  import ThemeToggle from "./ThemeToggle.svelte";
  import BackButton from "./BackButton.svelte";
  import UserButton from "./UserButton.svelte";
  import { auth } from "../stores/auth";

  export let showBack: boolean = false;
</script>

<header
  class="mx-auto flex max-w-7xl items-stretch gap-4 rounded-2xl bg-white/90 p-4 shadow-sm backdrop-blur dark:bg-slate-900/70 lg:rounded-3xl lg:p-6"
>
  {#if showBack}
    <BackButton />
  {/if}
  <div class="min-w-0 flex-1 self-center">
    <p class="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 lg:tracking-[0.25em]">Personal Knowledge Base</p>
    <h1 class="text-xl font-semibold tracking-tight text-slate-900 dark:text-white lg:text-3xl lg:tracking-tighter">Hello {$auth.user?.username}</h1>
  </div>
  <div class="flex items-center gap-2 self-center">
    <UserButton />
    <ThemeToggle />
  </div>
</header>
