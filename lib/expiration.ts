// Tiramisu produces one block every two seconds. Round storage lifetime up;
// the payload's endsAt still controls when readers stop showing the publication.
export function publicationLifetimeBlocks(endsAt: number, now = Date.now()): number {
  const remaining = endsAt - now;
  if (!Number.isFinite(remaining) || remaining <= 0) throw new Error('The publication has already expired. Choose a future end time.');
  return Math.ceil(remaining / 2000);
}
