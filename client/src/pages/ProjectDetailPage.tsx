import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Reveal } from "../components/Reveal";
import { usePageTheme } from "../context/PageThemeContext";
import { loadProject } from "../lib/projectsService";
import type { Project } from "../types/project";

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { setBackgroundColor, resetBackground } = usePageTheme();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    loadProject(id)
      .then((p) => {
        setProject(p);
        setBackgroundColor(p.backgroundColor);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));

    return () => resetBackground();
  }, [id, setBackgroundColor, resetBackground]);

  if (error) {
    return (
      <>
        <div className="grain" aria-hidden />
        <Navbar variant="project" />
        <p className="text-center py-32 text-ink/50">{error}</p>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <div className="grain" aria-hidden />
        <Navbar variant="project" />
        <p className="text-center py-32 text-ink/40 font-light animate-pulse">Cargando…</p>
      </>
    );
  }

  return (
    <>
      <div className="grain" aria-hidden />
      <Navbar variant="project" />
      <article className="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 pt-36 pb-28">
        <Reveal>
          <p className="section-label mb-6">{project.category}</p>
          {project.isNew && <span className="badge-new mb-6 inline-block">Nuevo</span>}
          <h1 className="font-display text-[clamp(2.5rem,8vw,4.5rem)] font-bold italic text-ink leading-[1.02]">
            {project.heroTitle ?? project.title}
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mt-10 text-lg sm:text-xl text-ink/65 font-light leading-relaxed">
            {project.description}
          </p>
          <div className="mt-10 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full liquid-glass px-4 py-1.5 text-sm font-medium text-accent/90"
              >
                {tag}
              </span>
            ))}
          </div>
        </Reveal>

        <div className="mt-16 flex flex-col gap-8 sm:gap-10">
          {project.gallery.map((url, i) => (
            <Reveal key={`${url}-${i}`} delay={i * 0.04}>
              <img
                src={url}
                alt={`${project.title} — ${i + 1}`}
                className="w-full squircle object-cover max-h-[720px]"
                loading="lazy"
              />
            </Reveal>
          ))}
        </div>
      </article>
    </>
  );
}
