import { motion } from "framer-motion";
import type { SiteContent } from "../types/project";
import { LiquidGlass } from "./LiquidGlass";
import { Reveal } from "./Reveal";

export function About({ about }: { about: SiteContent["about"] }) {
  return (
    <section id="sobre-mi" className="px-6 sm:px-10 py-28 max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        <Reveal className="lg:col-span-5">
          <p className="section-label mb-4">Perfil</p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold italic text-ink leading-tight">
            {about.title}
          </h2>
        </Reveal>

        <div className="lg:col-span-7 space-y-8">
          <Reveal delay={0.08}>
            <p className="text-xl sm:text-2xl text-ink/75 font-light leading-snug">
              {about.lead}
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <p className="text-ink/55 font-light leading-relaxed text-base sm:text-lg">
              {about.body}
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <ul className="grid sm:grid-cols-2 gap-3">
              {about.highlights.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                >
                  <LiquidGlass className="px-5 py-4 text-sm font-medium text-ink/70">
                    <span className="text-accent mr-2">—</span>
                    {item}
                  </LiquidGlass>
                </motion.li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
