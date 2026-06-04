import type { Project } from "../types/project";
import projectsJson from "./projects.json";

export const staticProjects = (projectsJson as Project[]).sort(
  (a, b) => a.order - b.order
);

export function getProjectById(id: string): Project | undefined {
  return staticProjects.find((p) => p.id === id);
}
