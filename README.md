# Kinora

Live app: https://kinora-community.vercel.app/ · Independent reader: https://kinora-reader.atom139139.workers.dev/

Arkiv-only community events and calls. Independent Next.js project; no Vynx dependencies, environment variables or services. All fixtures are synthetic.

## Run

Node 22.10+; `npm ci`, `npm run dev`. Open http://localhost:3100 for the landing page and http://localhost:3100/app/ for the community board. Legacy root links with `source` or `community` query parameters forward to the board and preserve their filters. `npm test`, `npm run typecheck`, `npm run build`. Static deployment output: `out/`.

The homepage is the landing page; the board at `/app/` starts in a clearly labeled synthetic demo. Select **Tiramisu** to read live data directly from the public RPC, without an app backend or wallet. `/reader/` is a second reference UI using the same contract and direct queries; it is currently part of the same project/deployment, not a separately deployed application.

## Publish and reproduce

1. Install an EVM wallet and fund it with test GLM at https://hub.arkiv.network/. Never enter a private key into this app.
2. Select Publish. Click **Load synthetic example**, or enter your own synthetic content, community slug, start/end dates and optional public link. Dates are entered in the browser's local timezone; cards use Buenos Aires dates. The sample is scheduled twelve days ahead to remain queryable through judging.
3. Confirm chain addition/switching and the create transaction in your wallet. This action stores public test data and consumes test GLM.
4. The confirmed receipt shows creator, transaction hash and entity key, and is saved locally in this browser. Select Tiramisu, refresh, and locate your publication. A later read failure does not erase the receipt or label the confirmed write as a failed publication.
5. Open `/reader/`, filter by the community slug, and export JSON. It retrieves the same entity without any app API.
6. Run `node reader-client/server.mjs` and open http://localhost:3101. This separate static client uses the public contract without importing the publisher code. Deploy `reader-client/` to a separate static host, then set `NEXT_PUBLIC_READER_URL` to its public URL when building the publisher. After publishing, compare entity keys and stop the publisher server to test independent reads. Simply navigating between two routes is not a server-outage demonstration.

## Scope and limitations

Implemented: publication creation, direct queries, cursor pagination, synthetic demo, discovery filters, detail view, creator display, contract validation, read-only publications, semantic expiry, community share links, refresh, a reference route and a separately runnable static reader in `reader-client/`.

Community registration and creator-authorized publication were verified with wallet-signed transactions (see `arkiv/evidence.md`). The signed delegated-organizer sequence (grant, delegated publication, revoke) was also verified on Tiramisu; live readers remove current authorization after revocation while preserving the publication. Choose **Manage communities**, register a synthetic community, then select that entity in the publishing form. The creator or authorized organizer can publish with its community key. Both clients verify current authorization from system creators and permission history. Slugs are not globally unique. The first test publication has no community key and remains labeled Independent publisher; a second publication references the registered community and is labeled Authorized organizer. Not yet implemented: publication editing, RSVP and live subscriptions. Public RPC rate limits can temporarily prevent reads; no credential is embedded.

A synthetic publication was signed by the wallet holder and verified in both clients. The independent reader successfully reloaded the same entity while the publisher server was stopped. Exact transaction, entity key, creator and observed checks: `arkiv/evidence.md`. The independent reader is published at https://kinora-reader.atom139139.workers.dev/. The publisher is live at https://kinora-community.vercel.app/. Demo video and hackathon submission remain pending.

## Why Arkiv

Each reader can query the shared publication contract without our database or API. Typed attributes support community, topic, modality, kind and date predicates. Expiry follows the event/call lifetime. Content is publicly readable until expiry; this is not a permanent archive. Offchain: client display preferences, search input, demo fixtures, wallet keys, all personal data.

## Hackathon delivery

Keep the deployment live until October 23. Record creator wallet addresses and creation transactions after a real test write. Finish `arkiv/friction.md` with observed results only; record video <=3 minutes, independent reader deployment and baseline commit SHA before submitting on Devfolio. This application is maintained in its own Kinora Git repository.

## Brand and protocol compatibility

Kinora is the application name. The existing `common-ground:v1` protocol namespace and browser receipt storage key are retained so the verified testnet entities and saved receipts remain readable. The local project folder is still `common-ground/`.

## Deployment preparation

Run `npm run build:reader` to prepare the independent Cloudflare Pages upload in `reader-dist/`. The app builds to `out/` for Vercel. Follow `arkiv/deployment.md` to set the actual public reader URL and verify the public pair. Neither site requires Supabase.

