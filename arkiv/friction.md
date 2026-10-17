# Arkiv integration observations

## SDK 0.8.1 / typed queries

Expected: direct public reads on current Tiramisu (7738577), without a wallet or application backend.

Observed during development October 14, 2026: SDK `getChainId()` returned 7738577. A `select({key:true}).where(eq('protocol', str('common-ground:v1'))).limit(1).fetch()` succeeded and returned zero records. No publication had been seeded.

Reproduce: install locked dependencies; instantiate `createPublicClient({chain:tiramisu,transport:http()})`; run the query from schema.md or visit `/reader/`.

Docs/API migration: current SDK uses typed `str` / `u64` values, `select()` and the mutation property `expires`; earlier README examples used a different query builder and `expiresIn`. We used current official documentation and installed declarations rather than copying old examples.

## Standalone browser reader

October 14, 2026: the independent static reader on localhost:3101 loaded SDK 0.8.1 and viem 2.38.0 from pinned esm.sh URLs. It queried the public Tiramisu RPC from the in-app browser successfully, reporting zero active publications. No browser console warnings/errors were observed in this check. Reproduce with `node reader-client/server.mjs`, then open localhost:3101. This verifies browser reads and CDN loading, not a post-write round trip or production deployment.

## Wallet write and independent read verified

October 14, 2026: wallet holder signed the synthetic event from their own browser. SDK reads confirmed creator, entity, creation block and payload. Both publisher and independent reader displayed it. After stopping the publisher server and confirming port 3100 was closed, reloading the static reader retrieved the same live entity from Tiramisu. The publisher server was restarted. Reproduction and exact identifiers: `evidence.md`.

## Signed community and organizer checks

Community registration and creator-authorized publication were subsequently verified with real wallet-signed transactions; identifiers and chronology are in `evidence.md`. The signed grant, delegated publication and revoke sequence was verified October 17; see evidence.md. Twenty automated tests passed, including forged grants, same-slug different identities, revocation and fail-closed behavior. Automated permission checks do not substitute for signed grant/revoke evidence.

## Remaining verification limits

Wallet chain addition, rejection and insufficient funds with a real extension, and actual expiration. Separate public deployments were verified on October 16, 2026 (Vercel publisher and Cloudflare reader); see evidence.md. Exact wallet extension/browser versions for the user's successful write were not collected. Tests cover nested error interpretation, not real wallet failure behavior.

## Two-second expiration alignment

October 17, 2026: a delegated publication failed with `Invalid expiry` because `ExpirationTime.fromSeconds(1043903)` represents a fractional number of Tiramisu blocks (521951.5). The app rounded duration to whole seconds instead of whole two-second blocks. Fixed by using `ExpirationTime.fromBlocks(Math.ceil((endsAt - now) / 2000))`. The declared endsAt and read-side expiry predicate remain unchanged. Regression tests reproduce the reported odd-second lifetime, exact and fractional block boundaries, and expired inputs; all 20 tests pass. The exception occurs locally before createEntity sends this publication transaction. The delegated publication subsequently succeeded with the block-aligned expiry; its receipt is in evidence.md.
