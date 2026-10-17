# Verified synthetic publication

Verified October 14, 2026 on Tiramisu (7738577).

- Creator: `0x2Fd1001bC60849576D8c8b698220B546f0B7f544`
- Entity: `0xc346a726797317ef7c4baa27a73e4e7b7d4ed7bad76ea89c1205a31505c8d37c`
- Creation transaction: `0x57e9229536bf1f4dde6e882ca66bbd610a5f5232d99be18663f2f213c637ab93`
- Creation block: `578993`
- Expiration block reported by Arkiv: `1100972`
- Community: `builders-sur`
- Title: Open data workshop — synthetic test
- Payload start/end UTC milliseconds: 1793044500000 / 1793051700000.

The wallet holder signed the transaction in their own browser. Development tooling performed read-only verification. Creation transaction identified from matching entity logs in the creation block.

## Observed checks

1. Public SDK getEntity returned the synthetic payload and expected system creator.
2. Publisher UI at port 3100, live Tiramisu mode, displayed the event.
3. Independent static reader at port 3101 displayed the identical entity key and creator.
4. Publisher server was stopped. TCP check on 127.0.0.1:3100 returned false.
5. Reader was reloaded from its own static server, queried Tiramisu again, and still displayed the same entity. Screenshot: `reader-client/verified-publication.png`.
6. Publisher server restarted after the check.

This proves local independence from the publisher server for this live entity, not permanent availability or immunity to Arkiv/RPC/CDN outages. Public hosting and a demo video remain pending.

## Community registration verified

Verified October 14, 2026: Southern Builders (`builders-sur`) exists as immutable community entity `0xfc6fb6e300542d2a66d17f0edba07a687d8aa5a1411f17f7cbe112effde9d74d`, created in block 579953 by `0x2Fd1001bC60849576D8c8b698220B546f0B7f544`. The independent reader's registry decoder accepts it. No organizer permission or publication referencing this community key was present in the protocol query at verification time. The earlier publication remains independent because it does not include a community key; registration does not retroactively bind publications by slug.

## Authorized creator publication verified

Subsequent verification October 14, 2026:

- Entity: `0x41d1541e33d0479629d4e414655f9f0e2f486e808c1560e5cc2da7fcafd2e023`
- Creation transaction: `0xde8edd5947d630ea5cb2275b9c94cdbe95f5c0716b2b80e76adb9dcec462005b`
- Creation block: 580031
- Community key in payload: `0xfc6fb6e300542d2a66d17f0edba07a687d8aa5a1411f17f7cbe112effde9d74d`
- System creator: `0x2Fd1001bC60849576D8c8b698220B546f0B7f544`, matching the registered community creator.

The live entity is classified as Authorized organizer by the independent reader's contract implementation; the publisher's pure authorization function also returns true for the live creator/community pair. This check verifies current chain data and both authorization functions, not a screenshot of both interfaces. The earlier unbound event still classifies as Independent publisher. Delegated organizer grant/revoke remains tested automatically only, without wallet-signed end-to-end transactions.

## Public independent reader verified

October 16, 2026: https://kinora-reader.atom139139.workers.dev/?community=builders-sur loaded in a fresh browser and reported two active publications read directly from Tiramisu. Both entity keys above were present, with the same creator address. The first was labeled Independent publisher and the second Authorized organizer. No uncaught browser exceptions were observed. Root HTML, reader.js, authority.js and style.css each returned HTTP 200 with their expected content types. This verifies the public reader; the publisher is not publicly deployed yet.

## Public publisher verified

October 16, 2026: https://kinora-community.vercel.app/, /app/ and /reader/ each returned HTTP 200 publicly. A fresh browser opened the legacy root community link and reached /app/?source=arkiv&community=builders-sur with both filters preserved. The board retrieved both recorded synthetic entities directly from Tiramisu and displayed Independent publisher and Authorized organizer respectively. Both independent-reader links resolved to the Cloudflare workers.dev origin above. Orange accent was #ff8a3d. At 390px the document had no horizontal overflow; no uncaught browser exceptions were observed. No new wallet transaction was signed as part of this deployment check.

## Delegated organizer grant verified

Read-only verification on October 16, 2026: transaction `0xd99937b5a2a1e17fda50231211a8c3a094a2fe11d7a92b7488655c61faf08707` succeeded in block 665059, sent by the registered community creator. Immutable grant entity `0xe97e9f6dffb145f0c0ab2757166373e67d6e0e7186f29b91277c74b5ef8b01e9` references community `0xfc6fb6e300542d2a66d17f0edba07a687d8aa5a1411f17f7cbe112effde9d74d`, organizer `0xA13Dfd06727708D74bcf5db3DB1d725bc59ADEBC`, action `grant`. The publisher authorization function returns true for this organizer against the live permission history. Delegated publication and signed revocation are still pending. The user reported a MetaMask website warning; its cause has not been determined and the grant verification does not resolve that warning.

October 17: user reports the MetaMask warning has been resolved. No independent vendor classification check was performed. The first delegated-publication retry hit the local SDK expiry validation error documented in friction.md; no successful delegated publication has been recorded yet.
