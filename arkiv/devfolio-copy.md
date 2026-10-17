# Kinora — Devfolio submission copy

Draft prepared against the official checklist and scoring rubric on October 17, 2026. Paste the answer text under each field, not the editorial notes. No submission has been sent. Confirm personal declarations and add the video URL before submitting.

Official references:
- https://github.com/Arkiv-Network/global-tour-stop-pre-devcon/blob/main/docs/submission-checklist.md
- https://github.com/Arkiv-Network/global-tour-stop-pre-devcon/blob/main/docs/scoring-rubric.md

## Project name

Kinora

## Tagline

An open community board, shared across independent apps.

## Short description

Kinora helps tech communities share gatherings and open calls through a public Arkiv data contract. Its publisher and separately hosted reader query the same active records without a Kinora backend. Community creators can authorize organizers and revoke their permissions, while readers verify authorship from Arkiv system fields.

## Tracks

Open Source; Censorship Resistance.

## Project links

- Live app: https://kinora-community.vercel.app/
- Direct live board: https://kinora-community.vercel.app/app/?source=arkiv&community=builders-sur
- Independent reader: https://kinora-reader.atom139139.workers.dev/?community=builders-sur
- Source: https://github.com/navy0110/kinora
- Schema: https://github.com/navy0110/kinora/blob/main/arkiv/schema.md
- Friction report: https://github.com/navy0110/kinora/blob/main/arkiv/friction.md
- Evidence: https://github.com/navy0110/kinora/blob/main/arkiv/evidence.md
- Demo video: ADD THE PUBLIC VIDEO URL AFTER RECORDING. This is not ready to paste until replaced.

## The problem it solves

Developer groups and public-goods communities coordinate through event pages and announcement feeds controlled by individual platforms. If the operator removes a page, closes its service, or loses its backend, another frontend cannot necessarily recover a queryable agenda. Reusing the data often requires access to the original operator's API or database.

Kinora makes the agenda a shared public contract. A community can publish gatherings and open calls to Arkiv, and independent clients can discover the same active records directly. Reading requires no wallet or Kinora account. Publishers sign from their own wallets, and readers distinguish registered community organizers from independent publishers using system creator fields and onchain permission history.

The live prototype includes a Vercel-hosted publisher and a separate static reader on Cloudflare. Both resolve the same entity keys. A local outage test also confirmed that the independent reader reloads a real Arkiv publication with the publisher server stopped. This reduces dependence on the publisher; it does not guarantee immunity to censorship at every network layer or permanent availability.

## Challenges I ran into

The Arkiv SDK required careful use of typed attributes, cursor pagination, and its current expiration API. A real publication attempt exposed a bug in my integration: rounding the remaining lifetime to whole seconds could produce an odd duration, which is invalid on a chain with two-second blocks. I changed the write path to ExpirationTime.fromBlocks, rounding up to complete blocks while retaining the exact endsAt filter in readers. Regression tests reproduce the reported failure and boundary cases.

Another challenge was making community authorization independently verifiable. A slug is self-declared and can be copied. Kinora binds registered publications to a community entity key, accepts organizer permissions only from that entity's system creator, applies the latest permission state, and fails closed for authorized labels when registry reads fail. The independent reader implements the same rules separately. I verified grant, delegated publication, and revocation with two funded test wallets; revocation removed the label in both clients without deleting the event.

I also separated transaction success from subsequent read failures, so a temporary RPC failure cannot turn a confirmed write into an apparent failure or lose the saved receipt. Twenty automated tests pass. Detailed versions, observations, reproduction steps, and remaining verification limits are in the friction report.

## Why Open Source?

The beneficiaries are community maintainers and developers who want to reuse an agenda without negotiating database access with its original operator. Kinora is MIT licensed and publishes its entity schemas, typed query predicates, expiration rules, and authorization algorithm. The separate plain-JavaScript reader demonstrates reuse without importing the Next.js publisher. Other teams can build new interfaces over the same active data contract; they do not need a Kinora API key or account.

## Why Censorship Resistance?

A community's event feed should remain readable when its original frontend or publisher backend is unavailable. Kinora's reader accesses Arkiv directly and is hosted separately on Cloudflare, while the publisher runs on Vercel. The local publisher-offline test demonstrates that the reader does not need the publisher server to reload a stored event. Read-only publications prevent later mutation of those entity payloads. Permissions affect current affiliation labels, not whether the underlying publication can be read.

The claim is limited to reducing publisher-side control and dependence. Arkiv, public RPC endpoints, the reader's CDN dependencies, and hosting remain availability dependencies. Publications expire and are not permanent archives.

## Why Arkiv?

Kinora relies on independently queryable records, immutable system authorship, and entity lifetimes shared across clients. With an operator-controlled Postgres database and API, independent readers would still rely on that operator for availability and access. Replication could mitigate that, but would require designing and operating another shared distribution and verification system.

IPFS could distribute payloads by content identifier, but content addressing alone would not supply Kinora's compound discovery queries, active-event ranges, and creator-bound permission history. A subgraph could index a custom event contract, but that would require a separate write contract and indexing arrangement for these records. Arkiv supplies the entity and query primitives used by both clients through one shared data layer.

Kinora keeps view preferences, search input, synthetic fixtures, and optional receipt storage in the clients. Wallet keys stay in the wallet. No attendee profiles, contact details, RSVP lists, or private application database are stored on Arkiv. Wallet addresses used for test authorship are public.

## How do you use Arkiv?

