import { Mail } from "lucide-react";
import { LiquidGlass } from "./LiquidGlass";
import { Reveal } from "./Reveal";

export function Contact() {
  return (
    <section id="contacto" className="px-6 py-24 max-w-6xl mx-auto pb-32">
      <Reveal>
        <LiquidGlass className="p-12 md:p-16 text-center">
          <Mail className="w-10 h-10 text-accent mx-auto mb-6" strokeWidth={1.5} />
          <h2 className="font-display text-3xl md:text-4xl font-bold italic mb-4">
            Hablemos
          </h2>
          <p className="text-ink/60 font-light mb-8 max-w-md mx-auto">
            ¿Proyecto nuevo o colaboración? Escríbeme y construimos algo extraordinario.
          </p>
          <a
            href="mailto:hola@tudominio.com"
            className="btn-scale inline-block rounded-squircle border-2 border-accent text-accent px-8 py-3 font-medium hover:bg-accent hover:text-cream"
          >
            hola@tudominio.com
          </a>
        </LiquidGlass>
      </Reveal>
    </section>
  );
}
