import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Project } from "../types/project";
import { Reveal } from "./Reveal";

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const featured = projects.filter((p) => p.featured);

  return (
    <section id="proyectos" className="px-6 sm:px-10 py-28 max-w-6xl mx-auto">
      <Reveal>
        <p className="section-label mb-3">Portafolio</p>
        <h2 className="font-display text-4xl sm:text-6xl font-bold italic text-ink">
          Proyectos destacados
        </h2>
        <p className="mt-5 text-ink/50 font-light max-w-md">
          Selección de casos recientes en marca, información, UX/UI y audiovisual.
        </p>
      </Reveal>

      <div className="mt-16 grid gap-6 sm:gap-8 md:grid-cols-2">
        {featured.map((project, i) => {
          const isWide = i % 3 === 0;
          return (
            <Reveal
              key={project.id}
              delay={i * 0.06}
              className={isWide ? "md:col-span-2" : undefined}
            >
              <Link to={`/proyecto/${project.id}`} className="group block">
                <article
                  className={`grid ${isWide ? "md:grid-cols-[1.2fr_1fr]" : "md:grid-cols-2"} gap-0 overflow-hidden squircle liquid-glass liquid-glass-elevated`}
                >
                  <div
                    className={`relative overflow-hidden ${isWide ? "min-h-[280px] md:min-h-[340px]" : "min-h-[240px]"}`}
                  >
                    <motion.img
                      src={project.thumbnailUrl}
                      alt={project.title}
                      className="absolute inset-0 h-full w-full object-cover"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                    {project.isNew && (
                      <span className="absolute top-5 left-5 badge-new">Nuevo</span>
                    )}

                    <motion.div
                      initial={false}
                      className="absolute bottom-5 left-1/2 -translate-x-1/2 liquid-glass px-5 py-2.5 flex items-center gap-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-400 scale-95 group-hover:scale-100"
                    >
                      <span className="text-sm font-medium">Ver proyecto</span>
                      <ArrowUpRight className="w-4 h-4 text-accent" />
                    </motion.div>
                  </div>

                  <div className="flex flex-col justify-center p-8 sm:p-10">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-accent font-medium mb-3">
                      {project.category}
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold italic text-ink group-hover:text-accent transition-colors duration-500">
                      {project.title}
                    </h3>
                    <p className="mt-4 text-sm text-ink/55 font-light line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                    <div className="mt-6 flex flex-wrap gap-2">
                      {project.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs rounded-full border border-ink/8 bg-white/35 px-3 py-1 text-ink/50"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </article>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
