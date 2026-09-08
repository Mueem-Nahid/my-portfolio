Read both docs. The spec is a complete build plan already (§9 gives the task order); I've also checked the installed stack and the bundled Next.js 16 docs (this project runs **Next 16.3.4**, not 15 — the AGENTS.md warning applies, so a few spec points need adjusting). Here is the implementation plan:

## Ground decisions (spec ambiguities resolved)

| Decision | Choice | Reason |
|---|---|---|
| Static export vs. default build | **Default fully-static build on Vercel** (all routes static via `generateStaticParams`) | `output: 'export'` kills `next/image` optimization and complicates `next/og` (verified in `static-exports.md`); spec §8 permits either |
| Content dir | `content/` at **repo root** (per §7, not §6's `src/content/`) | Owner edits content without touching `src/`; §7 is the content source of truth |
| MDX rendering | `gray-matter` + `zod` frontmatter; body via **`next-mdx-remote/rsc`** (compat-check against React 19; fallback: compile MDX at build time) | `@next/mdx` doesn't support frontmatter (verified in `mdx.md`); Contentlayer is unmaintained |
| Fonts | **Geist** (self-hosted, via `geist` package) + **JetBrains Mono** via `next/font/google` | General Sans requires sourcing font files; Geist is the spec's named alternative |
| Images | `public/images/projects/` referenced from frontmatter | `next/image` only optimizes `public/` or imported assets; token-palette SVG/gradient placeholders until owner supplies screenshots |

## Phases

**Phase 0 — Foundation** (spec §9.1)
- Read required Next 16 docs (`static-exports`, `generate-static-params`, `metadata-and-og-images`, `mdx`, `image`, `fonts`) before writing code
- Install: `framer-motion`, `gray-matter`, `zod`, `lucide-react`, `next-mdx-remote`, `geist`
- Move `globals.css` → `src/styles/globals.css`; define §5.2 tokens as CSS variables + Tailwind v4 `@theme` (dark only, 8px scale); wire fonts with `font-display: swap`
- Verify: `npm run build` passes with tokens in place

**Phase 1 — Content layer** (§9.2, §7)
- Create `content/` (profile, 2 experience, 8 projects, 3 education) **transcribed from the resume md**, not the summary
- `src/lib/content.ts`: zod-validated loaders (`getProfile`, `getAllProjects`, `getFeaturedProjects`, `getExperience`, `getEducation`); sorting: experience by `start` desc, projects by `featured` then `experience.projectSlugs` order
- Verify: a temp script/throws-on-invalid-frontmatter proves every file parses and validates

**Phase 2 — Atoms → molecules → organisms** (§9.3, §6)
- Build strictly bottom-up: atoms (incl. `StatusDot` CSS-pulse, `GlassPanel` with `@supports` fallback) → molecules → organisms (`Navbar`, `HeroStatusCard`, `BentoGrid`/`WorkCard` with hover-only scale+glow, `ExperienceTimeline`, `StackSection`, `ContactSection`, `Footer`)
- No layer imports upward; organisms receive typed props only
- Verify: lint + typecheck clean; layer-boundary review

**Phase 3 — Home page** (§9.4)
- `PageShell` template; `app/page.tsx` calls loaders, composes sections; single Framer Motion hero sequence (~500ms) honoring `prefers-reduced-motion`; semantic landmarks, one `<h1>`, anchor nav
- Verify: dev-run visual check at 1440 / 768 / 375 widths

**Phase 4 — Project detail pages** (§9.5)
- `/work/[slug]` `generateStaticParams` **only for projects with MDX body**; `notFound()` otherwise; `ProjectDetailTemplate`
- Verify: only body-bearing projects get routes; bento cards link correctly

**Phase 5 — SEO layer** (§9.8)
- `generateMetadata` per route (canonical, OG/Twitter); `app/opengraph-image.tsx` + per-project `opengraph-image.tsx` via `ImageResponse`; JSON-LD `Person` (home) + `CreativeWork`/`SoftwareSourceCode` (detail) from `lib/seo.ts`; `sitemap.ts` + `robots.ts` auto-including work slugs
- Verify: build output lists all metadata routes; no orphan pages

**Phase 6 — A11y / motion / responsive pass** (§9.7, §5.5)
- Contrast audit (esp. `--text-muted` on glass), visible focus states, `prefers-reduced-motion`, bento single-column <640px, mobile timeline
- Verify: keyboard-only navigation + manual contrast checks

**Phase 7 — Lighthouse + scalability proof** (§9.8–9)
- Lighthouse: perf/a11y ≥90, SEO 100, LCP <2.5s, CLS <0.1
- **The scalability test**: add throwaway `content/projects/test-project.mdx` → appears with zero code edits → remove
- Verify: `npm run build` + `npm run lint` clean before and after the test

**Phase 8 — Deploy** (§9.10)
- Vercel deploy; verify OG preview via social debugger + Google Rich Results Test
