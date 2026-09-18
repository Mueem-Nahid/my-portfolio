import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

/**
 * Typed content loaders (docs/requirments.md §7).
 *
 * The filesystem is the backend: everything the owner edits lives in /content
 * as frontmatter + optional MDX body. Adding a project = adding one .mdx file
 * with valid frontmatter — no component, route, or config changes.
 */

const CONTENT_DIR = path.join(process.cwd(), "content");

// ---------- Frontmatter schemas ----------

const profileSchema = z.object({
  name: z.string(),
  title: z.string(),
  tagline: z.string(),
  statusLine: z.string(),
  location: z.string(),
  email: z.email(),
  socials: z.object({
    github: z.url(),
    linkedin: z.url(),
  }),
  /** Second line under the hero status card naming the AI/ML direction (§3.1) */
  currentlyLine: z.string().default(""),
  /** Concrete availability signal, e.g. "Typically responds within 24h" (§4.2) */
  responseTime: z.string().default(""),
  /** Compact continued-learning list, rendered at the bottom of LabSection (§2.6) */
  coursework: z
    .array(
      z.object({
        name: z.string(),
        provider: z.string(),
        status: z.enum(["in-progress", "completed"]),
        certUrl: z.string().default(""),
      }),
    )
    .default([]),
});

const projectSchema = z.object({
  title: z.string(),
  summary: z.string(),
  role: z.string(),
  period: z.string(),
  /** Bento grid cell size */
  size: z.enum(["1x1", "2x1", "1x2", "2x2"]),
  featured: z.boolean(),
  tech: z.array(z.string()),
  /** Resume-sourced bullets, shown in the experience timeline */
  highlights: z.array(z.string()).default([]),
  liveUrl: z.string().default(""),
  repoUrl: z.string().default(""),
  image: z.string().default(""),
});

const experienceSchema = z.object({
  company: z.string(),
  role: z.string(),
  /** "YYYY-MM" */
  start: z.string(),
  /** null = present */
  end: z.string().nullable(),
  location: z.string(),
  /** Company website — the name becomes an external link when set */
  url: z.string().default(""),
  projectSlugs: z.array(z.string()).default([]),
});

const educationSchema = z.object({
  degree: z.string(),
  institution: z.string(),
  start: z.string(),
  end: z.string(),
  location: z.string(),
  grade: z.string(),
  /** Institution website — the name becomes an external link when set */
  url: z.string().default(""),
});

// ---------- v2 schemas (PORTFOLIO-V2-UPDATE.md §4.1, §2.4) ----------

const serviceSchema = z.object({
  title: z.string(),
  summary: z.string(),
  deliverables: z.array(z.string()),
  timeline: z.string(),
  /** lucide icon name */
  icon: z.string().default(""),
  order: z.number(),
  /**
   * Owner fills in a real number; omit the field entirely to hide price.
   * Never fabricate — no price UI renders when absent.
   */
  startingAt: z.string().optional(),
});

const labProjectSchema = z.object({
  title: z.string(),
  summary: z.string(),
  status: z.enum(["live", "in-progress", "archived"]),
  category: z.string().default("AI/ML"),
  tech: z.array(z.string()),
  metrics: z.array(z.string()).default([]),
  demoUrl: z.string().default(""),
  repoUrl: z.string().default(""),
  /** "YYYY-MM" */
  lastUpdated: z.string().default(""),
  featured: z.boolean().default(false),
});

const testimonialSchema = z.object({
  clientName: z.string(),
  clientRole: z.string().default(""),
  quote: z.string(),
  /** optional link back to a /work/[slug] or service */
  projectSlug: z.string().default(""),
});

const faqSchema = z.object({
  faqs: z.array(
    z.object({
      q: z.string(),
      a: z.string(),
    }),
  ),
});

// ---------- Public types ----------

export type Profile = z.infer<typeof profileSchema>;

export type ProjectImage = {
  src: string;
  alt: string;
  /** Intrinsic size when readable (webp) — lets the gallery request the right variant */
  width: number | null;
  height: number | null;
};

export type Project = z.infer<typeof projectSchema> & {
  slug: string;
  /** Raw MDX body ("" when the file has frontmatter only) */
  body: string;
  /** Whether this project gets a generated /work/[slug] detail page */
  hasBody: boolean;
  /** Screenshots auto-discovered from public/images/projects/<slug>/webp/ */
  images: ProjectImage[];
};

export type ExperienceEntry = z.infer<typeof experienceSchema> & {
  /** Resolved from projectSlugs, in listed order */
  projects: Project[];
};

