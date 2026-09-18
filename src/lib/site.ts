import { execSync } from "node:child_process";

let cached: string | null | undefined;

/**
 * Site "last updated" = date of the latest commit. Evaluated once per
 * process and baked into static pages at build time. Null when git is
 * unavailable — callers must hide the line rather than guess a date.
 */
export function getLastUpdated(): string | null {
  if (cached !== undefined) return cached;
  try {
    const out = execSync("git log -1 --format=%cs", {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 5000,
      cwd: process.cwd(),
    }).trim();
    cached = /^\d{4}-\d{2}-\d{2}$/.test(out) ? out : null;
  } catch {
    cached = null;
  }
  return cached;
}
