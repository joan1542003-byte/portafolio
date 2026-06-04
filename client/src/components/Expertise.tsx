import { Bot, Globe, Palette, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LiquidGlass } from "./LiquidGlass";
import { Reveal } from "./Reveal";

const services: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Palette,
    title: "Diseño Gráfico",
    description: "Identidad, editorial y piezas con narrativa visual clara.",
  },
  {
    icon: Globe,
    title: "Diseño Web",
    description: "Experiencias digitales rápidas, accesibles y memorables.",
  },
  {
    icon: Bot,
    title: "Diseño con IA",
    description: "Flujos creativos asistidos con dirección de arte humana.",
  },
  {
    icon: Sparkles,
    title: "Branding",
    description: "Sistemas de marca coherentes en todos los puntos de contacto.",
  },
];

export function Expertise() {
  return (
    <section id="expertise" className="px-6 py-24 max-w-6xl mx-auto">
      <Reveal>
        <h2 className="font-display text-4xl md:text-5xl font-bold italic text-ink mb-4">
          Expertise
        </h2>
        <p className="text-ink/60 max-w-lg mb-14 font-light">
          Cuatro disciplinas, un mismo estándar: claridad, audacia y detalle.
        </p>
      </Reveal>
      <div className="grid sm:grid-cols-2 gap-6">
        {services.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.1}>
            <LiquidGlass className="p-8 h-full">
              <item.icon className="w-10 h-10 text-accent mb-5" strokeWidth={1.5} />
              <h3 className="font-display text-2xl font-bold italic mb-3">{item.title}</h3>
              <p className="text-ink/65 font-light leading-relaxed">{item.description}</p>
            </LiquidGlass>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
