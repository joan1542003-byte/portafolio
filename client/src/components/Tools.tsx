import {
  BookOpen,
  Clapperboard,
  Film,
  Figma,
  Image,
  PenTool,
  type LucideIcon,
} from "lucide-react";
import type { Tool } from "../types/project";
import { LiquidGlass } from "./LiquidGlass";
import { Reveal } from "./Reveal";

const iconMap: Record<string, LucideIcon> = {
  figma: Figma,
  "book-open": BookOpen,
  "pen-tool": PenTool,
  clapperboard: Clapperboard,
  image: Image,
  film: Film,
};

export function Tools({
  tools,
  title,
  subtitle,
}: {
  tools: Tool[];
  title: string;
  subtitle: string;
}) {
  return (
    <section id="herramientas" className="px-6 sm:px-10 py-28 max-w-6xl mx-auto">
      <Reveal>
        <p className="section-label mb-3">Stack</p>
        <h2 className="font-display text-4xl sm:text-5xl font-bold italic">{title}</h2>
        <p className="mt-4 text-ink/55 font-light max-w-lg">{subtitle}</p>
      </Reveal>

      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tools.map((tool, i) => {
          const Icon = iconMap[tool.icon] ?? PenTool;
          return (
            <Reveal key={tool.id} delay={i * 0.05}>
              <LiquidGlass className="p-7 h-full group">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-white/50 p-3 border border-white/80">
                    <Icon className="w-6 h-6 text-accent" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-medium text-ink mb-2">{tool.name}</h3>
                    <p className="text-sm text-ink/55 font-light leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </LiquidGlass>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
