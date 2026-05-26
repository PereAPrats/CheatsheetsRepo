<script lang="ts">
  import { selectedCategoryId, entrySearch } from "../stores/navigation";
  import { showEntryForm, showSnippetForm } from "../stores/ui";

  function goBack() {
    selectedCategoryId.set("");
    entrySearch.set("");
    showEntryForm.set(false);
    showSnippetForm.set(false);
  }
</script>

<button
  class="flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-300 sm:py-2"
  on:click={goBack}
  aria-label="Back to collections"
>
  ←
</button>
