# Open Agenda — standalone reference client

Working name. Deploy this directory as a static site on a separate host. No Next.js, React, server API, keys, package install or Kinora runtime dependencies. It loads the pinned Arkiv SDK 0.8.1 and viem 2.38.0 from esm.sh, then reads the public Tiramisu RPC directly.

Local preview: `node reader-client/server.mjs` from the project directory. Open http://localhost:3101. The server only serves the reader static assets; it never queries Arkiv.

Filter share link: `/?community=builders-sur&kind=event`. Invalid public payloads and non-HTTP(S) links are discarded. Content is inserted with textContent, never innerHTML.

After a funded synthetic publication exists, compare its entity key here and on the publisher. Stop the publisher server on port 3100. Reload this client on port 3101 and verify the same active entity remains readable. This test passed locally with a real synthetic publication on October 14, 2026; see `../arkiv/evidence.md`. Public deployment verification remains pending.

CDN and public RPC availability remain dependencies. Community identifiers are self-declared, not official authority. The MIT license in the project root applies.

Deployment package: run `npm run build:reader` from the project root and upload `reader-dist/` to Cloudflare Pages. See `../arkiv/deployment.md`.
