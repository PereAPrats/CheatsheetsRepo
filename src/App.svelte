<script lang="ts">
  import { onMount } from "svelte";
  import { loadData, data } from "./lib/stores/data";
  import { selectedCategoryId, searchTerm, entrySearch } from "./lib/stores/navigation";
  import { showCategoryForm } from "./lib/stores/ui";
  import { updateCategory, deleteCategory } from "./lib/stores/data";
  import type { Category } from "./lib/types";
  import Header from "./lib/components/Header.svelte";
  import BackButton from "./lib/components/BackButton.svelte";
  import SearchBar from "./lib/components/SearchBar.svelte";
  import CategoryForm from "./lib/components/CategoryForm.svelte";
  import CategoryCard from "./lib/components/CategoryCard.svelte";
  import CategoryDetail from "./lib/components/CategoryDetail.svelte";

  let error = "";
  let currentCategory: Category | null = null;
  let visibleCategories: Category[] = [];
  let filteredItems: { item: Category["items"][number]; index: number }[] = [];

  let editingCategory = false;
  let editTitle = "";
  let editDescription = "";

  onMount(async () => {
    try {
      await loadData();
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load data";
    }
  });

  $: {
    if (!$data) {
      visibleCategories = [];
      currentCategory = null;
      filteredItems = [];
    } else {
      const s = $searchTerm.trim().toLowerCase();
      if (!s) {
        visibleCategories = $data.categories;
      } else {
        visibleCategories = $data.categories.filter((c) => {
          const catMatch = c.title.toLowerCase().includes(s) || c.description.toLowerCase().includes(s);
          const itemMatch = c.items.some(
            (item) =>
              item.title.toLowerCase().includes(s) ||
              item.snippets.some((sn) => sn.label.toLowerCase().includes(s) || sn.code.toLowerCase().includes(s))
          );
          return catMatch || itemMatch;
        });
      }

      currentCategory = $data.categories.find((c) => c.id === $selectedCategoryId) ?? null;

      if (!currentCategory) {
        filteredItems = [];
      } else {
        const es = $entrySearch.trim().toLowerCase();
        if (!es) {
          filteredItems = currentCategory.items.map((item, index) => ({ item, index }));
        } else {
          filteredItems = currentCategory.items
            .map((item, index) => ({ item, index }))
            .filter(
              ({ item }) =>
                item.title.toLowerCase().includes(es) ||
                item.snippets.some((sn) => sn.label.toLowerCase().includes(es) || sn.code.toLowerCase().includes(es))
            );
        }
      }
    }
  }

  function startEditCategory() {
    if (!currentCategory) return;
    editTitle = currentCategory.title;
    editDescription = currentCategory.description;
    editingCategory = true;
  }

  function saveEditCategory() {
    if (!currentCategory) return;
    updateCategory(currentCategory.id, editTitle, editDescription);
    editingCategory = false;
  }

  function cancelEditCategory() {
    editingCategory = false;
  }

  function deleteCurrentCategory() {
    if (!currentCategory) return;
    if (confirm("Delete this collection and all its entries?")) {
      const id = currentCategory.id;
      selectedCategoryId.set("");
      entrySearch.set("");
      deleteCategory(id);
    }
  }
</script>

<main class="min-h-screen p-5 pb-24 sm:p-8 lg:p-10">
  <Header />

  <section class="mx-auto mt-6 max-w-7xl">
    <div class="flex flex-col gap-3">
      <div>
        <div class="flex items-center gap-2">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
            {currentCategory ? currentCategory.title : "Collections"}
          </h2>
          {#if !$selectedCategoryId}
            <button
              class="flex h-7 w-7 items-center justify-center rounded-lg text-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              on:click={() => showCategoryForm.update((v) => !v)}
              aria-label="Add collection"
            >
              +
            </button>
          {:else if currentCategory}
            <button
              class="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              on:click={startEditCategory}
              aria-label="Edit collection"
              title="Edit collection"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              class="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-rose-500 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-rose-400"
              on:click={deleteCurrentCategory}
              aria-label="Delete collection"
              title="Delete collection"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          {/if}
        </div>
        {#if currentCategory}
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">{currentCategory.description}</p>
        {/if}
      </div>

      {#if $selectedCategoryId}
        <div class="flex items-center gap-2">
          <BackButton />
          <SearchBar bind:value={$entrySearch} placeholder="Search entries" />
        </div>
      {:else}
        <SearchBar bind:value={$searchTerm} placeholder="Search collections" />
      {/if}
    </div>

    {#if $showCategoryForm}
      <CategoryForm />
    {/if}

    {#if editingCategory && currentCategory}
      <div class="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div class="flex-1">
            <input
              class="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              bind:value={editTitle}
            />
            <textarea
              class="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
              rows="2"
              bind:value={editDescription}
            />
          </div>
          <div class="flex flex-row flex-wrap gap-2">
            <button
              class="rounded-2xl border border-slate-200 px-4 py-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:px-3 sm:py-2"
              on:click={saveEditCategory}
            >
              Save
            </button>
            <button
              class="rounded-2xl border border-slate-200 px-4 py-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:px-3 sm:py-2"
              on:click={cancelEditCategory}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    {/if}

    {#if error}
      <p class="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600">{error}</p>
    {:else if !$data}
      <p class="mt-4 text-sm text-slate-500">Loading cheatsheets...</p>
    {:else if $selectedCategoryId && currentCategory}
      <CategoryDetail
        category={currentCategory}
        items={filteredItems}
      />
    {:else}
      <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {#each visibleCategories as category}
          <CategoryCard {category} />
        {/each}
      </div>
    {/if}
  </section>
</main>
