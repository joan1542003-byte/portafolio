import type { ComponentProps } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";

type LiquidGlassProps = ComponentProps<typeof motion.div> & {
  hover?: boolean;
  elevated?: boolean;
};

export function LiquidGlass({
  className,
  hover = true,
  elevated = false,
  children,
  ...props
}: LiquidGlassProps) {
  return (
    <motion.div
      className={cn(
        "liquid-glass squircle",
        elevated && "liquid-glass-elevated",
        hover && "liquid-glass-hover",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
