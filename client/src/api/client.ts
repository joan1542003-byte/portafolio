import type { Project, SiteContent, Tool } from "../types/project";

const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/$/, "");
const TOKEN_KEY = "portfolio_admin_token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

function apiUrl(path: string): string {
  return `${API_BASE}${path}`;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  };
  const token = getToken();
  if (token) {
    (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(apiUrl(path), { ...options, headers });
  if (!res.ok) {
    const err = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(err.error ?? res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  health: () => request<{ ok: boolean }>("/api/health"),

  login: (password: string) =>
    request<{ token: string; expiresIn: number }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    }),

  logout: () => request<void>("/api/auth/logout", { method: "POST" }),

  verify: () => request<{ valid: boolean }>("/api/auth/verify"),

  getSite: () => request<SiteContent>("/api/site"),

  updateSite: (site: SiteContent) =>
    request<SiteContent>("/api/site", {
      method: "PUT",
      body: JSON.stringify(site),
    }),

  getTools: () => request<Tool[]>("/api/tools"),

  updateTools: (tools: Tool[]) =>
    request<Tool[]>("/api/tools", {
      method: "PUT",
      body: JSON.stringify(tools),
    }),

  getProjects: () => request<Project[]>("/api/projects"),

  getProject: (id: string) => request<Project>(`/api/projects/${id}`),

  reorderProjects: (ids: string[]) =>
    request<Project[]>("/api/projects/reorder", {
      method: "POST",
      body: JSON.stringify({ ids }),
    }),

  createProject: (project: Partial<Project>) =>
    request<Project>("/api/projects", {
      method: "POST",
      body: JSON.stringify(project),
    }),

  updateProject: (id: string, project: Partial<Project>) =>
    request<Project>(`/api/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(project),
    }),

  deleteProject: (id: string) =>
    request<void>(`/api/projects/${id}`, { method: "DELETE" }),
};
