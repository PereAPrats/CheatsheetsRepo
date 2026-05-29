import { writable, get } from "svelte/store";

const TOKEN_KEY = "dev-cheatsheets-token";
const USER_KEY = "dev-cheatsheets-user";

type User = {
  id: number;
  username: string;
  email: string;
  created_at: string;
};

type AuthState = {
  token: string | null;
  user: User | null;
};

function createAuthStore() {
  const savedToken = typeof localStorage !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;
  const savedUser = typeof localStorage !== "undefined" ? localStorage.getItem(USER_KEY) : null;

  const initial: AuthState = {
    token: savedToken,
    user: savedUser ? JSON.parse(savedUser) : null,
  };

  const { subscribe, set } = writable<AuthState>(initial);

  subscribe(({ token, user }) => {
    if (typeof localStorage !== "undefined") {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
      else localStorage.removeItem(USER_KEY);
    }
  });

  async function login(username: string, password: string): Promise<void> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    set({ token: data.token, user: data.user });
  }

  async function register(username: string, email: string, password: string): Promise<void> {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");
    set({ token: data.token, user: data.user });
  }

  function logout() {
    set({ token: null, user: null });
  }

  const store = { subscribe };

  async function updateProfile(email: string, password: string): Promise<void> {
    const t = get(store).token;
    if (!t) throw new Error("Not authenticated");
    const res = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${t}`,
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update profile");
    set({ token: t, user: data.user });
  }

  async function updatePassword(currentPassword: string, newPassword: string): Promise<void> {
    const t = get(store).token;
    if (!t) throw new Error("Not authenticated");
    const res = await fetch("/api/auth/password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${t}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update password");
  }

  return { subscribe, login, register, logout, updateProfile, updatePassword };
}

export const auth = createAuthStore();

export function getAuthToken(): string | null {
  if (typeof localStorage !== "undefined") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return null;
}
