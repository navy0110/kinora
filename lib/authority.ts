export type Community = { id: string; slug: string; name: string; description: string; creator: string };
export type OrganizerGrant = { communityKey: string; organizer: string; action: 'grant' | 'revoke'; creator: string; block: bigint };
export function authorizedPublisher(creator: string, community: Community, grants: OrganizerGrant[]): boolean {
  if (creator.toLowerCase() === community.creator.toLowerCase()) return true;
  const relevant = grants.filter(g => g.communityKey === community.id && g.organizer.toLowerCase() === creator.toLowerCase() && g.creator.toLowerCase() === community.creator.toLowerCase());
  if (!relevant.length) return false;
  const newest = relevant.reduce((a,b) => a.block > b.block ? a : b).block;
  const latest = relevant.filter(g => g.block === newest);
  // A revocation wins if contradictory grants were created in the same block.
  return latest.every(g => g.action === 'grant');
}
export function validateCommunity(slug: string, name: string, description: string) {
  if (!/^[a-z0-9-]{3,40}$/.test(slug)) throw new Error('Use a community identifier of 3–40 lowercase letters, numbers or hyphens.');
  if (!name.trim() || name.length > 80 || !description.trim() || description.length > 500) throw new Error('Add a name (up to 80 characters) and description (up to 500 characters).');
  return { slug, name: name.trim(), description: description.trim() };
}
