# OpenAI Build Week submission draft

This is working copy for the Devpost draft. It is not a submitted entry. Replace every item marked **TODO** and complete the release checklist before submission.

## Project

**Name:** BridgeBack

**Tagline:** The shortest path back into the next lesson.

**Track:** Education

**Live demo:** https://bridgeback.phaseo.app

**Repository:** https://github.com/DanielButler1/BridgeBack (public, Apache-2.0)

**Public demo video:** https://youtu.be/3roIWobSEm4 (2:56)

## Inspiration

Returning to school after an absence can turn learning into a wall of missed work. In England's state-funded schools, 18.7% of pupils were persistently absent in 2024/25; persistent absence means missing at least 10% of possible sessions. The rate was 24.3% in secondary schools and 35.8% in special schools. NFER's qualitative study with 85 pupils across nine secondary schools found that catching up was one of pupils' biggest concerns and that pupils valued teachers explaining what they had missed.

BridgeBack begins with a different question: not “What work did this pupil miss?” but “What is the minimum they need to understand to take part in the next lesson?”

## What it does

BridgeBack is a curriculum re-entry engine. A teacher supplies the upcoming lesson and relevant source materials. GPT-5.6 proposes a source-labelled prerequisite map, which the teacher reviews before it can reach a pupil. A short diagnostic checks only those prerequisites. BridgeBack then selects no more than three focused activities, preserving progress across refreshes and keeping the pupil's next action clear.

The guided journey follows Mia, a fictional Year 10 pupil returning before a binary-search lesson. A second mathematics example applies the same method to simultaneous equations. Optional image generation and a five-minute Realtime voice conversation give pupils visual and spoken ways to work through an unlocked concept.

## How we built it

- Next.js 16, React 19, TypeScript, Tailwind CSS and shadcn/ui
- Clerk authentication with fixed synthetic judge accounts
- Convex for the production database, storage, role checks and persisted progress
- GPT-5.6 Sol for lesson dependency analysis, Terra for diagnostics, and Luna for pupil-sized learning support
- Structured Outputs with Zod, source references, prompt-injection boundaries, `store: false`, and teacher approval gates
- GPT Image 2 for optional concept illustrations
- `gpt-realtime-2.1` over WebRTC for lesson-grounded “Talk it through” sessions
- Playwright, Vitest and axe-core for unit, end-to-end, mobile and accessibility checks

## What makes it different

Most catch-up workflows begin with the backlog. BridgeBack begins with the destination, the lesson happening next, and works backwards. Its main product decision is deliberate subtraction: missed resources that are not prerequisites stay out of the pupil's immediate route.

## Responsible design

The Build Week deployment uses fictional users and synthetic learning records. Diagnostic results are readiness signals, not grades or mastery claims. BridgeBack does not infer absence reasons, emotion, disability, behaviour or risk, and it is not approved for live school or child data. `store: false` reduces response persistence but is not described as Zero Data Retention. The repository documents the additional DPIA, safeguarding, retention, procurement and validation gates required before a real-school pilot.

## Evidence boundary

The attendance figures describe England, not the whole UK. The NFER research is a selected qualitative sample, not nationally representative. The OCR-aligned curriculum packs provide specification navigation and prerequisite taxonomy, not a complete replacement curriculum. The project does not yet claim reduced workload, improved attainment or teacher validation.

## Accomplishments

- A working, two-sided teacher and pupil journey backed by production Convex data
- Teacher-reviewed, source-grounded concept maps and diagnostics
- Persistent pupil progress and consistent views across roles
- Computer science and mathematics demonstrations
- Responsive mobile concept navigation and automated accessibility checks
- Optional visual and voice learning modes behind explicit pupil actions

## Challenges and learning

The hardest design problem was deciding what the AI must not do. A useful re-entry route needs enough intelligence to connect concepts, but it cannot quietly become a grading, profiling or safeguarding system. Source labels, narrow diagnostics, deterministic path limits and teacher approval made the experience both clearer and safer.

## Built with Codex

Codex was used throughout Build Week to turn the research-backed hypothesis into a vertical slice, implement and test the Next.js/Convex/Clerk architecture, review security and child-data boundaries, refine the two-sided experience, and prepare the deployment and submission materials. The final Devpost entry must also include the required `/feedback` Codex Session ID.

## Before submission

- **DONE:** Public narrated YouTube demonstration is available at https://youtu.be/3roIWobSEm4 and runs for 2:56.
- **TODO:** Add the `/feedback` Codex Session ID.
- **DONE:** The repository is public with an Apache-2.0 licence and judge-ready setup documentation.
- **TODO:** Rotate the OpenAI and Clerk server keys used during deployment setup, then update Convex and Vercel.
- **TODO:** Re-run production smoke tests after rotation and after the final commit.
- **TODO:** Confirm every Devpost field and preview; do not press Submit until the owner performs the final review.

## Sources

- Department for Education, *Pupil attendance in schools, 2024/25*: https://explore-education-statistics.service.gov.uk/find-statistics/pupil-attendance-in-schools/2025-week-29
- NFER, *Voices from the Classroom: Understanding how secondary schools support pupils returning from absence*: https://www.nfer.ac.uk/publications/voices-from-the-classroom-understanding-how-secondary-schools-support-pupils-returning-from-absence/
