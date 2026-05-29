import type { CheatsheetData } from "../types";

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
  return { categories: [] };
}

export async function saveCheatsheets(data: CheatsheetData): Promise<void> {
  await saveToAPI(data);
}
