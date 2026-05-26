const STORAGE_KEY = "dev-cheatsheets-data";

export async function loadCheatsheets() {
  const response = await fetch("/content/index.json");
  if (!response.ok) {
    throw new Error("Failed to load cheatsheet data");
  }
  const base = await response.json();
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return base;
  }
  try {
    return JSON.parse(saved);
  } catch {
    return base;
  }
}

export function saveCheatsheets(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
