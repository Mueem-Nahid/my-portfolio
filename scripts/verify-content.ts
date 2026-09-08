/**
 * Validates every content file against its zod schema and prints a summary.
 * Run after editing anything in /content:  node scripts/verify-content.ts
 */
import {
  getAllProjects,
  getEducation,
  getExperience,
  getProfile,
  getProjectsWithBody,
} from "../src/lib/content.ts";

const profile = getProfile();
const projects = getAllProjects();
const withBody = getProjectsWithBody();
const experience = getExperience();
const education = getEducation();

console.log(`profile:    ${profile.name} <${profile.email}>`);
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
console.log("\nAll content valid.");
