# Deployment runbook

BridgeBack is deployed to Vercel at [bridgeback.phaseo.app](https://bridgeback.phaseo.app), with `bridge-back-iota.vercel.app` retained as the provider fallback. DNS is managed in Cloudflare using a DNS-only CNAME to Vercel. The GitHub repository remains private until the planned public release; production deployments are currently made from the authenticated Vercel CLI rather than Vercel's Git integration.

## Required services

- Vercel project linked locally through `.vercel/project.json` (gitignored)
- Clerk production instance with a Convex JWT template
- Convex production deployment
- OpenAI project API key stored separately in Convex and Vercel, never committed to the repository

## Vercel environment variables

Configure these for Preview and Production as appropriate:

```text
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_CONVEX_URL
CLERK_JWT_ISSUER_DOMAIN
DEMO_TEACHER_CLERK_USER_ID
DEMO_PUPIL_CLERK_USER_ID
DEMO_AUTH_ENABLED=true
OPENAI_API_KEY
OPENAI_REALTIME_MODEL=gpt-realtime-2.1
```

`DEMO_AUTH_ENABLED` is for the fixed synthetic judge accounts only. Disable it for a real school deployment. The Realtime route runs in Next.js on Vercel, so its server environment also needs `OPENAI_API_KEY`; the permanent key is never sent to the browser.

## Convex environment variables

```text
OPENAI_API_KEY
CLERK_JWT_ISSUER_DOMAIN
```

The Clerk issuer domain is configured through `convex/auth.config.ts` and must match the production Clerk instance.

## Release sequence

1. Run `npm ci`.
2. Run `npm run verify`.
3. Create the Convex production deployment and apply the schema.
4. Configure Clerk and both fixed synthetic demo accounts. Confirm that the session token accepted by Convex has the configured issuer and an `aud` claim of `convex`; a separate template is unnecessary when the Clerk–Convex integration already supplies this token.
5. Seed the synthetic judge data using the command in the README.
6. Link the local checkout to the Vercel project and add the variables above. Connect Git integration only after granting the Vercel GitHub app access to the private repository.
7. Create a Preview deployment.
8. Test teacher sign-in, pupil sign-in, reset, file analysis, diagnostic completion, refresh persistence and image generation.
9. Promote the tested Preview deployment to Production.
10. Check Vercel and Convex logs for errors without logging pupil content.

## Rollback

Use Vercel's instant rollback or promote the last verified deployment. Do not roll back the application across an incompatible Convex schema change without first checking data compatibility.

## Public repository checklist

- Apache-2.0 licence is present.
- `.env.local` and `.vercel` remain ignored.
- No API keys, Clerk secrets, session secrets or deployment tokens are committed.
- README setup and synthetic seed instructions are current.
- CI passes on the public default branch.
- The submission includes the required Codex feedback session ID separately.
