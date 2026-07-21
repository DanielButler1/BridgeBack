# BridgeBack

**The shortest path back into the next lesson.**

BridgeBack is an OpenAI Build Week Education-track project for pupils returning to school after absence. Instead of assigning every missed resource, it identifies the minimum prerequisite concepts a pupil needs to participate in the upcoming lesson.

**Live Build Week deployment:** [bridgeback.phaseo.app](https://bridgeback.phaseo.app)

**Public demo video:** [BridgeBack: Building a Better Way Back After Absence](https://youtu.be/3roIWobSEm4) (2:56)

> [!IMPORTANT]
> BridgeBack is a functional, production-deployed Build Week product demonstrated with synthetic data. Its end-to-end teacher and pupil workflows are live, but it is not yet approved for identifiable pupil or school data. See [Production readiness](docs/PRODUCTION-READINESS.md) for the implemented foundations and the release gates for a supervised real-school pilot.

BridgeBack is best understood as a **curriculum re-entry engine**. Most catch-up tools begin with the backlog. BridgeBack begins with the destination, the lesson happening next, then works backwards through a source-grounded, teacher-reviewed dependency graph. The innovation is deliberate subtraction: irrelevant missed work stays out, while the teacher controls what is allowed into the pupil's route.

The guided demo follows Mia, a fictional Year 10 pupil returning after four weeks away, as her class begins GCSE Computer Science binary search. The protected school workspace supports creating a real class and upcoming lesson separately from that judge journey.

## What works today

- Separate teacher and pupil routes with role checks at the server and data layers
- Build-safe Clerk sessions with one-click, signed HTTP-only synthetic judge sessions
- A full Convex schema for users, classes, lessons, resources, concept graphs, diagnostics, responses, pathways and AI runs
- Authorized Convex file uploads, graph approval and persisted diagnostic answers
- Deterministic scoring and prerequisite traversal capped at three concepts
- Editable, source-labelled prerequisite graph rendered with React Flow
- GPT-5.6 Terra diagnostics generated from the teacher-approved graph
- A deterministic learning path capped at three concepts including the upcoming target
- GPT-5.6 Luna micro-lessons with explanations, worked examples, closed checks and exact source references
- Credential-free local demo mode using the same product screens
- GPT-5.6 Sol file-aware lesson analysis with Zod Structured Outputs, editable draft persistence and teacher approval
- Optional, pupil-triggered GPT Image 2 concept illustrations for the first two unlocked learning activities; the demo returns a representative sample visual
- A responsive concept map that becomes an ordered prerequisite list on small screens
- A protected school workspace for class creation, lesson setup, resource upload, analysis and teacher approval
- A second interactive GCSE Mathematics example showing simultaneous-equation prerequisites and a two-activity route
- Safety identifiers, `store: false`, prompt-injection boundaries and AI run telemetry
- Unit tests, desktop and iPhone browser journeys, automated WCAG checks and GitHub Actions CI
- A reproducible two-minute Remotion submission film with an OpenAI `gpt-4o-mini-tts` narration generator
- A five-minute, lesson-grounded “Talk it through” voice mode using `gpt-realtime-2.1` over WebRTC

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

BridgeBack defaults to a credential-free local demo. Copy `.env.example` to `.env.local` to connect the services.

## Connect Clerk and Convex

1. Create two synthetic Clerk users: **Ms Morgan** and **Mia**. Do not use real pupil details.
2. Create a Clerk JWT template named `convex`, then copy its issuer domain into `CLERK_JWT_ISSUER_DOMAIN`.
3. Run `npx convex dev` and keep it running. This provisions `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL`.
4. Add the Clerk publishable/secret keys and both synthetic Clerk user IDs to `.env.local`.
5. Set `DEMO_AUTH_ENABLED=true` only for the judging deployment.
6. Seed the database once:

```bash
npx convex run seed:seedDemo '{"teacherSubject":"user_teacher_id","pupilSubject":"user_pupil_id"}'
```

The public judge buttons map only to those two fixed IDs. The server creates a Clerk session and stores only its opaque ID inside a signed, HTTP-only, same-site cookie that expires after four hours. Disable `DEMO_AUTH_ENABLED` outside the demo.

Add `OPENAI_API_KEY` to the Convex deployment environment before running live lesson analysis:

```bash
npx convex env set OPENAI_API_KEY
```

## Stack

- Next.js 16 App Router and React 19
- TypeScript and Tailwind CSS 4
- shadcn/ui using preset `b1s9c8K70` (`base-nova`)
- React Flow for concept dependencies
- Zod for educational domain schemas
- Clerk for authentication and Convex for database, storage and server actions
- OpenAI JavaScript SDK and the Responses API
- Playwright and axe-core for browser and accessibility checks

## GPT-5.6 routing

| Job | Model | Reason |
| --- | --- | --- |
| Lesson dependency graph | `gpt-5.6-sol` | Implemented with Structured Outputs |
| Approved diagnostic | `gpt-5.6-terra` | Balanced structured educational generation |
| Pupil micro-lessons | `gpt-5.6-luna` | Efficient, responsive instructional generation |
| Optional concept illustration | `gpt-image-2` | High-quality visual support, limited to two unlocked activities |

Teacher review remains mandatory before any generated dependency map is assigned to pupils.

## Verify locally

```bash
npm run verify
npx playwright install chromium
npm run test:e2e
```

Browser tests cover the public pages, both demo roles, refresh persistence, desktop Chromium, iPhone-sized Chromium, and serious/critical WCAG violations.

## Product principles

1. Prepare for what comes next; do not recreate every missed lesson.
2. Never show a pupil more than three next steps.
3. Treat diagnostic results as readiness signals, not grades or definitive mastery claims.
4. Keep teachers in control of prerequisite relationships and source material.
5. Use synthetic pupil data in the proof of concept.
6. Never infer emotion, disability, absence reasons, behaviour or risk.
7. Never use BridgeBack for grades, placement, discipline or attendance consequences.

## Safety and privacy decisions

Curriculum mappings are versioned and source-linked. See [Curriculum packs and versioning](docs/CURRICULUM-PACKS.md) for coverage, review rules and the copyright boundary.

The rationale for BridgeBack's synthetic-data boundary, child-protection principles, data flow, OpenAI retention choices, teacher oversight, prohibited uses, and real-school release blockers is documented in [Safety, privacy, and product decisions](docs/SAFETY-PRIVACY-DECISIONS.md).

## Public release

- [Production readiness](docs/PRODUCTION-READINESS.md)
- [Build Week submission draft](docs/SUBMISSION-DRAFT.md)
- [Vercel deployment runbook](docs/DEPLOYMENT.md)
- [School integration pilot](docs/SCHOOL-INTEGRATION-PILOT.md)
- [Impact measurement plan](docs/IMPACT-MEASUREMENT.md)
- [AI evaluation plan](docs/AI-EVALUATION.md)
- [AI-simulated teacher walkthrough](docs/SIMULATED-TEACHER-REVIEW.md)
- [Security architecture](docs/SECURITY-ARCHITECTURE.md)
- [Submission film project](video/README.md)

Licensed under the [Apache License 2.0](LICENSE).

## How Codex accelerated the build

BridgeBack was created during OpenAI Build Week through an extended collaboration with Codex. The commit history and primary Codex session document work completed during the submission period.

### Where Codex accelerated the workflow

- Turned the research-backed problem statement into a working vertical slice across the teacher and pupil journeys.
- Scaffolded the Next.js interface with the supplied shadcn preset and iterated on responsive, accessible layouts through browser review.
- Designed and implemented the Convex schema, Clerk-backed authentication, synthetic judge sessions, role checks, uploads and persisted pupil progress.
- Integrated the OpenAI Responses, Images and Realtime APIs with structured output validation, source boundaries and job-specific model routing.
- Built the Computer Science and Mathematics journeys, React Flow prerequisite map, diagnostics, micro-lessons, visual explanations and five-minute voice mode.
- Added Vitest, Playwright, axe-core and production smoke coverage, then used failures to correct real entry-flow and image-latency assumptions.
- Helped prepare the public deployment, safety documentation, submission draft, recording runbook and repository release materials.

### Decisions made by the entrant

Codex accelerated implementation and review, while the entrant retained the product and engineering decisions. The most important choices were to:

- work backwards from the upcoming lesson rather than recreate every missed lesson;
- cap the immediate route at three concepts so returning pupils are not shown an overwhelming backlog;
- require teacher review before an AI-generated prerequisite map can reach a pupil;
- keep grading and pathway selection deterministic rather than delegate them to a model;
- use fictional pupil data and exclude absence reasons, medical context and safeguarding records;
- offer text, optional visual and optional spoken support without making any modality the source of truth; and
- present BridgeBack as a functional production deployment with explicit gates before identifiable pupil data can be accepted.

### How GPT-5.6 contributes

GPT-5.6 is part of the core product loop, not a decorative chat layer. Sol turns teacher-supplied lesson files into a source-labelled prerequisite graph. After teacher approval, Terra produces the closed diagnostic. Luna creates focused, source-grounded learning activities for the deterministic pathway. Application code validates model output with Zod, preserves source references, records AI-run telemetry and keeps authorization, approval, scoring and pathway traversal outside the model.

### How the collaboration was verified

Codex repeatedly exercised the live product through the browser, including the teacher workspace, pupil diagnostic, refresh persistence, Mathematics journey, GPT Image 2 generation and responsive layouts. The final production pass also ran TypeScript, ESLint, 21 unit tests, desktop and iPhone-sized Playwright journeys, and automated serious and critical WCAG checks.
