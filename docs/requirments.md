# Mueem Nahid Ibn Mahbub — Portfolio Build Spec

**Audience for this document:** an AI coding agent (Claude Code / OpenCode / Codex) that will scaffold and build this project end-to-end. This is a build spec, not marketing copy — follow it literally. Where a decision is left open, use your judgement but stay inside the constraints given.

**Owner:** Mueem Nahid Ibn Mahbub — Senior Software Engineer, 5 years experience, fullstack (Next.js/TypeScript + Python), currently building production SaaS for Japanese clients at Brand Cloud Inc.

---

## 1. Project summary

A static, content-driven personal portfolio site. All page copy, project details, and experience entries live in **Markdown/MDX files with frontmatter** — never hardcoded in components — so the owner can add a new project or update a bullet point by editing a `.md` file and pushing, with zero code changes.

The site must read as **senior engineer**, not "template freelancer." That means: real numbers over generic phrases, restraint in visual effects, and a design language that comes from the actual subject matter of the work (billing systems, RAG pipelines, live tracking dashboards, admin panels) rather than a generic "developer portfolio" theme.

---

## 2. Tech stack (recommended, not negotiable without reason)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | Static export / ISR for SEO, file-based routing, `next/image`, `next/font` |
| Language | **TypeScript** | Matches the owner's actual stack (tRPC/Prisma background) |
| Styling | **Tailwind CSS v4** | Fast iteration, easy design-token setup via CSS variables |
| Animation | **Framer Motion** (page/section transitions) + **CSS-only** for micro-interactions where possible | Avoid animation-heavy JS bundles; motion should be sparse and intentional (see §5) |
| Content | **MDX + gray-matter / Contentlayer (or `next-mdx-remote`)** | Frontmatter-driven content collections — this is the scalability backbone (§7) |
| Deployment | **Vercel** | Native Next.js support, image optimization, edge caching |
| Icons | **lucide-react** | Consistent, no custom SVG maintenance |
| Fonts | Self-hosted via `next/font` (see §5.2) | Performance + no FOUT/CLS |
| Analytics (optional) | Vercel Analytics or Plausible | Privacy-friendly, no cookie banner needed |

Do not introduce a CMS, database, or auth. This is a static site — the "backend" is the filesystem.

---

## 3. Source content

The owner's resume has already been parsed. Ground every section in this real data — do not invent employers, metrics you can't source, or generic filler bullets.

**Identity:** Mueem Nahid Ibn Mahbub, Software Engineer, Dhaka, Bangladesh (works remote with a Tokyo, Japan client). `mueem51@gmail.com` · `github.com/Mueem-Nahid` · `linkedin.com/in/mueem-nahid`

**Current role:** Software Engineer (Fullstack), Brand Cloud Inc — Jul 2023–present. Four production projects, all for Japanese clients:
- **Suirikyou** — Stripe subscription billing platform for a Japanese sanitation-certification service: recurring payments, webhooks, proration, invoice/receipt PDF generation, retry flows, self-serve customer portal. Also built a high-throughput AWS SES email campaign engine with per-recipient delivery tracking, async via Upstash QStash.
- **Knowledgelinks AI** — RAG system with context-aware responses; handles large documents, audio, and images via queues, Redis, WebSockets.
- **Benrimono** — order delivery platform (user + driver + admin), live order tracking via Google Maps.
- **MoeGuide** — tourist-guide booking platform: hiring, calendar-style scheduling, payments, in-app messaging; owner did code review and mentored juniors.

**Prior role:** Jr. Software Engineer (Fullstack), W3 Engineers Ltd — Nov 2021–Jun 2023. Peer-to-peer car-sharing platform (Whipy), a Django cron scheduler managing 12 sub-projects across EC2, carrier-integration microservices, and a Golang travel API.

**Education:** BSc CSE, East West University (2017–2021, CGPA 3.11); HSC & SSC with GPA 5.00.

