# Production readiness

- **Software status:** Functional production deployment
- **Current release status:** Public demonstration with synthetic data
- **Approved data scope:** Synthetic pupil and school data only
- **Real-school status:** Not yet approved for identifiable pupil data
- **Last reviewed:** 21 July 2026

## What this status means

BridgeBack is a working, end-to-end product rather than a static prototype. Its teacher and pupil journeys run against deployed application, authentication, database, storage, and OpenAI services. A teacher can upload lesson material, generate and review a prerequisite map, approve a diagnostic, and assign it. A pupil can complete the diagnostic, receive a deterministic learning path, work through generated activities, request a visual explanation, use a short voice conversation, and resume progress after a refresh.

The public deployment is intentionally limited to fictional users and synthetic learning records. It demonstrates the complete product loop without claiming that the service has completed the legal, safeguarding, security, procurement, and educational validation required to process identifiable pupil data in a school.

In short: the software is deployed and functional; institutional production approval remains a release gate.

## Production foundations already implemented

### End-to-end product workflow

- Separate teacher and pupil experiences
- A protected school workspace and an isolated judge demo
- Lesson, class, resource, diagnostic, pathway, module, response, and support-request persistence in Convex
- Authorized file uploads and stored lesson resources
- Teacher review and approval before an AI-generated concept graph reaches a pupil
- Deterministic diagnostic scoring and dependency traversal
- A pupil pathway limited to three focused steps
- Progress that survives refreshes and remains consistent between teacher and pupil views
- Computer Science and Mathematics examples

### AI implementation

- Source-grounded lesson analysis with structured, validated output
- Job-specific model routing for concept graphs, diagnostics, learning activities, illustrations, and voice
- Zod validation for generated educational structures
- Prompt-injection boundaries around uploaded material
- Exact source references on concepts and learning activities
- `store: false` on applicable OpenAI requests
- Stable, one-way safety identifiers instead of raw account identifiers
- AI-run telemetry for status, model, prompt version, latency, token usage, and errors
- Optional GPT Image 2 illustrations and short `gpt-realtime-2.1` learning conversations

### Security and privacy foundations

- Clerk authentication for the protected workspace
- Role and ownership checks at the Convex data boundary
- Signed, HTTP-only, time-limited demo sessions restricted to fixed synthetic identities
- Separation between the public demo and protected school workspace
- Security headers and restrictive browser permissions
- No collection of absence reasons, medical information, safeguarding records, or inferred emotional state
- No AI grading, ranking, discipline, placement, or attendance decisions
- Documented retention, deletion, incident-response, and prohibited-use boundaries

### Engineering assurance

- Deployed Next.js application on Vercel
- Deployed Convex production backend
- Public HTTPS domain
- TypeScript, ESLint, and unit-test validation
- Playwright coverage for public pages and the main teacher, pupil, and Mathematics journeys
- Desktop and iPhone-sized browser coverage
- Automated serious and critical WCAG checks
- GitHub Actions continuous integration
- Apache-2.0 licensed public repository

## Current demonstration boundary

The following rules apply to the public Build Week deployment:

- Use only the supplied fictional teacher and pupil identities.
- Upload only synthetic, openly licensed, or uploader-owned lesson material.
- Do not enter a real pupil's name, voice, work, attendance record, health information, or other personal data.
- Treat generated educational content as a demonstration that remains subject to teacher review.
- Do not use outputs for grades, placement, discipline, safeguarding decisions, or attendance action.

The one-click judge sign-in path exists only to make the synthetic demonstration easy to evaluate. It must be disabled for any real-school environment.

## Release gates for a supervised real-school pilot

These are blockers, not optional enhancements.

### Governance and child safety

- [ ] Complete a child-specific Data Protection Impact Assessment with the participating school.
- [ ] Confirm the lawful basis, transparency information, age-appropriate language, and any consent requirements.
- [ ] Assign named safeguarding, privacy, security, and educational owners.
- [ ] Agree the controller and processor roles and execute the required data-processing agreements.
- [ ] Define and test the route for reporting unsuitable content or requesting human help.
- [ ] Obtain explicit approval from the school's safeguarding and data-protection leads.

