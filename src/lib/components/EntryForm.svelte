<script lang="ts">
  import { get } from "svelte/store";
  import { addEntry } from "../stores/data";
  import { showEntryForm } from "../stores/ui";
  import { selectedCategoryId } from "../stores/navigation";

  let title = "";
  let snippets: { label: string; code: string }[] = [{ label: "", code: "" }];

  function handleSubmit() {
    const catId = get(selectedCategoryId);
    if (!catId) return;

    const filtered = snippets
      .map((s) => ({ label: s.label.trim(), code: s.code.trim() }))
      .filter((s) => s.label && s.code);
    if (!title.trim() || filtered.length === 0) return;

    addEntry(catId, title, filtered);
    title = "";
    snippets = [{ label: "", code: "" }];
    showEntryForm.set(false);
  }

  function removeSnippet(index: number) {
    snippets = snippets.filter((_, i) => i !== index);
  }

  function addSnippet() {
    snippets = [...snippets, { label: "", code: "" }];
  }
</script>

<div class="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
  <h3 class="text-sm font-semibold text-slate-900 dark:text-white">Add Entry</h3>
  <div class="mt-3 grid gap-3 sm:grid-cols-2">
    <input
      type="text"
      placeholder="Entry title"
      class="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
      bind:value={title}
    />
  </div>
  <div class="mt-4 space-y-3">
    {#each snippets as snippet, sIndex}
      <div class="grid gap-3 sm:grid-cols-[1fr_2fr_auto]">
        <input
          type="text"
          placeholder="Snippet label"
          class="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          bind:value={snippet.label}
        />
        <input
          type="text"
          placeholder="Command"
          class="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
          bind:value={snippet.code}
        />
        <button
          class="rounded-2xl border border-slate-200 px-4 py-3 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:px-3 sm:py-2"
          on:click={() => removeSnippet(sIndex)}
          disabled={snippets.length === 1}
        >
          Remove
        </button>
      </div>
    {/each}
    <button
      class="rounded-2xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
      on:click={addSnippet}
    >
      Add snippet
    </button>
  </div>
  <div class="mt-4 flex flex-col gap-2 sm:flex-row">
    <button
      class="w-full rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 sm:w-auto sm:py-2"
      on:click={handleSubmit}
    >
      Save Entry
    </button>
    <button
      class="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 sm:w-auto sm:py-2"
      on:click={() => showEntryForm.set(false)}
    >
      Cancel
    </button>
  </div>
</div>
