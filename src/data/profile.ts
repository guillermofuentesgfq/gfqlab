// Single source of truth for the CV-derived content on /about.
//
// This data is long-form prose with dates and links, so it lives here as
// structured data instead of being hardcoded in the .astro template. Two
// reasons: the page stays readable as markup, and updating the CV means
// editing one file instead of hunting through a template.
//
// Source of truth is the CV LaTeX in the separate `CV` repository (cv/summary,
// cv/experience, cv/skills, cv/education, cv/certificates). When the CV
// changes, change it here too — nothing syncs them automatically.

export interface Role {
  title: string;
  company: string;
  location: string;
  /** Display string, not parsed: "Sep 2025 – Present" and ranges like
   *  "May 2024 – Aug 2025" cannot be ordered reliably from a single date. */
  period: string;
  highlights: string[];
}

export const EXPERIENCE: Role[] = [
  {
    title: 'Head of Engineering',
    company: 'Buk',
    location: 'Chile · remote from Spain',
    period: 'Sep 2025 – Present',
    highlights: [
      'Lead a 9-team organization — 60 engineers, direct and indirect reports — at Buk, an HR technology company providing HCM, LMS, attendance control and payroll to millions of users across Chile, Colombia, Perú, México and Brazil.',
      'Own platform engineering, CI/CD and Ruby on Rails development, including two product-close teams: Activation (platform onboarding) and Starter (free tier, expanding to further countries).',
      'Founded the DevEx-AI team and built an agent orchestrator for automated code review, feature flag cleanup and Sentry error resolution, cutting an estimated 40% of manual toil.',
      'Leading the observability transformation with OpenTelemetry and Tsuga, replacing legacy monitoring with unified distributed tracing and taking MTTR from hours to minutes.',
      'Define technical strategy, OKRs and roadmaps with Product and Design; manage Engineering Managers through weekly 1:1s and OKR reviews, and own career progression and compensation across the whole organization.',
    ],
  },
  {
    title: 'Engineering Manager',
    company: 'Buk',
    location: 'Chile · remote from Spain',
    period: 'May 2024 – Aug 2025',
    highlights: [
      'Managed 6 engineers on the infrastructure and core features of a Learning Management System serving 2M+ active users.',
      'Cut infrastructure costs 30% through Horizontal Pod Autoscaling, right-sizing, and a strategic AWS region migration from Chile to the US — while holding performance SLAs.',
      'Reworked the deployment process around ephemeral PR-based environments and automated CI/CD, taking the feedback cycle from days to minutes.',
      'Adopted a Platform as a Product approach: internal tooling treated as a product with SLIs, user research, stakeholder demos and iterative improvement.',
      'Led the hiring and onboarding of 8 engineers across teams, with structured onboarding programs that cut ramp-up time by 30%.',
    ],
  },
  {
    title: 'Staff Software Engineer',
    company: 'Buk',
    location: 'Chile · remote from Spain',
    period: 'Sep 2021 – Mar 2024',
    highlights: [
      'Led technical design and end-to-end delivery for an LMS used by 500+ organizations, on Symfony and React, under a 99.9% uptime requirement.',
      'Implemented RabbitMQ-metric-driven Horizontal Pod Autoscaling, cutting average CPU waste by 25% and preventing recurring production incidents.',
      'Mentored 4 junior and mid-level engineers through pair programming, code review and individual development plans, and reduced technical debt by 20% via systematic upgrades and static analysis in CI.',
      'Drove the migration from a monolithic Symfony application to a service-oriented architecture, establishing API contracts and inter-service communication patterns that let teams work in parallel.',
    ],
  },
  {
    title: 'Freelance Software Engineer',
    company: 'Freelance',
    location: 'Chile',
    period: '2015 – 2020',
    highlights: [
      'Delivered custom web applications across e-commerce, logistics and education, owning the full project lifecycle from requirements gathering through deployment and maintenance.',
      'Built long-term client relationships on clear communication and reliable delivery, with a 90%+ repeat engagement rate.',
    ],
  },
];

export interface SkillGroup {
  label: string;
  items: string[];
}

