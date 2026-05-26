<script lang="ts">
  import type { Entry } from "../types";
  import { addSnippetWithData } from "../stores/data";

  export let entries: { item: Entry; index: number }[] = [];
  export let categoryId: string = "";
  export let onClose: () => void = () => {};

  let selectedIndex: number = entries.length > 0 ? entries[0].index : -1;
  let label = "";
  let code = "";

  function handleSubmit() {
    if (selectedIndex < 0 || !label.trim() || !code.trim()) return;
    addSnippetWithData(categoryId, selectedIndex, label, code);
    onClose();
  }
</script>

<div class="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
  <h3 class="text-sm font-semibold text-slate-900 dark:text-white">Add Snippet</h3>
  <div class="mt-3 space-y-3">
    <div>
      <label class="text-xs font-medium text-slate-500 dark:text-slate-400" for="entry-select">Entry</label>
      <select
        id="entry-select"
        class="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
        bind:value={selectedIndex}
      >
        {#each entries as entry}
          <option value={entry.index}>{entry.item.title}</option>
        {/each}
      </select>
    </div>
    <div>
      <label class="text-xs font-medium text-slate-500 dark:text-slate-400" for="snippet-label">Label</label>
      <input
        id="snippet-label"
        type="text"
        placeholder="e.g. List files"
        class="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
        bind:value={label}
      />
    </div>
    <div>
      <label class="text-xs font-medium text-slate-500 dark:text-slate-400" for="snippet-code">Command</label>
      <input
        id="snippet-code"
        type="text"
        placeholder="e.g. ls -la"
        class="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
        bind:value={code}
      />
    </div>
  </div>
  <div class="mt-4 flex flex-col gap-2 sm:flex-row">
    <button
      class="w-full rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:opacity-50 sm:w-auto sm:py-2"
      on:click={handleSubmit}
      disabled={selectedIndex < 0 || !label.trim() || !code.trim()}
    >
      Save Snippet
    </button>
    <button
      class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 sm:w-auto sm:py-2"
      on:click={onClose}
    >
      Cancel
    </button>
  </div>
</div>