1. Entity writes: publications, community registrations, and organizer grant/revoke records use the official TypeScript SDK on Tiramisu, with wallet-confirmed creation.
2. Typed attributes: protocol and entity type delimit the contract; community, kind, topic, and mode support discovery; starts_at and ends_at use u64 milliseconds. Titles and descriptions remain JSON payload content.
3. Queries: the board combines protocol, entity type, and ends_at > now, with an optional community predicate. It traverses cursor pages. Search, topic, and kind filters are applied locally by the current interface.
4. Authorship: readers use Arkiv system creators rather than payload claims. Registered community keys and creator-signed permission history determine current organizer authorization. Revocation changes the label without erasing publications.
5. Creation flags: all three entity types are created read-only, making changes to permissions an append-only history rather than edits to existing grants.
6. Expiration: event records follow their end time, rounded up to complete two-second storage blocks; clients enforce exact endsAt visibility. Community and permission records have 365-day lifetimes. No extension feature is claimed.
7. Independent reuse: the Cloudflare reader queries Arkiv directly with its own schema and authorization implementation. It does not call the publisher API or import the publisher runtime.

Code:
- Writes and publisher queries: https://github.com/navy0110/kinora/blob/main/lib/arkiv.ts
- Authorization: https://github.com/navy0110/kinora/blob/main/lib/authority.ts
- Expiration: https://github.com/navy0110/kinora/blob/main/lib/expiration.ts
- Independent reads: https://github.com/navy0110/kinora/blob/main/reader-client/reader.js
- Independent authorization: https://github.com/navy0110/kinora/blob/main/reader-client/authority.js

## Entity-creating wallets

- 0x2Fd1001bC60849576D8c8b698220B546f0B7f544 — community creator; created the registered Southern Builders community, creator publications, organizer grant and revocation.
- 0xA13Dfd06727708D74bcf5db3DB1d725bc59ADEBC — delegated organizer; created the synthetic delegated event while authorized. Its permission was subsequently revoked.

These are test authorship addresses. Confirm any payout wallet separately in the registration form.

## Reproduction instructions for judges

1. Open the direct board link above, with Tiramisu selected. Reading requires no wallet.
2. Open Southern Builders and inspect the creator-authorized workshop. Compare its creator and entity key with evidence.md.
3. Inspect “Delegated organizer — synthetic test”. It remains visible as Independent publisher because its organizer permission was revoked.
4. Open the independent Cloudflare reader with community=builders-sur. Compare the same publication's full entity key and creator. Its current authorization label should match the board.
5. Read schema.md for the exact compound query and use the documented setup to run either client independently. The reader requires no publisher server.
6. For the signed permission sequence, inspect the grant, delegated publication and revoke transaction identifiers in evidence.md. The local outage procedure and its observed result are documented there too.

Known delegated entity: 0xc78c4d4e24c290f1b6b5105cb0bce66ed9428b119d98f2067fb432cbbd557a5e.

Delegate publication transaction: 0x2a8874d687bf9aba91779c5037c90cf994eb93ee0c12f8ba0d367c4d3705c878.

Revocation transaction: 0x5ec845095ed6ba7f56636681b6e4fffa58ddf5ea739fec28b5e357778b52e767.

## Third-party and pre-existing work disclosure

CONFIRM BEFORE PASTING: the Kinora app and Arkiv integration were developed during this hackathon in a dedicated project directory and repository. No Vynx application code or services were imported. The local directory initially lived inside a broader workspace; that location is not a product dependency.

Third-party foundations include Next.js, React, viem, the Arkiv SDK, Lucide icons, and Google Fonts. AI-assisted design and development used OpenAI Codex, and generated design mockups were used as visual references. The final interface is implemented in HTML/CSS/React. Frontend Design and Taste/Redesign skill instructions informed the design. The existing common-ground:v1 namespace is Kinora's earlier working-name namespace retained for compatibility, not a separate prior product.

If you personally reused any code made before October 9, disclose the source, baseline commit and reused components instead of claiming none.

## Arkiv tools used

Select: TypeScript SDK; Docs; Hub; Faucet; Block Explorer.

RPC is used through SDK HTTP transports. Do not claim manually implemented Direct JSON-RPC, WebSocket events, access keys, Arkiv MCP, Arkiv skills, or Arkiv Plugin. Reading local SDK declarations and tests also informed the integration.

## First entity timing

PERSONAL CONFIRMATION REQUIRED: select the actual elapsed-time category. Same-day development logs establish a successful first write but do not reliably establish elapsed time from the builder's own start. Do not infer a category from commit timestamps.

## LLM disclosure

OpenAI Codex was used for AI-assisted development, debugging, documentation, design iteration, and read-only verification. An OpenAI image-generation tool produced design-reference mockups. I reviewed the work and personally confirmed wallet transactions. Add exact model names only if you can confirm them.

## Most important Arkiv improvement

Make block-aligned expiration harder to misuse. My event form supplies a wall-clock end date, but fromSeconds rejects durations that are not multiples of Tiramisu's two-second block time. A documented event-deadline recipe or an explicit rounding helper would make this path easier to implement correctly. The error message was actionable and led to a fromBlocks fix; the friction report includes the exact failing value and regression case.

## Fields only the builder can confirm

- Indian nationality eligibility: answer truthfully; no assumption has been made.
- Feedback-call participation: choose your own preference.
- Attendance in Mumbai: optional; choose your own preference.
- Builder profile, payout wallet and registration declarations: confirm personally.
- Original-work and public-access declarations: review the repository, dependency disclosure and every link before checking them.

## Final review

Add the public video link. Confirm the personal fields above. Open every deployment and GitHub link from a signed-out browser. Keep both deployments available through judging and do not rewrite Git history after the deadline. Submit once with both selected tracks; this draft does not submit anything automatically.
