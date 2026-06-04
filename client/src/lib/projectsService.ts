import { api } from "../api/client";
import { getProjectById, staticProjects } from "../data/projects";
import { staticSite } from "../data/site";
import { staticTools } from "../data/tools";
import type { Project, SiteContent, Tool } from "../types/project";

async function withFallback<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);
  try {
    const res = await fetch("/api/health", { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) throw new Error("api down");
    return await fn();
  } catch {
    clearTimeout(timeout);
    return fallback;
  }
}

export async function loadSite(): Promise<SiteContent> {
  return withFallback(() => api.getSite(), staticSite);
}

export async function loadTools(): Promise<Tool[]> {
  return withFallback(() => api.getTools(), staticTools);
}

export async function loadProjects(): Promise<Project[]> {
  return withFallback(() => api.getProjects(), staticProjects);
}

export async function loadProject(id: string): Promise<Project> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const res = await fetch("/api/health", { signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) return await api.getProject(id);
  } catch {
    /* static fallback */
  }
  const project = getProjectById(id);
  if (!project) throw new Error("Proyecto no encontrado");
  return project;
}

export async function checkApiAvailable(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const res = await fetch("/api/health", { signal: controller.signal });
    clearTimeout(timeout);
    return res.ok;
  } catch {
    return false;
  }
}
