/**
 * Normalizes an external URL coming from content. A bare domain such as
 * "ewubd.edu" would otherwise resolve relative to the site, so it gets an
 * https:// scheme. Anything that already has a scheme (https:, mailto:, …)
 * is left untouched.
 */
export function externalHref(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  return `https://${trimmed}`;
}