export type EducationEntry = z.infer<typeof educationSchema>;

export type CourseworkEntry = z.infer<typeof profileSchema>["coursework"][number];

export type Service = z.infer<typeof serviceSchema> & {
  slug: string;
};

export type LabProject = z.infer<typeof labProjectSchema> & {
  slug: string;
  /** Raw MDX body ("" when the file has frontmatter only) */
  body: string;
  /** Whether this project gets a generated /lab/[slug] detail page */
  hasBody: boolean;
};

export type Testimonial = z.infer<typeof testimonialSchema> & {
  slug: string;
};

export type FaqEntry = z.infer<typeof faqSchema>["faqs"][number];

// ---------- Internals ----------

function readFile(filePath: string) {
  return matter(fs.readFileSync(filePath, "utf8"));
}

function listFiles(dir: string, exts: string[]): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => exts.includes(path.extname(f)))
    .map((f) => path.join(dir, f));
}

function parseOrThrow<T>(schema: z.ZodType<T>, data: unknown, file: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(
      `Invalid frontmatter in ${file}:\n${z.prettifyError(result.error)}`,
    );
  }
  return result.data;
}

function loadExperienceFrontmatter() {
  return listFiles(path.join(CONTENT_DIR, "experience"), [".md"])
    .map((file) => parseOrThrow(experienceSchema, readFile(file).data, file))
    .sort((a, b) => b.start.localeCompare(a.start));
}

/**
 * featured first, then order of appearance in experience projectSlugs
 * (most recent role first), then alphabetically.
 */
function sortProjects(projects: Project[]): Project[] {
  const order = new Map<string, number>();
  for (const entry of loadExperienceFrontmatter()) {
    for (const slug of entry.projectSlugs) {
      if (!order.has(slug)) order.set(slug, order.size);
    }
  }
  return [...projects].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    const ai = order.get(a.slug) ?? Number.MAX_SAFE_INTEGER;
    const bi = order.get(b.slug) ?? Number.MAX_SAFE_INTEGER;
    if (ai !== bi) return ai - bi;
    return a.title.localeCompare(b.title);
  });
}

// ---------- Loaders ----------

export function getProfile(): Profile {
  const file = path.join(CONTENT_DIR, "profile.md");
  return parseOrThrow(profileSchema, readFile(file).data, file);
}

function loadProject(filePath: string): Project {
  const { data, content } = readFile(filePath);
  const frontmatter = parseOrThrow(projectSchema, data, filePath);
  const slug = path.basename(filePath, path.extname(filePath));
  const body = content.trim();
  const images = getProjectImages(slug, frontmatter.title);
  // A real cover screenshot (images[0], cover-first) beats the SVG placeholder.
  const image = images.length > 0 ? images[0].src : frontmatter.image;
  return { ...frontmatter, image, slug, body, hasBody: body.length > 0, images };
}

/**
 * Screenshots are auto-discovered from public/images/projects/<slug>/webp/ —
 * adding images later = dropping files into that folder, no frontmatter edit.
 * Sorted cover-first, then alphabetically.
 *
 * Filenames must avoid +, #, % and ? — those characters break Next's image
 * optimizer (verified: it returns 400 "not a valid image"), so the build fails
 * loudly here with the fix instead of shipping a broken screenshot.
 */
