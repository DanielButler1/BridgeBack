# BridgeBack

**The shortest path back into the next lesson.**

BridgeBack is an OpenAI Build Week Education-track project for pupils returning to school after absence. Instead of assigning every missed resource, it identifies the minimum prerequisite concepts a pupil needs to participate in the upcoming lesson.

The current proof of concept follows Mia, a fictional Year 10 pupil returning after four weeks away, as her class begins GCSE Computer Science binary search.

## What works today

- Connected teacher and pupil views
- Editable, source-labelled prerequisite graph rendered with React Flow
- Four-question interactive readiness diagnostic
- A three-step catch-up pathway limited to 17 minutes
- A complete first micro-lesson on iteration
- Seeded data throughout, so the judging experience is reliable without credentials
- Build-safe OpenAI client and model-routing boundaries for the live generation phase

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

BridgeBack defaults to seeded demo mode. When live lesson analysis is implemented, copy `.env.example` to `.env.local` and add `OPENAI_API_KEY`.

## Stack

- Next.js 16 App Router and React 19
- TypeScript and Tailwind CSS 4
- shadcn/ui using preset `b1s9c8K70` (`base-nova`)
- React Flow for concept dependencies
- Zod for educational domain schemas
- OpenAI JavaScript SDK with lazy, build-safe initialization

## Planned GPT-5.6 routing

| Job | Model | Reason |
| --- | --- | --- |
| Lesson dependency graph | `gpt-5.6-sol` | Quality-first curriculum reasoning |
| Catch-up pathway | `gpt-5.6-terra` | Balanced instructional generation |
| Pupil feedback | `gpt-5.6-luna` | Efficient, responsive interaction |

Teacher review remains mandatory before any generated dependency map is assigned to pupils.

## Product principles

1. Prepare for what comes next; do not recreate every missed lesson.
2. Never show a pupil more than three next steps.
3. Treat diagnostic results as readiness signals, not grades or definitive mastery claims.
4. Keep teachers in control of prerequisite relationships and source material.
5. Use synthetic pupil data in the proof of concept.

## Codex collaboration

The repository was created during OpenAI Build Week with Codex. Codex helped translate the research-backed product hypothesis into a deliberately scoped vertical slice, applied the supplied shadcn preset, created the domain schemas, implemented the two-sided experience, and established build-safe model boundaries. Product decisions—including the next-lesson framing, teacher approval step, three-item limit, synthetic pupil scenario and job-specific model routing—were made explicitly during the Codex task.
