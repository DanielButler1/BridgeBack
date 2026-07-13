<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commit Checkpoints

- At the end of every completed Codex turn that changes the repository, create a commit containing the changes made during that turn.
- Use Conventional Commits for every commit. Format messages as `<type>(<optional scope>): <description>`; use types such as `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, and `build`.
- Keep commits focused on the work completed in that turn. Do not combine unrelated changes into one commit.
- Before committing, run the relevant validation for the changed files and inspect `git diff --staged`.
