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
  class="flex w-11 items-center justify-center self-stretch rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-100 hover:text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-300 lg:w-12 lg:rounded-2xl"
  on:click={goBack}
  aria-label="Back to collections"
>
  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
    <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
</button>
