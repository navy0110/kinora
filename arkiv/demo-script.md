# Kinora — English demo video

Target: 2:40–2:55, including short transitions. Rehearse and check the actual recording stays below three minutes. Read only the quoted narration; screen directions are not spoken. 325 spoken words; speak clearly rather than rushing.

## Before recording

- Open the public landing: https://kinora-community.vercel.app/
- Open the board: https://kinora-community.vercel.app/app/?source=arkiv&community=builders-sur
- Open the separate reader: https://kinora-reader.atom139139.workers.dev/?community=builders-sur
- Keep the repository and evidence page ready: https://github.com/navy0110/kinora/blob/main/arkiv/evidence.md
- Refresh both clients and confirm three publications are still active. Use the live Tiramisu view throughout the demonstration.
- The delegated organizer is currently revoked. Show its current Independent publisher label; do not portray it as currently authorized. The creator's registered publication remains authorized.
- No fresh signing is needed. Keep wallet notifications and unrelated tabs out of the capture. Show the public wallet addresses only when explaining evidence.

## 0:00–0:20 — The problem

Screen: landing; move to Open app.

> This is Kinora, an open board for tech communities to share gatherings and open calls. A community’s agenda should not depend on one application staying online. Kinora lets different clients read the same publications directly from Arkiv.

## 0:20–0:50 — Working product

Screen: public board, Southern Builders, Tiramisu selected. Briefly use search, then clear it. Open the creator-authorized workshop details.

> Here is Southern Builders on the Tiramisu testnet. These are actual Arkiv records with synthetic content, not demo fixtures. I can search opportunities and inspect the publisher. Reading needs no wallet. Publishing requires a wallet confirmation. A community is identified by its entity key and creator, so a matching name alone does not establish affiliation.

## 0:50–1:20 — Permission lifecycle

Screen: creator event Authorized organizer, then delegated test Independent publisher. Briefly show the grant/publication/revocation entries in evidence.md.

> I tested the full organizer flow with two wallets. The community creator granted permission, the second wallet published, and the creator revoked permission. Both clients verified these transactions. After revocation, the delegated event remains visible, but its current authorization label changes to Independent publisher. Revocation changes trust labeling; it does not erase history.

## 1:20–1:55 — Independent reader

Screen: switch to the Cloudflare reader. Expand or scroll to the delegated event and highlight its full entity key. Compare with the same entity key in Kinora's publication details.

> Now I’m opening the separate reader on Cloudflare. Kinora runs on Vercel. This reader has no React dependency, no Kinora API calls, and its own implementation of the documented contract. Here is the same entity key and creator. We also verified locally that the reader reloads these records while the publisher server is stopped. That local outage test is documented in the repository.

## 1:55–2:25 — Why Arkiv

Screen: schema.md query and the three entity types. Keep the code large enough to read.

> Arkiv provides shared, queryable entities, typed attributes, verifiable creators, and expiration. Kinora stores publications, communities, and organizer permissions there. Clients query active records and validate authorship themselves. Publication lifetimes follow event deadlines. Community and permission records last one year. The code is MIT licensed, so another team can build a compatible reader without asking us for database access.

## 2:25–2:50 — Scope and close

Screen: return to the live board; optionally show repository tests and friction report links.

> Kinora targets Open Source and Censorship Resistance by reducing dependence on the publisher’s backend. It still depends on Arkiv, RPC availability, and reader delivery dependencies. Expiring records are not a permanent archive. The repository includes reproducible queries, signed transaction evidence, twenty passing tests, and integration feedback, including the two-second expiration issue we fixed. Find your people. Build what’s next.

## Recording notes

Record at a readable desktop resolution. Use deliberate cursor movements and short pauses. Avoid waiting for wallet dialogs in the video. If a live read fails, retry before recording rather than substituting synthetic fixtures while claiming live results. If the take exceeds three minutes, shorten transitions and the permission explanation; preserve the independent reader comparison and Arkiv reasoning.

Do not simulate a public Vercel outage by closing its tab. This script explicitly describes the previously verified local outage test, while showing real public clients on separate providers.
