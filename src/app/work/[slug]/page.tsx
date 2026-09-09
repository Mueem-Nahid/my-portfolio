import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Heading } from "@/components/atoms/Heading";
import { Link } from "@/components/atoms/Link";
import { Text } from "@/components/atoms/Text";
import { ProjectDetailTemplate } from "@/components/templates/ProjectDetailTemplate";
import { PageShell } from "@/components/templates/PageShell";
import { getProfile, getProjectBySlug, getProjectsWithBody } from "@/lib/content";
import { projectJsonLd } from "@/lib/seo";

/**
 * Detail pages exist only for projects whose .mdx file has a body (§4, §7).
 * Frontmatter-only projects render as bento cards with no link and 404 here.
 */
export function generateStaticParams() {
  return getProjectsWithBody().map((project) => ({ slug: project.slug }));
}

/** Unlisted slugs 404 instead of being generated on demand. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || !project.hasBody) return {};

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: `/work/${project.slug}`,
    },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.summary,
      url: `/work/${project.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
    },
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || !project.hasBody) notFound();

  const profile = getProfile();

  return (
    <PageShell profile={profile}>
      <ProjectDetailTemplate project={project}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(projectJsonLd(project)).replace(/</g, "\\u003c"),
          }}
        />
        <MDXRemote
          source={project.body}
          components={{
            h2: (props) => (
              <Heading as="h2" size="md" className="mt-10" {...props} />
            ),
            p: (props) => <Text tone="muted" className="mt-4" {...props} />,
            ul: (props) => (
              <ul
                className="mt-4 list-disc space-y-2 pl-5 text-muted"
                {...props}
              />
            ),
            li: (props) => <li className="text-sm leading-6" {...props} />,
            a: (props) => <Link href={props.href ?? "#"} {...props} />,
          }}
        />
      </ProjectDetailTemplate>
    </PageShell>
  );
}
