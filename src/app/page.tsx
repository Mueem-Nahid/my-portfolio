import { Heading } from "@/components/atoms/Heading";
import { Link } from "@/components/atoms/Link";
import { Reveal } from "@/components/atoms/Reveal";
import { Text } from "@/components/atoms/Text";
import { BentoGrid } from "@/components/organisms/BentoGrid";
import { ContactSection } from "@/components/organisms/ContactSection";
import { ExperienceTimeline } from "@/components/organisms/ExperienceTimeline";
import { FAQSection } from "@/components/organisms/FAQSection";
import { HeroStatusCard } from "@/components/organisms/HeroStatusCard";
import { LabSection } from "@/components/organisms/LabSection";
import { ServicesGrid } from "@/components/organisms/ServicesGrid";
import { StackSection } from "@/components/organisms/StackSection";
import { TestimonialsBlock } from "@/components/organisms/TestimonialsSection";
import { PageShell } from "@/components/templates/PageShell";
import {
  getAllProjects,
  getEducation,
  getExperience,
  getFaq,
  getLabProjects,
  getProfile,
  getServices,
  getTestimonials,
} from "@/lib/content";
import { personJsonLd, serviceJsonLd } from "@/lib/seo";
import { getStackGroups } from "@/lib/stack";

export default function Home() {
  const profile = getProfile();
  const projects = getAllProjects();
  const experience = getExperience();
  const education = getEducation();
  const stackGroups = getStackGroups();
  const services = getServices();
  const labProjects = getLabProjects();
  const faqs = getFaq();
  const testimonials = getTestimonials();

  return (
    <PageShell profile={profile}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd(profile)).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceJsonLd(services)).replace(/</g, "\\u003c"),
        }}
      />
      <section
        id="hero"
        aria-label="Introduction"
        className="flex flex-col items-start gap-6 pt-14 pb-16 sm:pt-28 sm:pb-24"
      >
        <Reveal>
          <div className="flex flex-col items-start gap-6">
            <HeroStatusCard
              statusLine={profile.statusLine}
              location={profile.location}
              currentlyLine={profile.currentlyLine}
              responseTime={profile.responseTime}
            />
            <div>
              <Heading as="h1" size="xl">
                {profile.name}
              </Heading>
              <Text size="lg" className="mt-2">
                {profile.title}
              </Text>
              <Text size="sm" tone="muted" className="mt-1">
                Senior Fullstack Engineer · building toward AI/ML engineering
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

      <section id="lab" aria-labelledby="lab-heading" className="scroll-mt-20 pb-24">
        <Heading as="h2" size="lg" id="lab-heading" className="mb-3">
          Lab
        </Heading>
        <LabSection projects={labProjects} coursework={profile.coursework} />
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

      <section id="services" aria-labelledby="services-heading" className="scroll-mt-20 pb-24">
        <Heading as="h2" size="lg" id="services-heading" className="mb-3">
          Services
        </Heading>
        <Text tone="muted" className="mb-8 max-w-prose">
          What you can hire me for — scoped, quoted in writing, shipped to production.
        </Text>
        <ServicesGrid services={services} email={profile.email} />
      </section>

      {faqs.length > 0 ? (
        <section id="faq" aria-labelledby="faq-heading" className="scroll-mt-20 pb-24">
          <Heading as="h2" size="lg" id="faq-heading" className="mb-3">
            FAQ
          </Heading>
          <Text tone="muted" className="mb-8 max-w-prose">
            Hiring questions, answered directly.
          </Text>
          <FAQSection faqs={faqs} />
        </section>
      ) : null}

      <TestimonialsBlock testimonials={testimonials} />

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
                  {entry.url ? (
                    <Link href={entry.url}>{entry.institution}</Link>
                  ) : (
                    entry.institution
                  )}{" "}
                  · {entry.location}
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
