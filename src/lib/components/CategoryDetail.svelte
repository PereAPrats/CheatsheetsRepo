<script lang="ts">
  import type { Category, Entry } from "../types";
  import { showEntryForm, showSnippetForm } from "../stores/ui";
  import EntryForm from "./EntryForm.svelte";
  import SnippetForm from "./SnippetForm.svelte";
  import EntryCard from "./EntryCard.svelte";

  export let category: Category;
  export let items: { item: Entry; index: number }[] = [];

  function toggleEntryForm() {
    showEntryForm.update((v) => !v);
    showSnippetForm.set(false);
  }

  function toggleSnippetForm() {
    showSnippetForm.update((v) => !v);
    showEntryForm.set(false);
  }
</script>

<div class="mt-4 flex flex-row flex-wrap items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800 lg:mt-6 lg:gap-4 lg:pb-5">
  <button
    class="rounded-2xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
    on:click={toggleEntryForm}
  >
    + New Entry
  </button>
  <button
    class="rounded-2xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
    on:click={toggleSnippetForm}
  >
    + New Snippet
  </button>
</div>

{#if $showEntryForm}
  <EntryForm />
{/if}

{#if $showSnippetForm && category}
  <SnippetForm
    entries={items}
    categoryId={category.id}
    onClose={() => showSnippetForm.set(false)}
  />
{/if}

<div class="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
  {#if items.length === 0}
    <p class="text-sm text-slate-400">No entries yet.</p>
  {:else}
    {#each items as entry}
      <EntryCard
        entry={entry.item}
        categoryId={category.id}
        index={entry.index}
      />
    {/each}
  {/if}
</div>
