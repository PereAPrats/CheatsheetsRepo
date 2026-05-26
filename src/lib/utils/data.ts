import type { CheatsheetData } from "../types";

const STORAGE_KEY = "dev-cheatsheets-data";

async function loadFromAPI(): Promise<CheatsheetData | null> {
  try {
    const res = await fetch("/api/data");
    if (!res.ok) return null;
    return (await res.json()) as CheatsheetData;
  } catch {
    return null;
  }
}

async function saveToAPI(data: CheatsheetData): Promise<boolean> {
  try {
    const res = await fetch("/api/data", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function loadCheatsheets(): Promise<CheatsheetData> {
  const api = await loadFromAPI();
  if (api) return api;

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved) as CheatsheetData;
    } catch {
      // fall through
    }
  }

  const response = await fetch("/content/index.json");
  if (!response.ok) {
    throw new Error("Failed to load cheatsheet data");
  }
  return (await response.json()) as CheatsheetData;
}

export async function saveCheatsheets(data: CheatsheetData): Promise<void> {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  await saveToAPI(data);
}
