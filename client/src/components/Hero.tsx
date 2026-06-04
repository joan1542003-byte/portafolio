import { motion } from "framer-motion";
import type { SiteContent } from "../types/project";

export function Hero({ site }: { site: SiteContent["hero"] }) {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center px-6 sm:px-10 pt-36 pb-24 max-w-6xl mx-auto">
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="section-label mb-10"
      >
        {site.eyebrow}
      </motion.p>

      <h1 className="font-display font-bold italic text-ink leading-[0.92] max-w-5xl">
        {site.titleWords.map((word, wi) => (
          <span key={word} className="block sm:inline sm:mr-[0.15em]">
            {word.split("").map((char, ci) => (
              <motion.span
                key={`${wi}-${ci}-${char}`}
                className={`inline-block text-[clamp(2.75rem,10vw,5.5rem)] ${
                  wi === 0 ? "text-accent" : "text-ink"
                }`}
                initial={{ opacity: 0, y: 48, rotate: wi === 0 ? -2 : 0 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{
                  delay: wi * 0.12 + ci * 0.035,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {char}
              </motion.span>
            ))}
          </span>
        ))}
      </h1>

      <motion.p
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.65 }}
        className="mt-12 max-w-xl text-lg sm:text-xl text-ink/60 font-light leading-relaxed"
      >
        {site.subtitle}
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.15 }}
        className="mt-14 flex flex-wrap gap-4"
      >
        <a href={site.ctaHref} className="btn-primary">
          {site.ctaLabel}
        </a>
        <a href="#sobre-mi" className="btn-ghost">
          Conocer más
        </a>
      </motion.div>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="mt-20 h-px w-24 bg-accent/40 origin-left"
      />
    </section>
  );
}
