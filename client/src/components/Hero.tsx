import { motion } from "framer-motion";

const words = ["Diseño", "Extraordinario."];

export function Hero() {
  return (
    <section className="relative min-h-[88vh] flex flex-col justify-center items-center text-center px-6 pt-32 pb-20">
      <p className="text-sm uppercase tracking-[0.3em] text-ink/50 font-medium mb-8">
        Diseñador multidisciplinario
      </p>
      <h1 className="font-display font-bold italic text-ink leading-[0.95] max-w-4xl">
        {words.map((word, wi) => (
          <span key={word} className="inline-block mr-[0.2em] last:mr-0">
            {word.split("").map((char, ci) => (
              <motion.span
                key={`${wi}-${ci}`}
                className="inline-block text-5xl sm:text-7xl md:text-8xl text-accent last:text-ink"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: wi * 0.15 + ci * 0.04,
                  duration: 0.5,
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="mt-10 max-w-xl text-lg text-ink/65 font-light"
      >
        Gráfico, web, IA y branding — interfaces editoriales con criterio visual y
        ejecución técnica impecable.
      </motion.p>
      <motion.a
        href="#proyectos"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="btn-scale mt-12 inline-flex items-center gap-2 rounded-squircle bg-accent px-8 py-4 text-cream font-medium shadow-lg shadow-accent/25"
      >
        Ver proyectos
      </motion.a>
    </section>
  );
}
