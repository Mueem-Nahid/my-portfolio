/**
 * Validates every content file against its zod schema and prints a summary.
 * Run after editing anything in /content:  node scripts/verify-content.ts
 */
import {
  getAllProjects,
  getEducation,
  getExperience,
  getFaq,
  getLabProjects,
  getLabProjectsWithBody,
  getProfile,
  getProjectsWithBody,
  getServices,
  getTestimonials,
} from "../src/lib/content.ts";

const profile = getProfile();
const projects = getAllProjects();
const withBody = getProjectsWithBody();
const experience = getExperience();
const education = getEducation();
const services = getServices();
const labProjects = getLabProjects();
const labWithBody = getLabProjectsWithBody();
const testimonials = getTestimonials();
const faqs = getFaq();

console.log(`profile:    ${profile.name} <${profile.email}>`);
console.log(
  `  currently: ${profile.currentlyLine || "(none)"} | response: ${profile.responseTime || "(none)"} | coursework: ${profile.coursework.length}`,
);
console.log(
  `projects:   ${projects.length} total, ${projects.filter((p) => p.featured).length} featured`,
);
for (const p of projects) {
  console.log(
    `  - ${p.slug} [${p.size}]${p.featured ? " featured" : ""}${p.hasBody ? " +detail-page" : ""}`,
  );
}
console.log(`experience: ${experience.length} roles`);
for (const e of experience) {
  console.log(
    `  - ${e.company} (${e.start} → ${e.end ?? "present"}), projects: ${e.projects.map((p) => p.slug).join(", ")}`,
  );
}
console.log(`education:  ${education.length} entries`);
for (const e of education) {
  console.log(`  - ${e.degree}, ${e.institution} (${e.grade})`);
}
console.log(`detail pages to generate: ${withBody.map((p) => `/work/${p.slug}`).join(", ")}`);
console.log(`services:   ${services.length}`);
for (const s of services) {
  console.log(`  - ${s.slug} (order ${s.order})${s.startingAt ? ` from ${s.startingAt}` : ""}`);
}
console.log(`lab:        ${labProjects.length} total, ${labProjects.filter((p) => p.featured).length} featured`);
for (const p of labProjects) {
  console.log(`  - ${p.slug} [${p.status}]${p.featured ? " featured" : ""}${p.hasBody ? " +detail-page" : ""}`);
}
console.log(`testimonials: ${testimonials.length}${testimonials.length === 0 ? " (section will render null)" : ""}`);
console.log(`faq:        ${faqs.length} entries`);
console.log(`lab detail pages to generate: ${labWithBody.map((p) => `/lab/${p.slug}`).join(", ") || "(none)"}`);
console.log("\nAll content valid.");