export const SKILLS: SkillGroup[] = [
  {
    label: 'Leadership',
    items: [
      'Engineering Management',
      'Technical Strategy',
      'Organizational Design',
      'OKR Planning',
      'Hiring & Scaling Teams',
      'Mentoring & Coaching',
      'Platform as a Product',
      'Product Transformation',
      'Budget Planning',
    ],
  },
  {
    label: 'DevOps & Platform',
    items: [
      'AWS (EC2, EKS, ECS, Aurora & RDS, S3, ElastiCache)',
      'Kubernetes',
      'Docker',
      'Terraform',
      'CI/CD (GitLab CI, GitHub Actions)',
      'Observability (OpenTelemetry, Grafana, Prometheus, Datadog, Tsuga)',
      'Horizontal Pod Autoscaling',
      'Cloud Cost Optimization',
    ],
  },
  {
    label: 'AI & DevEx',
    items: [
      'AI Agent Orchestration',
      'AI-Enabled Development',
      'AI Product Infrastructure',
      'LLM Integration',
      'Developer Experience',
      'Internal Developer Platforms',
      'Developer Portals',
    ],
  },
  {
    label: 'Programming',
    items: [
      'Ruby on Rails',
      'PHP',
      'Symfony',
      'Laravel',
      'Java',
      'Spring Boot',
      'Python',
      'JavaScript',
      'TypeScript',
      'React',
      'SQL',
    ],
  },
  {
    label: 'Architecture & Practice',
    items: [
      'System Design',
      'Distributed Systems',
      'Microservices',
      'Event-Driven Architecture',
      'Domain-Driven Design',
      'Enterprise Architecture (ArchiMate, TOGAF)',
      'BizDevOps',
      'Agile / Scrum',
    ],
  },
  {
    label: 'Languages',
    items: ['Spanish (native)', 'English (B2 — upper intermediate)'],
  },
];

export interface Education {
  degree: string;
  school: string;
  period: string;
  detail: string;
}

export const EDUCATION: Education[] = [
  {
    degree: 'Doctor in Advanced Computing Technologies',
    school: 'University of Castilla-La Mancha, Spain',
    period: 'Dec 2020 – Feb 2025',
    detail:
      'Specialization in BizDevOps and Enterprise Architecture. Thesis on aligning software development approaches with enterprise architecture frameworks to improve IT/business alignment in DevOps-driven organizations.',
  },
  {
    degree: 'Master in Computer Science',
    school: 'University of Bío-Bío, Chile',
    period: 'Mar 2015 – Sep 2017',
    detail:
      'Specialization in Data Quality and Enterprise Architecture, focused on data quality assessment methodologies in enterprise environments.',
  },
  {
    degree: 'Bachelor of Computer Science',
    school: 'University of Bío-Bío, Chile',
    period: 'Mar 2011 – Jan 2016',
    detail: 'Specialization in BPMN models and business process modeling.',
  },
];

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  href: string;
}

export const CERTIFICATIONS: Certification[] = [
  {
    name: 'AWS Knowledge: Amazon ECS',
    issuer: 'Amazon Web Services',
    year: '2026',
    href: 'https://www.credly.com/earner/earned/badge/dec6ad86-3e48-447e-a5d8-d3e67ab08543',
  },
  {
    name: 'AWS Cloud Quest: Generative AI Practitioner',
    issuer: 'Amazon Web Services',
    year: '2025',
    href: 'https://www.credly.com/earner/earned/badge/df79e0d1-6201-41f1-8b4f-d618a49c0937',
  },
  {
    name: 'AWS Educate: Introduction to Generative AI',
    issuer: 'Amazon Web Services',
    year: '2025',
    href: 'https://www.credly.com/earner/earned/badge/11a4cad5-611b-4a7e-bad5-6eb6d6b322d0',
  },
  {
    name: 'AWS Cloud Quest: Cloud Practitioner',
    issuer: 'Amazon Web Services',
    year: '2025',
    href: 'https://www.credly.com/earner/earned/badge/01117c39-ca32-4261-969d-f1aa0ceabc12',
  },
  {
    name: 'Agile Explorer',
    issuer: 'IBM',
    year: '2025',
    href: 'https://www.credly.com/earner/earned/badge/2cf30277-ac85-40f1-a6ef-91ba7bd77ea6',
  },
  {
    name: 'Lifelong Learning 2026',
    issuer: 'Certiprof',
    year: '2025',
    href: 'https://www.credly.com/earner/earned/badge/430acabd-4019-413e-aebe-2d736c830f6d',
  },
];