const CATEGORY_KEYWORDS: Record<string, string> = {
  mlb: 'baseball,stadium',
  nba: 'basketball,arena',
  nfl: 'football,helmet',
  nhl: 'hockey,arena',
  jazz: 'concert,stage',
  stadium_tours: 'stadium,architecture',
};

// SeatGeek imports have no real photo (we don't hold rights to team/performer
// images), so cards fall back to a category-matched stock photo instead of a
// blank gradient. Locked to the event id so the same event always gets the
// same photo instead of a new random one per page load.
export function fallbackEventImage(type: string | null | undefined, eventId: number): string {
  const keywords = CATEGORY_KEYWORDS[type ?? ''] ?? 'concert,crowd';
  return `https://loremflickr.com/800/600/${keywords}?lock=${eventId}`;
}
