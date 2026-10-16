# Kinora deployment handoff

Status: local preparation only. No public deployment is recorded yet.

## 1. Independent reader — Cloudflare Pages

From the Kinora project directory run `npm run build:reader`. Upload only the resulting `reader-dist/` directory through Cloudflare Pages Direct Upload. No build command, wallet, environment variables or API credentials are required by this site. Use a separate Pages project, for example `kinora-reader` if available.

The output contains index.html, reader.js, authority.js, style.css, LICENSE and 404.html. The local server, development screenshots and publisher sources are excluded. A real 404 page avoids the host treating arbitrary paths as an SPA route.

Record the actual HTTPS URL assigned by Cloudflare. Open `/?community=builders-sur` on that host, compare entity keys with `evidence.md`, and confirm a creator-authorized publication and an independent publication are distinguished. The reader still relies on esm.sh and the Tiramisu RPC.

## 2. Publisher — Vercel

Create a separate Vercel project for Kinora. Use this application's directory as the project root, not the surrounding Vynx project. For a standalone Kinora repository the root is `.`; with the current checkout location the application folder is `common-ground/`.

- Framework: Next.js.
- Install: `npm ci`.
- Build: `npm run build`.
- Static output: `out/` (the project uses `output: 'export'`).
- Environment variable: `NEXT_PUBLIC_READER_URL` = the actual HTTPS root URL of the Cloudflare reader, with a trailing slash. Set it for each deployment environment being tested, before the build.

This variable is public and embedded at build time. Changing it requires a new deployment. Without it the production app falls back to its bundled `/reader/` route, which does not prove separate-host independence.

No Supabase, wallet secret, private key or Arkiv write key is required. Users sign from their own wallet. Leave both deployments publicly accessible to judges.

## 3. Verify the public pair

1. Open `/`, `/app/` and `/reader/` directly and refresh each route. Static output includes directory index files for trailing-slash routes.
2. Verify a legacy root link `/?source=arkiv&community=builders-sur` forwards to the board with filters intact.
3. Copy a community link and open it in a fresh browser without a connected wallet.
4. Check the independent-reader links point to Cloudflare, not localhost or the bundled reader route.
5. Read the same known entity on both sites; compare creator and entity key. Repeat wallet-signed publication only with the wallet holder present.
6. Demonstrate that the reader can reload from its separate origin without contacting Vercel. Do not claim this eliminates RPC, CDN, network or expiry dependencies.
7. Add actual deployment URLs and observed results to evidence.md. Do not mark deployment complete from a successful build alone.

Official setup references: https://developers.cloudflare.com/pages/get-started/direct-upload/ and https://vercel.com/docs/frameworks/full-stack/nextjs.
