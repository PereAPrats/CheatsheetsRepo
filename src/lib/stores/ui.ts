import { writable } from "svelte/store";

export const manageMode = writable<boolean>(false);
export const showCategoryForm = writable<boolean>(false);
export const showEntryForm = writable<boolean>(false);
export const showSnippetForm = writable<boolean>(false);
export const showSettings = writable<boolean>(false);