**Full data source:** the uploaded resume markdown is the single source of truth for facts. Convert it into the content collections described in §7 — don't re-key entries by hand from this summary; use the resume file directly when scaffolding content.

### Unique angle this portfolio should lean into
Most "senior fullstack developer" portfolios look identical. Three things about this profile are genuinely distinctive — design and copy should surface them, not bury them in a skills list:
1. **He builds the systems most portfolios only claim to know**: real billing/payments infra (Stripe, webhooks, proration), a real RAG pipeline, real live-location tracking. These are dashboard/ops-heavy systems — that's a legitimate design cue (see §5.1).
2. **Cross-border, Japan-facing delivery** — shipping production SaaS remotely for Japanese clients is a specific, credible signal of communication and reliability, not just code skill.
3. **Breadth across the stack in a genuinely unusual way**: Next.js/TypeScript on one project, Python/Django on another, Golang on another, Flutter on another. Most people specialize; he's shipped production code in five ecosystems. Frame this as range, not scatter.

---

## 4. Information architecture

Single-page scroll site with anchor navigation (standard for senior IC portfolios — recruiters scan, they don't click through pages). Sticky, minimal nav.

```
/                     → Home (all sections below, single scroll)
  #hero               → Identity + current focus, one live/status-style element
  #work               → 4 current + notable prior projects (bento grid, §5.1)
  #experience         → Two roles, timeline, expandable bullet detail
  #stack              → Technology/skills, grouped by real usage not alphabetical
  #education
  #contact            → Direct contact, no contact form (email + socials only)

/work/[slug]          → Optional deep-dive page per project (generated from MDX,
                        only built if content file exists — see §7)
```

Keep `/work/[slug]` pages **optional per-project**: if a project's `.mdx` file has enough content (problem/approach/outcome), generate a detail page; if it only has the summary frontmatter, it just renders as a bento card with no link. This means adding depth to one project later never requires touching code.

---

## 5. Visual design direction

This is a deliberate design plan, not a generic "modern portfolio" default. Follow the token system below exactly; do not substitute the common AI-generated defaults (warm cream + terracotta, near-black + single neon accent, generic SaaS rounded-card-with-soft-shadow kit, tracked-out ALL-CAPS eyebrows, em-dash labels, arrow-suffixed buttons). Read `/mnt/skills/public/frontend-design/SKILL.md` if available in your environment before implementing — it governs execution quality bar for this build.

### 5.1 Concept: "Control Room"

The subject matter is systems: billing pipelines, RAG retrieval, live GPS tracking, delivery dashboards. The design should feel like **looking at a well-built internal ops dashboard at 2am** — calm, dark, information-dense but organized, with small live/status details that reward attention. This is not a generic "dark mode developer portfolio"; it's specifically a *dashboard* aesthetic, because dashboards are literally what he ships.

Concretely:
- **Bento grid** for the work section — cards of varying size (2×2 for flagship Suirikyou/Knowledgelinks AI, 1×1 for smaller projects), like a real ops dashboard layout. This is a 2026 trend used with intent here, not decoration.
- **Glassmorphism used sparingly** (the 2026-correct "hybrid" approach): flat, high-contrast dark panels as the primary surface; frosted-glass treatment reserved for *floating* elements only — the sticky nav bar, tooltips, and one hero status card. Do not apply blur/transparency globally or to every card; that reads as templated and hurts mobile performance.
- A single **live status indicator** in the hero (e.g., a small pulsing dot + "Currently building at Brand Cloud Inc, Tokyo-remote" as a system-status line) — this is the one deliberate motion moment for the page load (§5.4), echoing the real-time tracking / delivery-status work he's shipped.

### 5.2 Design tokens

**Color** (define as CSS variables, dark mode only — no light/dark toggle, this is a deliberate choice for the ops-dashboard feel):
- `--bg-base: #0B1220` — deep slate-navy, not pure black
- `--bg-panel: #121B2E` — card/panel surface
- `--bg-glass: rgba(18, 27, 46, 0.55)` with `backdrop-filter: blur(16px)` and `border: 1px solid rgba(255,255,255,0.08)` — only for the nav, hero status card, and tooltips
- `--border-hairline: rgba(255,255,255,0.08)`
- `--text-primary: #E8ECF4`
- `--text-muted: #8B96AB`
- `--accent-signal: #34D399` — "system online" green, used only for live/status indicators (sparingly — this is the functional accent, not decorative)
- `--accent-warm: #F2A65A` — amber, used for the one primary CTA and active/selected states only

Do not use Anthropic's own orange (`#D97757`)-family terracotta or a generic acid-green-on-black combo — both are recognizable AI-portfolio tells.

**Type:**
- Display/headings: a distinctive humanist sans with real personality — e.g. **General Sans** or **Geist** (self-hosted via `next/font/local`). Not Inter as the hero typeface.
- Body: same family, different weight, OR a clean pairing partner — keep to one family with 2–3 weights unless there's a clear reason for a second.
- Data/labels (project stack tags, dates, code snippets): **JetBrains Mono** or **IBM Plex Mono** at small size — this is a functional choice (it's literally how his own tools display data), not decoration.
- No tracked-out ALL-CAPS section eyebrows. Use sentence case throughout, including nav and buttons.

**Layout:**
- Max content width ~1200px, generous side margins, left-aligned body copy (not centered) — dashboard reading pattern, not marketing-page centered hero.
- Line length under 80 characters for body text.
- 8px base spacing scale.

### 5.3 Layout wireframes (ASCII, for structure only)

```
Hero:
+----------------------------------------------------+
| [nav: glass, sticky, minimal links]                 |
|                                                      |
|  Mueem Nahid Ibn Mahbub                              |
|  Senior Fullstack Engineer                           |
|  [● live] Currently building at Brand Cloud Inc       |
|  (glass status card, small, left-aligned)            |
|                                                      |
+----------------------------------------------------+

Work (bento grid):
+-----------------+-----------------+------------------+
|                 |   Benrimono     |    MoeGuide      |
|   Suirikyou     |    (1x1)        |     (1x1)        |
|    (2x2)        +-----------------+------------------+
|                 | Knowledgelinks AI (2x1, wide)       |
+-----------------+--------------------------------------+

Experience: vertical timeline, left rail with years,
right column with role + expandable project bullets.

Stack: horizontal grouped chips by category
(Frontend / Backend / Data & Infra / Tooling),
not one flat alphabetical list.
```

### 5.4 Motion

One orchestrated moment, not scattered effects:
- On page load: hero content and the status card fade/settle in as a single short sequence (~400–600ms), not per-element staggered reveals on every scroll.
- Bento cards: no scroll-triggered fade-up-on-every-card (this is the most common generic-AI tell). Instead, a subtle `transform: scale(1.015)` + border-glow on **hover only** (desktop) — motion that responds to the user, not motion that plays at them.
- Respect `prefers-reduced-motion`: disable all non-essential transitions when set.
- The live-status dot pulse is the only continuous/ambient animation on the page — keep everything else static until interacted with.

### 5.5 Accessibility & quality floor

- WCAG AA contrast minimum on all text against its background (verify `--text-muted` on `--bg-panel` and `--bg-glass` specifically — glass surfaces are the most likely contrast failure point).
- Visible keyboard focus states on all interactive elements (nav links, project cards, CTA).
- `backdrop-filter` has a graceful fallback (solid `--bg-panel` at slightly higher opacity) for browsers/devices that don't support it or where it tanks performance.
- Fully responsive: bento grid collapses to single column under ~640px; timeline stays legible on mobile.

---

## 6. Atomic design structure

Organize all UI code under `src/components/` using strict atomic design layers. No component may import from a layer above it (atoms never import molecules, etc.).

```
src/
  components/
    atoms/
      Button.tsx
      Badge.tsx            // stack/tech tags
      StatusDot.tsx         // the pulsing "live" indicator
      Heading.tsx
      Text.tsx
      Link.tsx
      Icon.tsx
      GlassPanel.tsx        // the one reusable glass-surface wrapper
    molecules/
      NavLink.tsx
      SkillChip.tsx
      TimelineEntry.tsx
      ProjectTag.tsx
      ContactRow.tsx
      SocialIconLink.tsx
    organisms/
      Navbar.tsx
      HeroStatusCard.tsx
      BentoGrid.tsx          // renders WorkCard[] in variable-size grid
      WorkCard.tsx
      ExperienceTimeline.tsx
      StackSection.tsx
      ContactSection.tsx
      Footer.tsx
    templates/
      PageShell.tsx          // nav + footer + max-width container
      ProjectDetailTemplate.tsx  // for /work/[slug]
  app/
    layout.tsx
    page.tsx                 // composes organisms into the home page
    work/[slug]/page.tsx      // uses ProjectDetailTemplate
    sitemap.ts
    robots.ts
  content/                   // see §7
  lib/
    content.ts                // MDX/frontmatter loaders, typed
    seo.ts                    // metadata + JSON-LD generators
  styles/
    globals.css               // CSS variables/tokens from §5.2
```

Rules for the agent:
- **Atoms** hold no business logic and no content-fetching — pure presentational, fully prop-driven.
- **Molecules** compose 2–3 atoms, still presentational.
- **Organisms** are the first layer allowed to receive content data (typed props from `lib/content.ts` loaders) — never fetch/parse markdown themselves.
- **Templates** define page layout structure only, no real content.
- **Pages** (`app/**/page.tsx`) are the only place that calls the content loaders and passes data down.

---

## 7. Content architecture (the scalability backbone)

Everything the owner will want to edit later lives here, as typed frontmatter + MDX body. This is what makes "add a new project" or "update a bullet" a markdown edit, never a code change.

```
content/
  profile.md              // name, title, tagline, status line, socials, resume link
  experience/
    2023-brand-cloud.md
    2021-w3-engineers.md
  projects/
    suirikyou.mdx
    knowledgelinks-ai.mdx
    benrimono.mdx
    moeguide.mdx
    whipy.mdx
    django-cron-scheduler.mdx
    carrier-integration.mdx
    travel-api.mdx
  education/
    east-west-university.md
    adamjee-cantonment-college.md
    baf-shaheen-college.md
```

**Example project frontmatter schema** (`content/projects/suirikyou.mdx`):

```yaml
---
title: "Suirikyou"
summary: "End-to-end Stripe billing platform for a Japanese sanitation certification service."
role: "Fullstack Engineer"
period: "2023 – present"
size: "2x2"          # controls bento grid cell size: 1x1 | 2x1 | 1x2 | 2x2
featured: true
tech: ["Next.js", "TypeScript", "tRPC", "Prisma", "PostgreSQL", "Stripe", "AWS SES", "Upstash QStash", "Docker", "Vercel"]
liveUrl: ""            # optional, leave blank to omit the link
repoUrl: ""            # optional
image: "/images/projects/suirikyou-cover.png"
---

Optional longer MDX body — problem, approach, outcome. If present, this
project gets a generated /work/suirikyou detail page. If omitted, the
project renders as a bento card only.
```

**Example experience frontmatter** (`content/experience/2023-brand-cloud.md`):

```yaml
---
company: "Brand Cloud Inc"
role: "Software Engineer (Fullstack)"
start: "2023-07"
end: null                # null = present
location: "Dhaka (Tokyo, Japan, Remote)"
projectSlugs: ["suirikyou", "knowledgelinks-ai", "benrimono", "moeguide"]
---
```

`lib/content.ts` must export typed functions (`getProfile()`, `getAllProjects()`, `getFeaturedProjects()`, `getExperience()`, `getEducation()`) that parse these files with `gray-matter`, validate frontmatter shape with `zod`, and sort/group as needed (e.g., experience by `start` descending, projects by `featured` then order in `experience.projectSlugs`).

**Adding a new project later = adding one `.mdx` file to `content/projects/` with valid frontmatter. No component, route, or config changes required.** Verify this works by testing exactly that flow before considering the build done.

Images referenced in frontmatter (`content/images/`) should be committed alongside the content files they belong to, and served via `next/image` for automatic optimization.

---

## 8. SEO requirements

This must score well on Lighthouse SEO (target 100) and actually rank/preview correctly, not just pass a checklist.

- **Metadata API**: use Next.js `generateMetadata` in `app/layout.tsx` and `app/work/[slug]/page.tsx` — unique `title`, `description`, `canonical` per route, sourced from `content/profile.md` and each project's `summary`.
- **Open Graph + Twitter Card** images: generate via `next/og` (`ImageResponse`) at `app/opengraph-image.tsx` — dynamic per project detail page using the project title, not one static image reused everywhere.
- **JSON-LD structured data**: emit a `Person` schema (name, jobTitle, url, sameAs: [github, linkedin]) on the homepage, and `CreativeWork`/`SoftwareSourceCode` schema on each project detail page, via `lib/seo.ts` helpers.
- **`sitemap.ts` and `robots.ts`** using Next's built-in file conventions, auto-including every generated `/work/[slug]` route.
- **Semantic HTML**: one `<h1>` (hero name), proper heading hierarchy through sections, `<nav>`, `<main>`, `<section>` landmarks, `alt` text sourced from frontmatter for every project image.
- **Performance as SEO**: target Core Web Vitals — LCP < 2.5s, CLS < 0.1. This directly constrains §5: self-hosted fonts with `font-display: swap`, `next/image` everywhere, no layout shift from the glass/blur effects, no heavy animation library loaded for effects CSS can do alone.
- **Static generation**: prefer full static export (`output: 'export'`) or ISR if using `next/og` dynamic routes — no client-side-only content rendering for anything crawlable.
- No orphan pages: every `/work/[slug]` route must be linked from the homepage bento grid.

---

## 9. Build order (suggested task sequence for the agent)

1. Scaffold Next.js + TypeScript + Tailwind project, set up `globals.css` with the design tokens from §5.2.
2. Set up `content/` structure and `lib/content.ts` loaders with zod validation; migrate the resume data into the frontmatter files described in §7 (use the uploaded resume as source of truth).
3. Build atoms → molecules → organisms in that order (§6), each with the tokens applied, before touching page composition.
4. Compose `app/page.tsx` from organisms; wire up the bento grid to real project data.
5. Build `app/work/[slug]/page.tsx` + `ProjectDetailTemplate`, generated only for projects with MDX body content.
6. Implement SEO layer (§8): metadata, OG images, JSON-LD, sitemap/robots.
7. Accessibility + reduced-motion + responsive pass (§5.5).
8. Lighthouse pass: performance, accessibility, SEO all targeting 90+ (SEO targeting 100).
9. Verify the scalability claim directly: add one throwaway test project as a new `.mdx` file, confirm it appears with zero code edits, then remove it.
10. Deploy to Vercel, verify OG image and JSON-LD render correctly via a social-preview debugger and Google's Rich Results Test.

---

## 10. Explicit non-goals

- No CMS, no database, no auth, no contact form backend (mailto link only).
- No light mode toggle.
- No animation library beyond Framer Motion for the single orchestrated hero sequence — everything else in CSS.
- No stock photography or generic illustration — use real project screenshots (owner to supply) or clean abstract SVG/gradient placeholders sourced from the token palette, never a generic hero illustration.
- No filler "About Me" paragraph with vague adjectives ("passionate," "innovative") — every sentence of copy should be checkable against the resume facts in §3.
