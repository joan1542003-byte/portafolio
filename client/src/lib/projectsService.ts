import { api } from "../api/client";
import { getProjectById, staticProjects } from "../data/projects";
import { staticSite } from "../data/site";
import { staticTools } from "../data/tools";
import type { Project, SiteContent, Tool } from "../types/project";

async function withFallback<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    await api.health();
    return await fn();
  } catch {
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
    await api.health();
    return await api.getProject(id);
  } catch {
    const project = getProjectById(id);
    if (!project) throw new Error("Proyecto no encontrado");
    return project;
  }
}

export async function checkApiAvailable(): Promise<boolean> {
  try {
    await api.health();
    return true;
  } catch {
    return false;
  }
}
