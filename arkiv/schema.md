# Open Community Publication Contract v1

Application name: Kinora. The protocol identifier is versioned independently of branding.

Network: Tiramisu, chain ID 7738577. SDK pinned by package-lock.json (0.8.1).

## Implemented entity: publication

JSON payload: community (slug), title (1–100 chars), description (1–2000 chars), topic (`Technology`, `Design`, `Public goods`), kind (`event`, `call`), mode (`online`, `in-person`), startsAt and endsAt (UTC epoch milliseconds), url (optional HTTP/HTTPS).

Indexed attributes: `protocol` str `common-ground:v1`; `entity_type` str `publication`; `community`, `kind`, `topic`, `mode` str; `starts_at`, `ends_at` u64 milliseconds. Readers validate payloads and check community/end attributes match. Author is the system creator field, never a self-declared payload address.

Immutable creation with `flags.readonly = true`. Expiration uses `ExpirationTime.fromBlocks(ceil((endsAt-now)/2000))`. This duration is converted into blocks by the SDK, so exact wall-clock expiry depends on chain timing. Readers additionally exclude endsAt <= now. Maximum initial lifetime 90 days. No lifetime renewal in this MVP.

## Queries

```ts
reader.select({ key: true, creator: true, payload: true, attributes: true })
  .where(eq('protocol', str('common-ground:v1')),
         eq('entity_type', str('publication')),
         gt('ends_at', u64(Date.now())))
  // Optional: .where(eq('community', str('builders-sur')))
  .limit(50).fetch()
```

Walk cursor pages with `hasNextPage()` and `next()`. UI sorts by start date and filters topic/kind/search locally. Separate clients can add typed topic/kind predicates directly. The namespace is a public protocol, not proof of a trusted publisher: anyone can write matching attributes. Clients must not treat matching slugs as verified community affiliation.

## Registered communities and organizer grants

Community entity: `entity_type = community`, `protocol = common-ground:v1`, `community = slug` (str). Payload: slug, name (1–80 characters), description (1–500 characters). Immutable, lifetime 365 days. Canonical identity is the entity key and its immutable system creator, not a globally unique slug. Duplicate slugs are permitted and remain different identities. If its entity expires, readers no longer mark it authorized.

Organizer permission entity: `entity_type = organizer_grant`, `protocol = common-ground:v1`, `community_key` (str). Payload: communityKey, organizer (EVM address), action (`grant`/`revoke`). Immutable, lifetime 365 days. Readers only accept permissions whose system creator equals the referenced community's creator. Latest creation block wins; a revocation wins contradictory actions in the same block. A later revocation expires later than the older grant, preventing that older grant from becoming effective again merely because the revocation expires. Grants have no lifetime extension in this implementation.

Registered publications include optional `communityKey` in payload and `community_key` indexed attribute. Readers verify their system creator against the community creator or effective organizer permission and require the payload slug to match the community. Legacy publications without a key remain independent and readable. Revocation changes current authorization labeling; it does not erase past publications.

Client write checks enforce these permissions before asking for publication. Arkiv remains permissionless: an alternative writer can submit unauthorized matching records, so read-side verification is required in every compatible client. Authorized means authorized by this community entity's creator, not independently verified as an external organization.

Both clients fetch the registry and permission entities directly from Arkiv with cursor pagination. If those reads fail, neither client shows an authorized badge. Registry reads are not pinned to a single shared block snapshot yet; changes can appear on the next refresh.

Publication storage lifetime is rounded up to a whole Tiramisu two-second block using `ExpirationTime.fromBlocks`. Readers continue to enforce the exact payload endsAt; block rounding does not extend the displayed event deadline.
