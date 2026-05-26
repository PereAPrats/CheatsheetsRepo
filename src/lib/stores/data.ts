import { writable, get } from "svelte/store";
import type { CheatsheetData, Category } from "../types";
import { loadCheatsheets, saveCheatsheets } from "../utils/data";

const internal = writable<CheatsheetData | null>(null);

function save() {
  const current = get(internal);
  if (current) {
    saveCheatsheets(current);
  }
}

export const data = {
  subscribe: internal.subscribe,
  set: internal.set,
};

export async function loadData() {
  const d = await loadCheatsheets();
  internal.set(d);
}

export function addCategory(title: string, description: string) {
  internal.update((d) => {
    if (!d) return d;
    const id = title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .slice(0, 40) || `cat-${Date.now()}`;
    return {
      ...d,
      categories: [...d.categories, { id, title: title.trim(), description: description.trim(), items: [] }],
    };
  });
  save();
}

export function deleteCategory(id: string) {
  internal.update((d) => {
    if (!d) return d;
    return { ...d, categories: d.categories.filter((c) => c.id !== id) };
  });
  save();
}

export function updateCategory(id: string, title: string, description: string) {
  internal.update((d) => {
    if (!d) return d;
    return {
      ...d,
      categories: d.categories.map((c) =>
        c.id === id ? { ...c, title: title.trim() || c.title, description: description.trim() } : c
      ),
    };
  });
  save();
}

export function addEntry(categoryId: string, title: string, snippets: { label: string; code: string }[]) {
  internal.update((d) => {
    if (!d) return d;
    return {
      ...d,
      categories: d.categories.map((c) =>
        c.id === categoryId
          ? { ...c, items: [...c.items, { title: title.trim(), snippets }] }
          : c
      ),
    };
  });
  save();
}

export function deleteEntry(categoryId: string, index: number) {
  internal.update((d) => {
    if (!d) return d;
    return {
      ...d,
      categories: d.categories.map((c) =>
        c.id === categoryId
          ? { ...c, items: c.items.filter((_, i) => i !== index) }
          : c
      ),
    };
  });
  save();
}

export function updateEntry(categoryId: string, index: number, title: string) {
  internal.update((d) => {
    if (!d) return d;
    return {
      ...d,
      categories: d.categories.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              items: c.items.map((item, i) =>
                i === index ? { ...item, title: title.trim() || item.title } : item
              ),
            }
          : c
      ),
    };
  });
  save();
}

export function addSnippet(categoryId: string, itemIndex: number) {
  internal.update((d) => {
    if (!d) return d;
    return {
      ...d,
      categories: d.categories.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              items: c.items.map((item, i) =>
                i === itemIndex
                  ? { ...item, snippets: [...item.snippets, { label: "New snippet", code: "" }] }
                  : item
              ),
            }
          : c
      ),
    };
  });
  save();
}

export function addSnippetWithData(
  categoryId: string,
  itemIndex: number,
  label: string,
  code: string
) {
  internal.update((d) => {
    if (!d) return d;
    return {
      ...d,
      categories: d.categories.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              items: c.items.map((item, i) =>
                i === itemIndex
                  ? { ...item, snippets: [...item.snippets, { label: label.trim(), code: code.trim() }] }
                  : item
              ),
            }
          : c
      ),
    };
  });
  save();
}

export function updateSnippet(
  categoryId: string,
  itemIndex: number,
  snippetIndex: number,
  label: string,
  code: string
) {
  internal.update((d) => {
    if (!d) return d;
    return {
      ...d,
      categories: d.categories.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              items: c.items.map((item, i) =>
                i === itemIndex
                  ? {
                      ...item,
                      snippets: item.snippets.map((s, si) =>
                        si === snippetIndex
                          ? { label: label.trim() || s.label, code: code.trim() || s.code }
                          : s
                      ),
                    }
                  : item
              ),
            }
          : c
      ),
    };
  });
  save();
}

export function deleteSnippet(categoryId: string, itemIndex: number, snippetIndex: number) {
  internal.update((d) => {
    if (!d) return d;
    return {
      ...d,
      categories: d.categories.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              items: c.items.map((item, i) =>
                i === itemIndex
                  ? { ...item, snippets: item.snippets.filter((_, si) => si !== snippetIndex) }
                  : item
              ),
            }
          : c
      ),
    };
  });
  save();
}
