# Common Ground — proposed visual direction

Status: design proposal for review. Common Ground remains a working name. All interface copy stays in English.

## Product idea

A community noticeboard whose publications can be read through different clients. The design should feel like a place people gather, with clear evidence of who published each opportunity.

## Current interface audit

- The oversized introduction and decorative poster push the actual feed down the page.
- Community management, publishing setup, transaction receipts and discovery share the same visual priority.
- Small labels and metadata are hard to scan, especially on mobile.
- Different pastel card backgrounds and large decorative symbols compete with event titles.
- Wallet connection appears twice before the feed. Reading requires no wallet.
- Full transaction identifiers occupy valuable discovery space; keep them available through expandable evidence.
- Preserve working filters, source selection, authorization checks, dialogs and reader links.

## Proposed structure

### Landing — proposed `/`

Navigation: wordmark, How it works, Open reader, Open app.

Hero copy: “A gathering place. On common ground.”

Supporting copy: “Discover gatherings and open calls. Publish with your community. Read the same board through another client.”

Primary action: Explore the board. Secondary text link: Read independently.

Show a real, clearly identified product preview instead of a decorative poster or invented usage numbers.

Explain the actual sequence: discover without a wallet; publish with a wallet; verify the same entity in the independent reader. Explain current testnet status and expiration without promising permanent storage or universal censorship immunity.

### App — proposed `/app/`

Compact header: wordmark, Board, Open reader, wallet action.

Desktop: community selector beside the feed. Selected community name, short description, share action and Publish opportunity above search and filters. No marketing hero above the board.

Mobile: community selector above search; one-column feed; visible publish action with no overlay covering content.

Opportunity cards prioritize title, community and date. Authorization is a readable text label. Technical identifiers live in details. Use a date block and restrained typographic composition rather than large arbitrary symbols.

Publishing setup stays in the publishing flow. Community management stays accessible near the community heading. The last confirmed receipt stays available in an expandable evidence section.

Keep Demo and Tiramisu visibly distinct. Loading, empty, error and authorization-unavailable states must remain clear.

Routing must preserve existing shared links containing `source` and `community`; update sharing to the board route if the split is implemented.

## Visual system

Warm off-white ground, deep forest ink, one muted chartreuse accent. Small tone changes separate surfaces. Avoid multicolor topic decoration.

Retain DM Sans for interface text and Space Grotesk for headings to keep continuity and avoid adding dependencies. Use readable body text around 16px and metadata around 13px. Keep labels in sentence case.

Use a consistent spacing grid, restrained corner radii, strong keyboard focus and subtle hover feedback. Motion should support actions and respect reduced-motion preferences.

## Review and verification before release

Review desktop and mobile screenshots. Check feed visibility, long titles, long wallet addresses, keyboard navigation and dialogs. Verify filtering, community sharing, reader links and existing contract/authority tests. No wallet signatures are required merely to review the redesign.
