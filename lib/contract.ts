export const PROTOCOL = 'common-ground:v1';
export type Publication = { id: string; community: string; communityKey?: string; title: string; description: string; topic: string; kind: 'event' | 'call'; mode: 'online' | 'in-person'; startsAt: number; endsAt: number; url: string; creator: string; source: 'demo' | 'arkiv' };
export type Draft = Omit<Publication, 'id' | 'creator' | 'source'>;
export function validateDraft(value: Draft, now = Date.now()): Draft {
  if (value.communityKey !== undefined && !/^0x[\da-f]{64}$/i.test(value.communityKey)) throw new Error('Choose a valid registered community.');
  if (!value.title.trim() || value.title.length > 100) throw new Error('Title must contain 1 to 100 characters.');
  if (!/^[a-z0-9-]{3,40}$/.test(value.community)) throw new Error('Community must contain 3 to 40 lowercase letters, numbers or hyphens.');
  if (!value.description.trim() || value.description.length > 2000) throw new Error('Add a description of up to 2000 characters.');
  if (!['event', 'call'].includes(value.kind) || !['online', 'in-person'].includes(value.mode)) throw new Error('Invalid publication type.');
  if (!['Technology', 'Design', 'Public goods'].includes(value.topic)) throw new Error('Invalid topic.');
  if (!Number.isFinite(value.startsAt) || !Number.isFinite(value.endsAt) || value.startsAt <= now || value.endsAt <= value.startsAt) throw new Error('Choose future dates and an end after the start.');
  if (value.endsAt - now > 90 * 86400000) throw new Error('Maximum publication lifetime is 90 days.');
  if (value.url && !['https:', 'http:'].includes(new URL(value.url).protocol)) throw new Error('Link must begin with https:// or http://.');
  return { ...value, title: value.title.trim(), description: value.description.trim() };
}
export function decodePublication(raw: unknown): Draft | null {
  if (!raw || typeof raw !== 'object') return null;
  const p = raw as Record<string, unknown>;
  if (['community','title','description','topic','kind','mode','url'].some(k => typeof p[k] !== 'string') || typeof p.startsAt !== 'number' || typeof p.endsAt !== 'number') return null;
  try { return validateDraft(p as Draft, Math.min(p.startsAt - 1, Date.now())); } catch { return null; }
}
export function demoPublications(now: number): Publication[] {
  return [
    ['builders-sur', 'Let’s build a web for everyone.', 'An afternoon of code, ideas and collaboration. Bring your project or find one to join.', 'Technology', 'event', 'in-person', 1],
    ['estudio-abierto', 'Design for the common good', 'A gathering to design accessible tools with people from your community.', 'Design', 'event', 'online', 2],
    ['jardin-publico', 'Big ideas. More hands welcome.', 'An open call to contribute to public goods tools and documentation.', 'Public goods', 'call', 'online', 3],
    ['builders-sur', 'Getting started with open data', 'A hands-on workshop to publish and query data that any application can reuse.', 'Technology', 'event', 'online', 4],
  ].map(([community,title,description,topic,kind,mode,day], index) => ({ id: `demo-${index}`, community: String(community), title: String(title), description: String(description), topic: String(topic), kind: kind as Publication['kind'], mode: mode as Publication['mode'], startsAt: now + Number(day)*86400000, endsAt: now + (Number(day)+1)*86400000, url: '', creator: 'No onchain authorship: synthetic example', source: 'demo' }));
}
