import { Bot, Globe, Palette, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LiquidGlass } from "./LiquidGlass";
import { Reveal } from "./Reveal";

const services: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Palette,
    title: "Diseño Gráfico",
    description: "Identidad, editorial, campañas y piezas con narrativa visual clara.",
  },
  {
    icon: Globe,
    title: "Diseño Web",
    description: "Sitios y productos digitales rápidos, accesibles y memorables.",
  },
  {
    icon: Bot,
    title: "Diseño con IA",
    description: "Flujos creativos asistidos con dirección de arte y criterio humano.",
  },
  {
    icon: Sparkles,
    title: "Branding",
    description: "Sistemas de marca coherentes en todos los puntos de contacto.",
  },
];

export function Expertise() {
  return (
    <section className="px-6 sm:px-10 py-20 max-w-6xl mx-auto">
      <Reveal>
        <p className="section-label mb-3">Disciplinas</p>
        <h2 className="font-display text-3xl sm:text-4xl font-bold italic text-ink/90">
          Lo que hago
        </h2>
      </Reveal>
      <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {services.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.07}>
            <LiquidGlass className="p-6 h-full group">
              <item.icon
                className="w-9 h-9 text-accent mb-4 transition-transform duration-500 group-hover:scale-110"
                strokeWidth={1.4}
              />
              <h3 className="font-display text-xl font-bold italic mb-2">{item.title}</h3>
              <p className="text-sm text-ink/55 font-light leading-relaxed">
                {item.description}
              </p>
            </LiquidGlass>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