function getProjectImages(slug: string, title: string): ProjectImage[] {
  const dir = path.join(process.cwd(), "public", "images", "projects", slug, "webp");
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((f) => /\.(webp|png|jpe?g|avif)$/i.test(f))
    .sort((a, b) => {
      const aCover = /^cover\./i.test(a) ? 0 : 1;
      const bCover = /^cover\./i.test(b) ? 0 : 1;
      return aCover - bCover || a.localeCompare(b);
    });

  for (const file of files) {
    if (/[+#%?]/.test(file)) {
      throw new Error(
        `Unsupported character in image filename: ${file}\n` +
          `  -> ${path.join(dir, file)}\n` +
          `Rename the file without +, #, % or ? (those break image optimization).`,
      );
    }
  }

  return files.map((file) => {
    const name = file.replace(/\.[^.]+$/, "").replace(/[-_+]+/g, " ").trim();
    const size = readWebpSize(path.join(dir, file));
    return {
      src: `/images/projects/${slug}/webp/${file}`,
      alt: `${title} screenshot: ${name}`,
      width: size?.width ?? null,
      height: size?.height ?? null,
    };
  });
}

/** Minimal WebP header reader (VP8 / VP8L / VP8X) — no extra dependencies. */
function readWebpSize(filePath: string): { width: number; height: number } | null {
  try {
    const buf = fs.readFileSync(filePath);
    if (
      buf.length < 30 ||
      buf.toString("ascii", 0, 4) !== "RIFF" ||
      buf.toString("ascii", 8, 12) !== "WEBP"
    ) {
      return null;
    }
    const format = buf.toString("ascii", 12, 16);
    if (format === "VP8X") {
      return {
        width: buf.readUIntLE(24, 3) + 1,
        height: buf.readUIntLE(27, 3) + 1,
      };
    }
    if (format === "VP8L") {
      const bits = buf.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    if (format === "VP8 ") {
      return {
        width: buf.readUInt16LE(26) & 0x3fff,
        height: buf.readUInt16LE(28) & 0x3fff,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function getAllProjects(): Project[] {
  const files = listFiles(path.join(CONTENT_DIR, "projects"), [".mdx", ".md"]);
  return sortProjects(files.map(loadProject));
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((p) => p.featured);
}

export function getProjectBySlug(slug: string): Project | null {
  return getAllProjects().find((p) => p.slug === slug) ?? null;
}

/** Projects that get a /work/[slug] detail page (frontmatter + MDX body). */
export function getProjectsWithBody(): Project[] {
  return getAllProjects().filter((p) => p.hasBody);
}

export function getExperience(): ExperienceEntry[] {
  const bySlug = new Map(getAllProjects().map((p) => [p.slug, p]));
  return loadExperienceFrontmatter().map((entry) => ({
    ...entry,
    projects: entry.projectSlugs.map((slug) => {
      const project = bySlug.get(slug);
      if (!project) {
        throw new Error(
          `Experience "${entry.company}" references unknown project slug "${slug}"`,
        );
      }
      return project;
    }),
  }));
}

export function getEducation(): EducationEntry[] {
  return listFiles(path.join(CONTENT_DIR, "education"), [".md"])
    .map((file) => parseOrThrow(educationSchema, readFile(file).data, file))
    .sort((a, b) => b.start.localeCompare(a.start));
}

// ---------- v2 loaders ----------

/** Services sorted by explicit `order` — 3 max per spec (§4.1). */
export function getServices(): Service[] {
  return listFiles(path.join(CONTENT_DIR, "services"), [".md"])
    .map((file) => {
      const frontmatter = parseOrThrow(serviceSchema, readFile(file).data, file);
      return { ...frontmatter, slug: path.basename(file, path.extname(file)) };
    })
    .sort((a, b) => a.order - b.order);
}

function loadLabProject(filePath: string): LabProject {
  const { data, content } = readFile(filePath);
  const frontmatter = parseOrThrow(labProjectSchema, data, filePath);
  const slug = path.basename(filePath, path.extname(filePath));
  const body = content.trim();
  return { ...frontmatter, slug, body, hasBody: body.length > 0 };
}

/** Featured first, then most recently updated. */
export function getLabProjects(): LabProject[] {
  const files = listFiles(path.join(CONTENT_DIR, "lab-projects"), [".mdx", ".md"]);
  return files
    .map(loadLabProject)
    .sort(
      (a, b) =>
        Number(b.featured) - Number(a.featured) ||
        b.lastUpdated.localeCompare(a.lastUpdated) ||
        a.title.localeCompare(b.title),
    );
}

export function getFeaturedLabProjects(): LabProject[] {
  return getLabProjects().filter((p) => p.featured);
}

export function getLabProjectBySlug(slug: string): LabProject | null {
  return getLabProjects().find((p) => p.slug === slug) ?? null;
}

/** Lab projects that get a /lab/[slug] detail page (frontmatter + MDX body). */
export function getLabProjectsWithBody(): LabProject[] {
  return getLabProjects().filter((p) => p.hasBody);
}

/**
 * Empty folder = no section on the page. Never ship a placeholder
 * testimonial — the organism renders null when this is empty (§4.2).
 */
export function getTestimonials(): Testimonial[] {
  return listFiles(path.join(CONTENT_DIR, "testimonials"), [".md"])
    .map((file) => {
      const frontmatter = parseOrThrow(testimonialSchema, readFile(file).data, file);
      return { ...frontmatter, slug: path.basename(file, path.extname(file)) };
    })
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

/** FAQ entries for freelance-client objections (§4.2). Empty array when no file yet. */
export function getFaq(): FaqEntry[] {
  const file = path.join(CONTENT_DIR, "faq.md");
  if (!fs.existsSync(file)) return [];
  return parseOrThrow(faqSchema, readFile(file).data, file).faqs;
}
