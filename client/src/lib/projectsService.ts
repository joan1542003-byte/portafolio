import { api } from "../api/client";
import { getProjectById, staticProjects } from "../data/projects";
import type { Project } from "../types/project";

const useApi = Boolean(import.meta.env.VITE_API_URL);

export async function loadProjects(): Promise<Project[]> {
  if (useApi) return api.getProjects();
  return staticProjects;
}

export async function loadProject(id: string): Promise<Project> {
  if (useApi) return api.getProject(id);
  const project = getProjectById(id);
  if (!project) throw new Error("Proyecto no encontrado");
  return project;
}

export const hasLiveApi = useApi;
