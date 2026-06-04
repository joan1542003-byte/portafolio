import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Project } from "../types/project";
import { Reveal } from "./Reveal";

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  return (
    <section id="proyectos" className="px-6 py-24 max-w-6xl mx-auto">
      <Reveal>
        <h2 className="font-display text-4xl md:text-5xl font-bold italic text-ink mb-14">
          Proyectos
        </h2>
      </Reveal>
      <div className="grid sm:grid-cols-2 gap-8">
        {projects.map((project, i) => (
          <Reveal key={project.id} delay={i * 0.08}>
            <Link to={`/proyecto/${project.id}`} className="group block">
              <div className="relative overflow-hidden rounded-squircle aspect-[4/3]">
                <motion.img
                  src={project.thumbnailUrl}
                  alt={project.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
                <div className="absolute inset-0 bg-ink/10 group-hover:bg-ink/5 transition-colors duration-500" />
                <motion.div
                  initial={{ y: 24, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 liquid-glass px-6 py-3 flex items-center gap-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <span className="text-sm font-medium text-ink">Ver Proyecto</span>
                  <ArrowUpRight className="w-4 h-4 text-accent" />
                </motion.div>
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <h3 className="font-display text-2xl font-bold italic">{project.title}</h3>
                <span className="text-xs uppercase tracking-wider text-accent font-medium">
                  {project.category}
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
