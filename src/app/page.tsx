import { Heading } from "@/components/atoms/Heading";
import { Reveal } from "@/components/atoms/Reveal";
import { Text } from "@/components/atoms/Text";
import { BentoGrid } from "@/components/organisms/BentoGrid";
import { ContactSection } from "@/components/organisms/ContactSection";
import { ExperienceTimeline } from "@/components/organisms/ExperienceTimeline";
import { HeroStatusCard } from "@/components/organisms/HeroStatusCard";
import { StackSection } from "@/components/organisms/StackSection";
import { PageShell } from "@/components/templates/PageShell";
import {
  getAllProjects,
  getEducation,
  getExperience,
  getProfile,
} from "@/lib/content";
import { personJsonLd } from "@/lib/seo";
import { getStackGroups } from "@/lib/stack";

export default function Home() {
  const profile = getProfile();
  const projects = getAllProjects();
  const experience = getExperience();
  const education = getEducation();
  const stackGroups = getStackGroups();

  return (
    <PageShell profile={profile}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd(profile)).replace(/</g, "\\u003c"),
        }}
      />
      <section
        id="hero"
        aria-label="Introduction"
        className="flex flex-col items-start gap-6 pt-20 pb-24 sm:pt-28"
      >
        <Reveal>
          <div className="flex flex-col items-start gap-6">
            <HeroStatusCard
              statusLine={profile.statusLine}
              location={profile.location}
            />
            <div>
              <Heading as="h1" size="xl">
                {profile.name}
              </Heading>
              <Text size="lg" className="mt-2">
                {profile.title}
              </Text>
            </div>
            <Text tone="muted" className="max-w-prose">
              {profile.tagline}
            </Text>
          </div>
        </Reveal>
      </section>

      <section id="work" aria-labelledby="work-heading" className="scroll-mt-20 pb-24">
        <Heading as="h2" size="lg" id="work-heading" className="mb-3">
          Work
        </Heading>
        <Text tone="muted" className="mb-8 max-w-prose">
          Production systems shipped for Japanese clients at Brand Cloud Inc,
          plus earlier work at W3 Engineers.
        </Text>
        <BentoGrid projects={projects} />
      </section>

      <section
        id="experience"
        aria-labelledby="experience-heading"
        className="scroll-mt-20 pb-24"
      >
        <Heading as="h2" size="lg" id="experience-heading" className="mb-8">
          Experience
        </Heading>
        <ExperienceTimeline entries={experience} />
      </section>

      <section id="stack" aria-labelledby="stack-heading" className="scroll-mt-20 pb-24">
        <Heading as="h2" size="lg" id="stack-heading" className="mb-3">
          Stack
        </Heading>
        <Text tone="muted" className="mb-8 max-w-prose">
          Grouped by how they&apos;re used across the projects above — five
          ecosystems, all in production.
        </Text>
        <StackSection groups={stackGroups} />
      </section>

      <section
        id="education"
        aria-labelledby="education-heading"
        className="scroll-mt-20 pb-24"
      >
        <Heading as="h2" size="lg" id="education-heading" className="mb-8">
          Education
        </Heading>
        <ul className="space-y-4">
          {education.map((entry) => (
            <li
              key={entry.institution}
              className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 rounded-lg border border-line bg-panel px-5 py-4"
            >
              <div>
                <Heading as="h3" size="sm">
                  {entry.degree}
                </Heading>
                <Text tone="muted" size="sm">
                  {entry.institution} · {entry.location}
                </Text>
              </div>
              <Text as="span" mono tone="muted" className="shrink-0 text-xs">
                {entry.start} – {entry.end} · {entry.grade}
              </Text>
            </li>
          ))}
        </ul>
      </section>

      <section
        id="contact"
        aria-labelledby="contact-heading"
        className="scroll-mt-20 pb-24"
      >
        <Heading as="h2" size="lg" id="contact-heading" className="mb-8">
          Contact
        </Heading>
        <ContactSection profile={profile} />
      </section>
    </PageShell>
  );
}
