<script lang="ts">
  // Root component — handles auth gate, data loading, search/filter, and CRUD
  import { onMount } from "svelte";
  import { loadData, data } from "./lib/stores/data";
  import { selectedCategoryId, searchTerm, entrySearch } from "./lib/stores/navigation";
  import { showCategoryForm, showSettings } from "./lib/stores/ui";
  import { updateCategory, deleteCategory } from "./lib/stores/data";
  import { auth } from "./lib/stores/auth";
  import type { Category } from "./lib/types";
  import Header from "./lib/components/Header.svelte";
  import SearchBar from "./lib/components/SearchBar.svelte";
  import CategoryForm from "./lib/components/CategoryForm.svelte";
  import CategoryCard from "./lib/components/CategoryCard.svelte";
  import CategoryDetail from "./lib/components/CategoryDetail.svelte";
  import LoginForm from "./lib/components/LoginForm.svelte";
  import RegisterForm from "./lib/components/RegisterForm.svelte";
  import SettingsPanel from "./lib/components/SettingsPanel.svelte";

  let error = "";
  let currentCategory: Category | null = null;
  let visibleCategories: Category[] = [];
  let filteredItems: { item: Category["items"][number]; index: number }[] = [];

  let editingCategory = false;
  let editTitle = "";
  let editDescription = "";
  let showingLogin = true;

  // Load data on mount if user is already authenticated (session restored from localStorage)
  onMount(async () => {
    if (!$auth.user) return;
    try {
      await loadData();
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to load data";
    }
  });

  // Reactively load data when user logs in, clear when they log out
  $: if ($auth.user) {
    loadData();
  } else {
    data.set(null);
  }

  // Compute visible categories and filtered items based on search terms
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

{#if !$auth.user}
  <!-- Auth gate: show login or register form when not authenticated -->
  {#if showingLogin}
    <LoginForm onSwitch={() => (showingLogin = false)} />
  {:else}
    <RegisterForm onSwitch={() => (showingLogin = true)} />
  {/if}
{:else}
  <!-- Main application for authenticated users -->
  <main class="min-h-screen p-5 pb-24 sm:p-8 lg:p-12 xl:p-14">
    <Header showBack={!!$selectedCategoryId} />

    {#if $showSettings}
      <SettingsPanel onClose={() => showSettings.set(false)} />
    {/if}

    <section class="mx-auto mt-6 max-w-7xl lg:mt-8">
      <div class="flex flex-col gap-3 lg:gap-4">
        {#if !$selectedCategoryId}
          <SearchBar bind:value={$searchTerm} placeholder="Search collections" />
        {/if}

        {#if $selectedCategoryId}
          <div>
              <div class="flex items-center gap-2">
                <h2 class="text-lg font-semibold text-slate-900 dark:text-white lg:text-xl xl:text-2xl">
                  {currentCategory ? currentCategory.title : "Collections"}
                </h2>
                {#if currentCategory}
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
                <p class="mt-1 text-sm text-slate-500 dark:text-slate-400 lg:text-base xl:text-lg">{currentCategory.description}</p>
              {/if}
            </div>
        {:else}
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-lg font-semibold text-slate-900 dark:text-white lg:text-xl xl:text-2xl">
                Collections
              </h2>
              <button
                class="flex h-7 w-7 items-center justify-center rounded-lg text-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                on:click={() => showCategoryForm.update((v) => !v)}
                aria-label="Add collection"
              >
                +
              </button>
            </div>
          </div>
        {/if}

        {#if $selectedCategoryId}
          <SearchBar bind:value={$entrySearch} placeholder="Search entries" />
        {/if}
      </div>

      {#if $showCategoryForm}
        <CategoryForm />
      {/if}

      {#if editingCategory && currentCategory}
        <div class="mt-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:mt-6 lg:p-8">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between lg:gap-4">
            <div class="flex-1 space-y-2 lg:space-y-3">
              <input
                class="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 lg:px-4 lg:py-3 lg:text-base"
                bind:value={editTitle}
              />
              <textarea
                class="w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 lg:px-4 lg:py-3 lg:text-base"
                rows="2"
                bind:value={editDescription}
              />
            </div>
            <div class="flex flex-row flex-wrap gap-2 lg:gap-3">
              <button
                class="rounded-2xl border border-slate-200 px-4 py-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:px-3 sm:py-2 lg:px-5 lg:py-3 lg:text-sm"
                on:click={saveEditCategory}
              >
                Save
              </button>
              <button
                class="rounded-2xl border border-slate-200 px-4 py-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 sm:px-3 sm:py-2 lg:px-5 lg:py-3 lg:text-sm"
                on:click={cancelEditCategory}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      {/if}

      {#if error}
        <p class="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-600 lg:mt-6">{error}</p>
      {:else if !$data}
        <p class="mt-4 text-sm text-slate-500 lg:mt-8 lg:text-base">Loading cheatsheets...</p>
      {:else if $selectedCategoryId && currentCategory}
        <CategoryDetail
          category={currentCategory}
          items={filteredItems}
        />
      {:else}
        <div class="mt-4 grid gap-4 sm:grid-cols-2 lg:mt-6 lg:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {#each visibleCategories as category}
            <CategoryCard {category} />
          {/each}
        </div>
      {/if}
    </section>
  </main>
{/if}
