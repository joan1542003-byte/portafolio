import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LiquidGlass } from "./LiquidGlass";

const links = [
  { href: "#sobre-mi", label: "Sobre mí" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#herramientas", label: "Herramientas" },
  { href: "#contacto", label: "Contacto" },
];

export function Navbar({ variant = "home" }: { variant?: "home" | "project" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isProject =
    variant === "project" || location.pathname.startsWith("/proyecto");

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-5 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
    >
      <LiquidGlass
        hover={false}
        elevated
        className="pointer-events-auto flex items-center gap-4 px-4 py-2.5 sm:px-6 sm:py-3 w-full max-w-2xl"
      >
        {isProject ? (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-ghost !px-3 !py-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Volver</span>
          </button>
        ) : (
          <Link
            to="/"
            className="font-display text-lg sm:text-xl font-bold italic text-ink shrink-0"
          >
            Joan.
          </Link>
        )}

        {!isProject && (
          <nav className="hidden md:flex items-center gap-5 ml-auto text-[13px] font-medium text-ink/55">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-accent transition-colors duration-300 relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-accent after:transition-all hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        {isProject && (
          <Link
            to="/"
            className="ml-auto font-display text-base font-bold italic text-accent"
          >
            Joan.
          </Link>
        )}
      </LiquidGlass>
    </motion.header>
  );
}
