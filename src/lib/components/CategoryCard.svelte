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
  class="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:-translate-y-1 hover:shadow-md hover:border-sky-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-sky-800 lg:rounded-3xl lg:p-7 lg:hover:-translate-y-1.5 lg:hover:shadow-lg"
  on:click={select}
>
  <h3 class="text-lg font-semibold text-slate-900 dark:text-white lg:text-xl lg:group-hover:text-sky-600 dark:lg:group-hover:text-sky-400">{category.title}</h3>
  <p class="mt-2 text-sm text-slate-500 dark:text-slate-400 lg:text-base">{category.description}</p>
  <p class="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400 lg:mt-6">
    {category.items.length} {category.items.length === 1 ? "entry" : "entries"}
  </p>
</button>