### OpenAI data controls

- [ ] Use a dedicated production OpenAI project with least-privilege keys, budgets, and alerts.
- [ ] Confirm that the project's retention configuration is appropriate for the pupils' ages and data involved.
- [ ] Do not process personal data of children below 13, or the applicable age of digital consent, without first implementing Zero Data Retention, as required by OpenAI's [Under 18 API Guidance](https://developers.openai.com/api/docs/guides/safety-checks/under-18-api-guidance).
- [ ] Review each enabled model and modality, including Realtime voice, against the approved data flow.
- [ ] Revalidate moderation, safety identifiers, escalation behaviour, and cost limits in the production project.

### Identity and tenancy

- [ ] Disable `DEMO_AUTH_ENABLED` and remove judge role-switching from the school environment.
- [ ] Configure school-controlled invitations, account recovery, offboarding, and administrator roles.
- [ ] Complete adversarial authorization tests across schools, classes, teachers, pupils, files, and AI actions.
- [ ] Verify that development, demonstration, pilot, and production environments use separate credentials and data stores.

### Data lifecycle and operations

- [ ] Agree retention periods for every data category rather than relying on prototype defaults.
- [ ] Implement and test access, correction, export, deletion, and account-closure workflows.
- [ ] Establish encrypted backup, restoration, disaster-recovery, and key-rotation procedures.
- [ ] Configure production monitoring, alerting, rate limits, abuse controls, cost limits, and on-call ownership.
- [ ] Run incident-response and data-breach exercises with the participating school.
- [ ] Complete an independent security review and remediate its findings.

### Educational validation and accessibility

- [ ] Have qualified teachers review prerequisite maps, diagnostics, explanations, worked examples, and error states.
- [ ] Conduct supervised usability and accessibility testing with representative users.
- [ ] Define measurable pilot outcomes before collecting results.
- [ ] Validate claims about pupil readiness, teacher workload, and learning impact before publishing them.
- [ ] Establish a curriculum-content review and versioning process with accountable subject owners.

## Gates for wider school availability

A successful supervised pilot would not automatically approve a general release. Wider availability would also require:

- repeatable school onboarding and offboarding;
- documented support and service ownership;
- penetration testing and recurring security reviews;
- procurement-ready privacy, accessibility, security, and subprocessors documentation;
- operational service levels, capacity planning, and cost forecasting;
- broader curriculum validation and content change control;
- evidence that the product helps without creating new workload, stigma, or disadvantage; and
- an explicit go-live decision from accountable product, education, safeguarding, privacy, and security owners.

## Known limitations

- The public deployment uses fictional users and is not evidence of real-school approval.
- Automated accessibility checks do not replace testing with disabled users.
- The teacher walkthrough in this repository is AI-simulated, not an endorsement from a qualified teacher.
- The project does not yet claim reduced workload, improved attainment, or improved attendance.
- The curriculum packs are navigational prerequisite maps, not complete curriculum replacements.
- Generated illustrations can take around two minutes and remain optional support rather than the source of truth.
- `store: false` is not the same as Zero Data Retention.
- Realtime voice processes microphone audio after an authenticated tester deliberately starts a session; the public demo must not be used with a real child's voice.

## Release decision

BridgeBack may be described as:

> A functional, production-deployed Build Week product demonstrated with synthetic data.

It must not yet be described as:

> Approved for deployment with real pupils or identifiable school data.

The release boundary should change only when every applicable pilot gate above has evidence, an accountable owner, and explicit sign-off.

## Related documentation

- [Safety, privacy, and product decisions](SAFETY-PRIVACY-DECISIONS.md)
- [Security architecture](SECURITY-ARCHITECTURE.md)
- [School integration and pilot plan](SCHOOL-INTEGRATION-PILOT.md)
- [AI evaluation plan](AI-EVALUATION.md)
- [Impact measurement plan](IMPACT-MEASUREMENT.md)
- [Curriculum packs and versioning](CURRICULUM-PACKS.md)
