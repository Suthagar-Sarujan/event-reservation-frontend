const CATEGORY_KEYWORDS: Record<string, string> = {
  mlb: 'baseball,stadium',
  baseball: 'baseball,stadium',
  nba: 'basketball,arena',
  nfl: 'football,stadium',
  nhl: 'hockey,arena',
  jazz: 'concert,stage',
  stadium_tours: 'stadium,architecture',
};

const DEFAULT_KEYWORDS = 'concert,crowd';

// A real category-matched stock photo, hotlinked from a free third-party
// service (SeatGeek imports carry no real photo - we don't hold rights to
// team/performer images). This service takes a moment to respond and
// occasionally fails outright, so it's never bound directly - see
// preloadEventPhoto, which loads it off-screen first.
function remotePhotoUrl(type: string | null | undefined, eventId: number): string {
  const keywords = CATEGORY_KEYWORDS[type ?? ''] ?? DEFAULT_KEYWORDS;
  return `https://loremflickr.com/800/600/${keywords}?lock=${eventId}`;
}

// Loads the real stock photo off-screen and calls onLoaded with its URL only
// once it has fully arrived - never on failure. Callers should render without
// an image until this fires (e.g. a plain card background), so a slow or
// failed photo request never shows a broken image.
export function preloadEventPhoto(
  type: string | null | undefined,
  eventId: number,
  onLoaded: (url: string) => void,
): void {
  const url = remotePhotoUrl(type, eventId);
  const img = new Image();
  img.onload = () => onLoaded(url);
  img.src = url;
}
