// API client for loading and saving cheatsheet data with JWT authentication
import type { CheatsheetData } from "../types";
import { getAuthToken } from "../stores/auth";

// Build Authorization header from stored JWT token
function authHeaders(): Record<string, string> {
  const token = getAuthToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

async function loadFromAPI(): Promise<CheatsheetData | null> {
  try {
    const res = await fetch("/api/data", { headers: { ...authHeaders() } });
    if (res.status === 401) return null;
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
      headers: { "Content-Type": "application/json", ...authHeaders() },
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
