import { writable, get } from "svelte/store";

function createThemeStore() {
  const saved = typeof localStorage !== "undefined" ? localStorage.getItem("theme") : null;
  const prefersDark =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false;
  const initial = saved ? saved === "dark" : prefersDark;

  const store = writable<boolean>(initial);

  function apply(next: boolean) {
    store.set(next);
    const root = document.documentElement;
    root.classList.toggle("dark", next);
    document.body.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  if (typeof document !== "undefined") {
    apply(initial);
  }

  return {
    subscribe: store.subscribe,
    toggle: () => apply(!get(store)),
  };
}

export const theme = createThemeStore();
