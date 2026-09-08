import { getAllProjects } from "@/lib/content";

/**
 * Stack section data (§4): derived from the union of every project's `tech`
 * list — i.e. grouped by real usage, never an alphabetized wall of chips.
 * Adding tech to a project frontmatter flows here automatically; unknown
 * names land in the last group so nothing is silently dropped.
 */

export type StackGroup = {
  name: string;
  items: string[];
};

const GROUPS = [
  "Languages",
  "Frontend",
  "Backend & services",
  "Data & infrastructure",
] as const;

type GroupName = (typeof GROUPS)[number];

const CATEGORY: Record<string, GroupName> = {
  // Languages
  TypeScript: "Languages",
  Python: "Languages",
  Golang: "Languages",
  // Frontend
  "Next.js": "Frontend",
  React: "Frontend",
  Flutter: "Frontend",
  "Tailwind CSS": "Frontend",
  "Chakra UI": "Frontend",
  "Redux Toolkit": "Frontend",
  Axios: "Frontend",
  // Backend & services
  "Node.js": "Backend & services",
  "Express.js": "Backend & services",
  Django: "Backend & services",
  "Django ORM": "Backend & services",
  Flask: "Backend & services",
  Beego: "Backend & services",
  tRPC: "Backend & services",
  NextAuth: "Backend & services",
  Stripe: "Backend & services",
  LangChain: "Backend & services",
  OpenAI: "Backend & services",
  Pusher: "Backend & services",
  WebSocket: "Backend & services",
  "Google Maps": "Backend & services",
  "AWS SES": "Backend & services",
  "Upstash QStash": "Backend & services",
  // Data & infrastructure
  PostgreSQL: "Data & infrastructure",
  MongoDB: "Data & infrastructure",
  Firebase: "Data & infrastructure",
  Firestore: "Data & infrastructure",
  Prisma: "Data & infrastructure",
  GORM: "Data & infrastructure",
  Redis: "Data & infrastructure",
  ChromaDB: "Data & infrastructure",
  Elasticsearch: "Data & infrastructure",
  OpenSearch: "Data & infrastructure",
  Pandas: "Data & infrastructure",
  AWS: "Data & infrastructure",
  Docker: "Data & infrastructure",
  Vercel: "Data & infrastructure",
};

export function getStackGroups(): StackGroup[] {
  const seen = new Map<string, GroupName>();
  for (const project of getAllProjects()) {
    for (const tech of project.tech) {
      if (!seen.has(tech)) {
        seen.set(tech, CATEGORY[tech] ?? "Data & infrastructure");
      }
    }
  }

  return GROUPS.map((name) => ({
    name,
    items: [...seen.entries()]
      .filter(([, group]) => group === name)
      .map(([tech]) => tech),
  })).filter((group) => group.items.length > 0);
}
