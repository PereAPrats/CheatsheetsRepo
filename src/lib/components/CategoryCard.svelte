<script lang="ts">
  import type { Category } from "../types";
  import { selectedCategoryId, entrySearch } from "../stores/navigation";

  export let category: Category;

  function select() {
    selectedCategoryId.set(category.id);
    entrySearch.set("");
  }
</script>

<button
  class="rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
  on:click={select}
>
  <h3 class="text-lg font-semibold text-slate-900 dark:text-white">{category.title}</h3>
  <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">{category.description}</p>
  <p class="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
    {category.items.length} entries
  </p>
</button>
