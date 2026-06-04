import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LiquidGlass } from "./LiquidGlass";

const navLinks = [
  { to: "/#expertise", label: "Servicios" },
  { to: "/#proyectos", label: "Proyectos" },
  { to: "/#contacto", label: "Contacto" },
];

export function Navbar({ variant = "home" }: { variant?: "home" | "project" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isProject = variant === "project" || location.pathname.startsWith("/proyecto");

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none"
    >
      <LiquidGlass className="pointer-events-auto flex items-center gap-6 px-5 py-3 max-w-3xl w-full">
        {isProject ? (
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-scale flex items-center gap-2 text-sm font-medium text-ink/80 hover:text-accent"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
        ) : (
          <Link
            to="/"
            className="font-display text-xl font-bold italic text-ink tracking-tight"
          >
            Diseño.
          </Link>
        )}

        {!isProject && (
          <nav className="hidden sm:flex items-center gap-6 ml-auto text-sm font-medium text-ink/70">
            {navLinks.map((link) => (
              <a
                key={link.to}
                href={link.to}
                className="hover:text-accent transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}

        {isProject && (
          <Link
            to="/"
            className="ml-auto font-display text-lg font-bold italic text-accent"
          >
            Diseño.
          </Link>
        )}
      </LiquidGlass>
    </motion.header>
  );
}
