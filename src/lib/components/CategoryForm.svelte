<script lang="ts">
  import { addCategory } from "../stores/data";
  import { showCategoryForm } from "../stores/ui";

  let title = "";
  let description = "";

  function handleSubmit() {
    if (!title.trim()) return;
    addCategory(title, description);
    title = "";
    description = "";
    showCategoryForm.set(false);
  }
</script>

<div class="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
  <h3 class="text-sm font-semibold text-slate-900 dark:text-white">Add Collection</h3>
  <div class="mt-3 grid gap-3 sm:grid-cols-2">
    <input
      type="text"
      placeholder="Collection name"
      class="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
      bind:value={title}
    />
    <input
      type="text"
      placeholder="Short description"
      class="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
      bind:value={description}
    />
  </div>
  <div class="mt-3">
    <button
      class="w-full rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 sm:w-auto sm:py-2"
      on:click={handleSubmit}
    >
      Save Collection
    </button>
  </div>
</div>
