import { writable, derived } from "svelte/store";
import { data } from "./data";

export const selectedCategoryId = writable<string>("");
export const searchTerm = writable<string>("");
export const entrySearch = writable<string>("");

export const selectedCategory = derived(
  [data, selectedCategoryId],
  ([$data, $id]) => ($data ? $data.categories.find((c) => c.id === $id) ?? null : null)
);

export const visibleCategories = derived([data, searchTerm], ([$data, $term]) => {
  if (!$data) return [];
  const t = $term.trim().toLowerCase();
  if (!t) return $data.categories;
  return $data.categories.filter((c) => {
    const catMatch = c.title.toLowerCase().includes(t) || c.description.toLowerCase().includes(t);
    const itemMatch = c.items.some(
      (item) =>
        item.title.toLowerCase().includes(t) ||
        item.snippets.some((s) => s.label.toLowerCase().includes(t) || s.code.toLowerCase().includes(t))
    );
    return catMatch || itemMatch;
  });
});

export const filteredItems = derived([selectedCategory, entrySearch], ([$cat, $term]) => {
  if (!$cat) return [];
  const t = $term.trim().toLowerCase();
  if (!t) return $cat.items;
  return $cat.items.filter(
    (item) =>
      item.title.toLowerCase().includes(t) ||
      item.snippets.some((s) => s.label.toLowerCase().includes(t) || s.code.toLowerCase().includes(t))
  );
});
