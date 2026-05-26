<script lang="ts">
  import type { Snippet } from "../types";
  import { updateSnippet, deleteSnippet } from "../stores/data";

  export let snippet: Snippet;
  export let categoryId: string;
  export let itemIndex: number;
  export let snippetIndex: number;
  export let entryEditing: boolean = false;

  let editing = false;
  let editLabel = "";
  let editCode = "";
  let copied = false;

  function startEdit() {
    editLabel = snippet.label;
    editCode = snippet.code;
    editing = true;
  }

  function save() {
    updateSnippet(categoryId, itemIndex, snippetIndex, editLabel, editCode);
    editing = false;
  }

  function cancel() {
    editing = false;
  }

  function remove() {
    if (confirm("Delete this snippet?")) {
      deleteSnippet(categoryId, itemIndex, snippetIndex);
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet.code);
      copied = true;
      setTimeout(() => (copied = false), 2000);
    } catch {
      // fallback: select text
    }
  }
</script>

<div class="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200">
  {#if editing}
    <input
      class="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
      bind:value={editLabel}
    />
    <textarea
      class="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
      rows="2"
      bind:value={editCode}
    />
    <div class="mt-2 flex gap-2">
      <button
        class="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        on:click={save}
      >
        Save
      </button>
      <button
        class="rounded-2xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        on:click={cancel}
      >
        Cancel
      </button>
    </div>
  {:else}
    <div class="flex items-start justify-between gap-2">
      <div class="min-w-0 flex-1">
        <p class="text-xs uppercase tracking-[0.18em] text-slate-400">{snippet.label}</p>
        <code class="mt-1 block break-all text-xs text-slate-700 dark:text-slate-200">{snippet.code}</code>
      </div>
      <div class="flex shrink-0 items-center gap-1">
        {#if !entryEditing}
          <button
          class="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          on:click={copy}
          aria-label="Copy command"
        >
          {#if copied}
            <span class="text-xs font-semibold text-emerald-500">OK</span>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          {/if}
        </button>
        {/if}
        {#if entryEditing}
          <button
            class="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            on:click={startEdit}
            aria-label="Edit snippet"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            class="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-rose-500 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-rose-400"
            on:click={remove}
            aria-label="Delete snippet"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        {/if}
      </div>
    </div>
  {/if}
</div>
