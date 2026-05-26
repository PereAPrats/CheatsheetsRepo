<script lang="ts">
  import type { Entry } from "../types";
  import { updateEntry, deleteEntry } from "../stores/data";
  import SnippetBlock from "./SnippetBlock.svelte";

  export let entry: Entry;
  export let categoryId: string;
  export let index: number;

  let editing = false;
  let editTitle = "";

  function startEdit() {
    editTitle = entry.title;
    editing = true;
  }

  function save() {
    updateEntry(categoryId, index, editTitle);
    editing = false;
  }

  function cancel() {
    editing = false;
  }

  function remove() {
    if (confirm("Delete this entry?")) {
      deleteEntry(categoryId, index);
    }
  }

</script>

<div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:rounded-3xl lg:p-6">
  <div class="flex items-start justify-between gap-3">
    {#if editing}
      <input
        class="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 lg:rounded-3xl lg:px-4 lg:py-3 lg:text-base"
        bind:value={editTitle}
      />
      <div class="flex shrink-0 items-center gap-1">
        <button
          class="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-rose-500 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-rose-400 lg:h-8 lg:w-8"
          on:click={remove}
          aria-label="Delete entry"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        <button
          class="rounded-2xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 lg:rounded-3xl lg:px-4 lg:py-2"
          on:click={save}
        >
          Save
        </button>
        <button
          class="rounded-2xl border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 lg:rounded-3xl lg:px-4 lg:py-2"
          on:click={cancel}
        >
          Cancel
        </button>
      </div>
    {:else}
      <p class="text-base font-semibold text-slate-900 dark:text-white lg:text-lg">{entry.title}</p>
      <button
        class="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
        on:click={startEdit}
        aria-label="Edit entry"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      </button>
    {/if}
  </div>
  <div class="mt-3 space-y-2">
    {#each entry.snippets as snippet, snippetIndex}
      <SnippetBlock
        {snippet}
        {categoryId}
        itemIndex={index}
        {snippetIndex}
        entryEditing={editing}
      />
    {/each}
  </div>
</div>
