import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Contact } from "../components/Contact";
import { Expertise } from "../components/Expertise";
import { Hero } from "../components/Hero";
import { Navbar } from "../components/Navbar";
import { ProjectsGrid } from "../components/ProjectsGrid";
import { usePageTheme } from "../context/PageThemeContext";
import type { Project } from "../types/project";

export function HomePage() {
  const { resetBackground } = usePageTheme();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    resetBackground();
  }, [resetBackground]);

  useEffect(() => {
    api
      .getProjects()
      .then(setProjects)
      .catch((e) => setError(e instanceof Error ? e.message : "Error"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar variant="home" />
      <main>
        <Hero />
        <Expertise />
        {loading && (
          <p className="text-center text-ink/50 py-20 font-light">Cargando proyectos…</p>
        )}
        {error && (
          <p className="text-center text-red-600 py-20">
            No se pudo conectar al servidor. Ejecuta <code className="text-sm">npm run dev</code> en la raíz.
          </p>
        )}
        {!loading && !error && <ProjectsGrid projects={projects} />}
        <Contact />
      </main>
    </>
  );
}
