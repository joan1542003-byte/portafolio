import { useEffect, useState } from "react";
import { About } from "../components/About";
import { Contact } from "../components/Contact";
import { Expertise } from "../components/Expertise";
import { Hero } from "../components/Hero";
import { Navbar } from "../components/Navbar";
import { ProjectsGrid } from "../components/ProjectsGrid";
import { Tools } from "../components/Tools";
import { usePageTheme } from "../context/PageThemeContext";
import {
  loadProjects,
  loadSite,
  loadTools,
} from "../lib/projectsService";
import type { Project, SiteContent, Tool } from "../types/project";

export function HomePage() {
  const { resetBackground } = usePageTheme();
  const [site, setSite] = useState<SiteContent | null>(null);
  const [tools, setTools] = useState<Tool[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resetBackground();
  }, [resetBackground]);

  useEffect(() => {
    Promise.all([loadSite(), loadTools(), loadProjects()])
      .then(([s, t, p]) => {
        setSite(s);
        setTools(t);
        setProjects(p);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading || !site) {
    return (
      <>
        <div className="grain" aria-hidden />
        <Navbar />
        <p className="text-center py-40 text-ink/40 font-light animate-pulse">
          Cargando portafolio…
        </p>
      </>
    );
  }

  return (
    <>
      <div className="grain" aria-hidden />
      <Navbar />
      <main className="relative z-10">
        <Hero site={site.hero} />
        <About about={site.about} />
        <Expertise />
        <ProjectsGrid projects={projects} />
        <Tools
          tools={tools}
          title={site.toolsTitle}
          subtitle={site.toolsSubtitle}
        />
        <Contact contact={site.contact} />
      </main>
      <footer className="pb-8 text-center text-xs text-ink/35 font-light">
        Joan Design · {new Date().getFullYear()}
      </footer>
    </>
  );
}
