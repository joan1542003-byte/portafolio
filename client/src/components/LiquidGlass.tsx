import type { ComponentProps } from "react";
import { motion } from "framer-motion";
import { cn } from "../lib/cn";

type LiquidGlassProps = ComponentProps<typeof motion.div> & {
  hover?: boolean;
};

export function LiquidGlass({
  className,
  hover = true,
  children,
  ...props
}: LiquidGlassProps) {
  return (
    <motion.div
      className={cn(
        "liquid-glass rounded-squircle",
        hover && "liquid-glass-hover",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
