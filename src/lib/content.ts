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
  projectSlugs: z.array(z.string()).default([]),
});

const educationSchema = z.object({
  degree: z.string(),
  institution: z.string(),
  start: z.string(),
  end: z.string(),
  location: z.string(),
  grade: z.string(),
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
