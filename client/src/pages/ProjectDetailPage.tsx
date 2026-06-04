import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import { Navbar } from "../components/Navbar";
import { Reveal } from "../components/Reveal";
import { usePageTheme } from "../context/PageThemeContext";
import type { Project } from "../types/project";

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { setBackgroundColor } = usePageTheme();
  const [project, setProject] = useState<Project | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api
      .getProject(id)
      .then((p) => {
        setProject(p);
        setBackgroundColor(p.backgroundColor);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, [id, setBackgroundColor]);

  if (error) {
    return (
      <>
        <Navbar variant="project" />
        <p className="text-center py-32 text-ink/60">{error}</p>
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Navbar variant="project" />
        <p className="text-center py-32 text-ink/50 font-light">Cargando…</p>
      </>
    );
  }

  return (
    <>
      <Navbar variant="project" />
      <article className="max-w-4xl mx-auto px-6 pt-36 pb-24">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.25em] text-accent font-medium mb-6">
            {project.category}
          </p>
          <h1 className="font-display text-5xl md:text-7xl font-bold italic text-ink leading-tight mb-8">
            {project.heroTitle ?? project.title}
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-lg text-ink/70 font-light leading-relaxed mb-10">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2 mb-16">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/50 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-accent border border-accent/20"
              >
                {tag}
              </span>
            ))}
          </div>
        </Reveal>

        <div className="flex flex-col gap-8">
          {project.gallery.map((url, i) => (
            <Reveal key={url} delay={i * 0.05}>
              <img
                src={url}
                alt={`${project.title} — ${i + 1}`}
                className="w-full rounded-squircle object-cover shadow-lg"
              />
            </Reveal>
          ))}
        </div>
      </article>
    </>
  );
}
