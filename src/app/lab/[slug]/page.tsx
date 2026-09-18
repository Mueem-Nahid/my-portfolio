import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Heading } from "@/components/atoms/Heading";
import { Link } from "@/components/atoms/Link";
import { Text } from "@/components/atoms/Text";
import { StatusPill } from "@/components/atoms/StatusPill";
import { DetailTemplate } from "@/components/templates/DetailTemplate";
import { PageShell } from "@/components/templates/PageShell";
import { getLabProjectBySlug, getLabProjectsWithBody, getProfile } from "@/lib/content";
import { labProjectJsonLd } from "@/lib/seo";

/**
 * Detail pages exist only for lab projects whose .mdx file has a body —
 * same optional-detail-page pattern as /work/[slug].
 */
export function generateStaticParams() {
  return getLabProjectsWithBody().map((project) => ({ slug: project.slug }));
}

/** Unlisted slugs 404 instead of being generated on demand. */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getLabProjectBySlug(slug);

  if (!project || !project.hasBody) return {};

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: `/lab/${project.slug}`,
    },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.summary,
      url: `/lab/${project.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
    },
  };
}

export default async function LabProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getLabProjectBySlug(slug);

  if (!project || !project.hasBody) notFound();

  const profile = getProfile();

  return (
    <PageShell profile={profile}>
      <DetailTemplate
        title={project.title}
        metaLine={`${project.status} / ${project.tech.slice(0, 4).join(" · ")}${project.lastUpdated ? ` / ${project.lastUpdated}` : ""}`}
        summary={project.summary}
        tech={project.tech}
        liveHref={project.demoUrl || undefined}
        liveLabel="Live demo"
        sourceHref={project.repoUrl || undefined}
        backHref="/#lab"
        backLabel="All lab projects"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(labProjectJsonLd(project)).replace(/</g, "\\u003c"),
          }}
        />
        <div className="mb-6">
          <StatusPill status={project.status} />
        </div>
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
      </DetailTemplate>
    </PageShell>
  );
}
