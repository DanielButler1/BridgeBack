# AI-simulated teacher walkthrough

**Status:** Role-based heuristic evaluation, 16 July 2026
**Evidence boundary:** This is not teacher validation, user research, expert endorsement or evidence of workload reduction.

A separate model agent inspected the synthetic Computer Science and Mathematics journeys while adopting the constraints and concerns of a critical UK secondary teacher. The purpose was to find educational inconsistencies and workflow friction before asking real educators to spend time on the product.

## What it found

- Computer Science was credible and close to showcase-ready, with particularly strong pupil tone, agency and safeguarding boundaries.
- Mathematics demonstrated curriculum breadth but not an equivalent pupil journey: it described a check-in that did not exist, showed only one activity, and did not persist progress.
- The Mathematics graph treated checking a solution as a prerequisite while omitting solving linear equations.
- “Move x to the other side” was rejected as an unhelpful shortcut; explanations should describe applying the same inverse operation to both sides.
- A short multiple-choice check should be described as indicating support needs, never proving mastery.
- Teacher approval needs a safe abstention path when sources are insufficient.

## Changes made from the walkthrough

- Added a four-question Mathematics check-in, a results screen, two complete interactive activities, quick checks, optional visual support, voice support through the shared learning component, and refresh persistence.
- Replaced the incorrect dependency with solving linear equations and strengthened the worked example through substitution, solving and checking in both originals.
- Updated the submission story to describe BridgeBack as a curriculum re-entry engine rather than an AI tutor.

## What still requires real people

The walkthrough cannot establish usability, workload savings, educational effectiveness or willingness to adopt. The minimum real educator study is defined in [Impact measurement](IMPACT-MEASUREMENT.md): at least three accurately described educators completing the same synthetic task, with time, edits, source-verification failures and objections reported transparently.
