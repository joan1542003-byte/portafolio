import { Mail, MapPin } from "lucide-react";
import type { SiteContent } from "../types/project";
import { LiquidGlass } from "./LiquidGlass";
import { Reveal } from "./Reveal";

export function Contact({ contact }: { contact: SiteContent["contact"] }) {
  return (
    <section id="contacto" className="px-6 sm:px-10 py-28 max-w-6xl mx-auto pb-36">
      <Reveal>
        <LiquidGlass elevated className="p-10 sm:p-16 md:p-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="section-label mb-4">{contact.title}</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold italic leading-tight">
                Construyamos algo{" "}
                <span className="text-accent">extraordinario</span>
              </h2>
              <p className="mt-6 text-ink/55 font-light leading-relaxed">
                {contact.description}
              </p>
            </div>
            <div className="space-y-5">
              <a
                href={`mailto:${contact.email}`}
                className="btn-primary w-full sm:w-auto justify-center"
              >
                <Mail className="w-4 h-4" />
                {contact.email}
              </a>
              {contact.linkedin && (
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost w-full sm:w-auto justify-center"
                >
                  LinkedIn
                </a>
              )}
              <p className="flex items-center gap-2 text-sm text-ink/45 font-light justify-center sm:justify-start">
                <MapPin className="w-4 h-4 text-accent/70" />
                {contact.location}
              </p>
            </div>
          </div>
        </LiquidGlass>
      </Reveal>
    </section>
  );
}
