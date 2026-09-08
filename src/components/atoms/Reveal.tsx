"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * The single orchestrated load sequence (§5.4): hero content settles in as
 * one short fade/rise (~500ms). Everything else on the page is static until
 * interacted with. Disabled entirely under prefers-reduced-motion (§5.5).
 */
export function Reveal({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) return <>{children}</>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
