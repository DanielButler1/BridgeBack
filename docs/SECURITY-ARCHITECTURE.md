# BridgeBack security architecture

## Product boundary

BridgeBack operates two isolated experiences. `/demo` uses only synthetic identities and seeded learning data. `/app` requires a real Clerk session and stores production records under a Convex organisation and membership boundary.

## Encryption and secrets

- Production traffic must use HTTPS. Clerk, Convex, OpenAI and the deployment platform provide encryption in transit and managed encryption at rest.
- Secret keys remain in server or provider environment variables. They are never exposed through `NEXT_PUBLIC_*`, logged, or committed.
- BridgeBack does not implement custom cryptography. Provider-managed encryption and narrow server-side authorization are safer than application-authored encryption code.
- The signed demo cookie is HTTP-only, SameSite Lax, time limited, and Secure in production. It cannot authorize production workspace access.

## Authorisation

- Clerk proves identity; Convex independently resolves that subject to a BridgeBack user.
- Every production mutation checks active organisation membership server-side.
- UI role checks are convenience only and are never treated as an authorisation boundary.
- Administrative actions create append-only audit events without storing request bodies, tokens, or lesson content.

## Child data

- The public demo contains no real child data.
- Production defaults to data minimisation and a 365-day retention setting. A school pilot still requires a DPIA, controller/processor agreements, safeguarding ownership and tested deletion/export procedures before identifiable pupil data is accepted.
- Lesson uploads must remain in managed private storage and must not be copied into `public/`.

## Remaining production gates

- Enforce file content-type and size limits before production uploads are enabled.
- Add rate limits for authentication, uploads and AI generation.
- Deploy and test an enforceable Content Security Policy compatible with Clerk and Convex.
- Add organisation deletion/export workflows and tenant-isolation integration tests.
- Configure production Clerk and Convex deployments separately from development.
